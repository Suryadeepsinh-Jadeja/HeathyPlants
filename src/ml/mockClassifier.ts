import { ClassificationResult, RICE_LABELS } from './classifier';

export const USE_MOCK = false;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const runMockInference = async (): Promise<ClassificationResult> => {
  // Simulate 800ms inference delay
  await sleep(800);

  const rand = Math.random();
  let selectedDisease = '';
  
  // 40% Healthy, 60% split across diseases
  if (rand < 0.40) {
    selectedDisease = 'Healthy';
  } else {
    // Pick a random disease from the remaining labels
    const diseaseLabels = RICE_LABELS.filter(label => label !== 'Healthy');
    const randomIndex = Math.floor(Math.random() * diseaseLabels.length);
    selectedDisease = diseaseLabels[randomIndex];
  }

  // Generate realistic confidence (0.65 to 0.97)
  const baseConfidence = 0.65;
  const confidence = baseConfidence + (Math.random() * 0.32);

  return {
    disease: selectedDisease,
    confidence: Number(confidence.toFixed(2)),
    reliable: confidence >= 0.70,
    labelIndex: RICE_LABELS.indexOf(selectedDisease)
  };
};
