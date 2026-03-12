import RNFS from 'react-native-fs';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import * as jpeg from 'jpeg-js';
import { Buffer } from 'buffer';

const INPUT_SIZE = 224;

export const preprocessImage = async (uri: string): Promise<Float32Array> => {
  try {
    // 1. Resize image to 224x224 pixels using the resizer module
    const resizedImage = await ImageResizer.createResizedImage(
      uri,
      INPUT_SIZE,
      INPUT_SIZE,
      'JPEG',
      100
    );

    // 2. Read the resized image file as Base64 string
    const base64Data = await RNFS.readFile(resizedImage.uri, 'base64');
    
    // 3. Convert Base64 into a raw Buffer
    const rawData = Buffer.from(base64Data, 'base64');

    // 4. Decode JPEG to get raw pixel values
    // rawImageData.data is a Uint8Array containing RGBA format pixels (4 channels)
    const rawImageData = jpeg.decode(rawData, { useTArray: true });

    // 5. Normalize pixel values to [0, 1] float range and convert to Float32Array
    // TFLite image classification models usually expect RGB formatted [0, 1] floats (3 channels)
    const numPixels = INPUT_SIZE * INPUT_SIZE;
    const float32Data = new Float32Array(numPixels * 3);

    let offset = 0;
    for (let i = 0; i < numPixels; i++) {
        // Extract RGB channels, ignoring Alpha
        const r = rawImageData.data[i * 4];
        const g = rawImageData.data[i * 4 + 1];
        const b = rawImageData.data[i * 4 + 2];

        // Normalize to [0, 1] range
        float32Data[offset++] = r / 255.0;
        float32Data[offset++] = g / 255.0;
        float32Data[offset++] = b / 255.0;
    }

    // Clean up temporary resized image file asynchronously
    RNFS.unlink(resizedImage.uri).catch(() => {});

    return float32Data;
  } catch (error) {
    console.error('Error preprocessing image:', error);
    throw error;
  }
};
