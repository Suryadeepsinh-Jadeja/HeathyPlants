import { loadTensorflowModel, TensorflowModel } from 'react-native-fast-tflite';

let modelInstance: TensorflowModel | null = null;
let ready = false;

export const loadModel = async (): Promise<void> => {
  if (modelInstance) {
    return;
  }

  try {
    const MODEL_PATH = require('../../assets/rice_disease_model.tflite');
    modelInstance = await loadTensorflowModel(MODEL_PATH);
    ready = true;
    console.log('TFLite model loaded successfully');
  } catch (error) {
    console.warn('Failed to load TFLite model, using fallback behavior.', error);
    modelInstance = null;
    ready = false;
  }
};

export const getModel = (): TensorflowModel | null => {
  return modelInstance;
};

export const isModelReady = (): boolean => {
  return ready;
};
