## Packages
@tensorflow/tfjs | Core TensorFlow library for JavaScript
@tensorflow/tfjs-tflite | TFLite backend for running .tflite models in browser
@tensorflow/tfjs-backend-webgl | WebGL backend for GPU acceleration
recharts | Visualizing confidence scores/predictions

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  display: ["var(--font-display)"],
  body: ["var(--font-body)"],
}

Integration:
- TFLite model at /models/model.tflite
- Labels at /models/labels.txt
- Images are processed client-side first, then results saved to backend
