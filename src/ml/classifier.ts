import { getModel, isModelReady } from './modelLoader';
import { USE_MOCK, runMockInference } from './mockClassifier';

export interface ClassificationResult {
  disease: string;
  confidence: number;
  reliable: boolean;       // Extrapolated: true if confidence > 0.60
  labelIndex: number;
}

export const RICE_LABELS = [
  'BacterialBlight',
  'Blast',
  'BrownSpot',
  'Healthy',
  'Tungro'
];

export const classifyImage = async (tensor: Float32Array): Promise<ClassificationResult> => {
  if (USE_MOCK) {
    return await runMockInference();
  }

  if (!isModelReady()) {
    throw new Error('Model is not ready for inference');
  }

  const model = getModel();
  if (!model) {
    throw new Error("Model is null despite being marked ready.");
  }

  try {
    // Run inference using the preprocessed Float32Array.
    const outputs = await model.run([tensor]);
    
    // Assumes the specific model being used returns a single output tensor of probabilities
    // We cast to any to correctly handle the runtime type which is usually a typed array.
    const predictions = outputs[0] as unknown as Float32Array | number[];

    if (!predictions || predictions.length === 0) {
      throw new Error("Received empty output from model.");
    }

    let maxConfidence = -1;
    let maxIndex = -1;

    for (let i = 0; i < predictions.length; i++) {
      if (predictions[i] > maxConfidence) {
        maxConfidence = predictions[i];
        maxIndex = i;
      }
    }

    if (maxConfidence < 0.5) {
      return {
        disease: "Unknown",
        confidence: 0,
        reliable: false,
        labelIndex: -1
      };
    }

    const labelName = RICE_LABELS[maxIndex] || "Unknown";

    return {
      disease: labelName,
      confidence: maxConfidence,
      reliable: true,
      labelIndex: maxIndex
    };

  } catch (error) {
    console.error("Classification inference error:", error);
    throw error;
  }
};
