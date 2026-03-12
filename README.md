# FasalRakshak / फसल रक्षक

An offline-first, multilingual React Native mobile application for identifying rice leaf diseases using purely on-device lightweight Computer Vision.

## How the Machine Learning Pipeline Works
Currently, the application runs on a **Mock Classifier engine** due to the absence of a pre-trained `.tflite` weights file.

### Switching from MOCK to REAL Production Inference:
1. Locate `/src/ml/mockClassifier.ts`.
2. Change the exported flag: `export const USE_MOCK = false;`
3. The framework will automatically bind inputs back into `classifier.ts`, pinging `react-native-fast-tflite` natively!
4. Place your trained model exactly here: `/assets/models/rice_disease_model.tflite`

## Training Your Own Plant Disease Model

The framework expects a TFLite file conforming perfectly to the following signatures: 
- **Input Tensor**: `[1, 224, 224, 3]` (Float32 Array holding RGB 0-1 mapped pixels)
- **Output Tensor**: `[1, 7]` (Float32 Array mapped exactly to: `Healthy`, `Rice Blast`, `Brown Spot`, `Leaf Smut`, `Bacterial Blight`, `Sheath Blight`, `False Smut`)

### 1. Download Dataset
Grab the publicly accessible datasets:
- PlantVillage Dataset (Kaggle or spMohanty's Github Raw files)
- Extract explicitly the Rice Leaf directories matching the 7 classes.

### 2. Training Architecture
We recommend `MobileNetV3-Small` or `EfficientNet-Lite0` for exceptional Android device-edge tradeoff:

```python
import tensorflow as tf

# Load base model without top layer
base_model = tf.keras.applications.MobileNetV3Small(
    input_shape=(224, 224, 3), include_top=False, weights='imagenet'
)

# Freeze base
base_model.trainable = False

# Build top classifier mapping to our exact 7 labels
model = tf.keras.Sequential([
    base_model,
    tf.keras.layers.GlobalAveragePooling2D(),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(7, activation='softmax')
])

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Train against directory...
# model.fit(train_dataset, validation_data=val_dataset, epochs=15)
```

### 3. TFLite Export
Absolutely crucial—ensure inputs are cast safely without arbitrary dynamic ranges in the TFLite converter.
```python
converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.optimizations = [tf.lite.Optimize.DEFAULT]
tflite_model = converter.convert()

with open('rice_disease_model.tflite', 'wb') as f:
  f.write(tflite_model)
```

## Running the App

```bash
# Terminal 1: Metro Bundler
npm start

# Terminal 2: Android Build Layer
npm run android
```

Generate a Release Built APK safely configured omitting TFLite uncompressed files by entering `/android` and running `./gradlew assembleRelease`.
