import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking, Animated, Modal, Button } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/AppNavigator';
import { preprocessImage } from '../ml/preprocessor';
import { classifyImage } from '../ml/classifier';
import { analyzeLighting } from '../utils/imageUtils';
import { theme } from '../theme';
import { runAutomatedTests, TEST_URIs } from '../utils/testUtils';

type CameraScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Camera'>;

const SkeletonLoader = () => {
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.4, duration: 800, useNativeDriver: true })
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <View style={styles.skeletonOverlay}>
       <Animated.View style={[styles.skeletonGuideBox, { opacity: pulseAnim }]} />
       <Animated.View style={[styles.skeletonTextBar, { opacity: pulseAnim }]} />
    </View>
  );
};

const CameraScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<CameraScreenNavigationProp>();
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const cameraRef = useRef<Camera>(null);

  const [torchOn, setTorchOn] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [flashOnCapture, setFlashOnCapture] = useState(false);
  
  // Dev Menu State & Shake logic
  const [devMenuVisible, setDevMenuVisible] = useState(false);
  const shakeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (autoMode && device && hasPermission && !analyzing) {
      interval = setInterval(() => {
        handleCapture();
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoMode, analyzing, device, hasPermission]);

  const processImageUri = async (uri: string) => {
    if (analyzing) return;
    setAnalyzing(true);
    setDevMenuVisible(false); // Close menu if open during test
    try {
      const tensor = await preprocessImage(uri);
      const lighting = analyzeLighting(tensor);
      
      if (lighting === 'too_dark' || lighting === 'too_bright') {
        Alert.alert(
          t('result.lowConfidence') || 'Lighting Issue',
          `Image appears ${lighting.replace('too_', '')}. Please move to better lighting if results are inaccurate.`
        );
      }

      const result = await classifyImage(tensor);
      
      if (result.confidence < 0.3) {
         Alert.alert('Analysis Failed', 'No clear leaf pattern detected. Please make sure the leaf is in focus.');
         setAnalyzing(false);
         return;
      }

      setAnalyzing(false);
      if (autoMode) setAutoMode(false);
      
      navigation.navigate('Result', {
        classification: result,
        imageUri: uri
      });

    } catch (error) {
      console.error(error);
      Alert.alert('Error', t('error.generic') || 'An error occurred during analysis.');
      setAnalyzing(false);
    }
  };

  const handleCapture = async () => {
    if (!cameraRef.current || analyzing) return;
    
    setFlashOnCapture(true);
    setTimeout(() => setFlashOnCapture(false), 100);

    try {
      const photo = await cameraRef.current.takePhoto({
        flash: torchOn ? 'on' : 'off'
      });
      await processImageUri(`file://${photo.path}`);
    } catch (e) {
      console.error('Failed to take photo', e);
    }
  };

  const openGallery = async () => {
    if (autoMode) setAutoMode(false);
    const response = await launchImageLibrary({ mediaType: 'photo', quality: 1 });
    if (response.didCancel || !response.assets || response.assets.length === 0) return;
    const asset = response.assets[0];
    if (asset.uri) {
      await processImageUri(asset.uri);
    }
  };

  // Hidden Dev button (tap 5 times to open since Shake API is complex in bare RN without expo-sensors)
  // Instead of Shake (requires native bridging), we'll add an invisible tap zone in the top center.
  let tapCount = useRef(0);
  const handleSecretTap = () => {
    tapCount.current += 1;
    if (tapCount.current >= 5) {
      setDevMenuVisible(true);
      tapCount.current = 0;
    }
    if (shakeTimeout.current) clearTimeout(shakeTimeout.current);
    shakeTimeout.current = setTimeout(() => { tapCount.current = 0; }, 2000);
  };

  const renderDevMenu = () => (
    <Modal visible={devMenuVisible} animationType="slide" transparent={true}>
      <View style={styles.devMenuOverlay}>
        <View style={styles.devMenuContainer}>
          <Text style={styles.devMenuTitle}>🛠 Developer Menu</Text>
          <Text style={styles.devMenuText}>Version: 1.0.0 MOCK_MODE: ON</Text>
          <Text style={styles.devMenuText}>Model Status: Ready (Simulated)</Text>

          <TouchableOpacity style={styles.devButton} onPress={() => runAutomatedTests(processImageUri)}>
            <Text style={styles.devButtonText}>Run Mock Test (5 Images)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.devButton} onPress={() => Alert.alert('Action', 'Languages reset.')}>
            <Text style={styles.devButtonText}>Switch Language (Mock)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.devButton} onPress={() => Alert.alert('History Cleared')}>
            <Text style={styles.devButtonText}>Clear History</Text>
          </TouchableOpacity>

          <Button title="Close Dev Menu" color="red" onPress={() => setDevMenuVisible(false)} />
        </View>
      </View>
    </Modal>
  );

  if (!hasPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>{t('error.cameraPermission') || 'Camera permission required.'}</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={() => Linking.openSettings()}>
          <Text style={styles.permissionButtonText}>Open Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.centerContainer}>
        <Text style={{ marginTop: 10, color: theme.colors.textSecondary }}>Initializing Camera...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={!analyzing}
        photo={true}
        torch={torchOn ? 'on' : 'off'}
      />

      {flashOnCapture && <View style={styles.flashOverlay} />}

      <View style={styles.overlayContainer} pointerEvents="none">
         <Text style={styles.instructionText}>{t('camera.instruction')}</Text>
         <View style={styles.guideBox} />
      </View>

      <View style={styles.topControls}>
        <TouchableOpacity style={styles.controlIcon} onPress={() => setTorchOn(!torchOn)}>
          <Text style={styles.iconText}>{torchOn ? '🔦' : '🚫🔦'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.autoModePill, autoMode && styles.autoModeActive]} 
          onPress={() => setAutoMode(!autoMode)}
        >
          <Text style={[styles.autoModeText, autoMode && styles.autoModeTextActive]}>
            {autoMode ? 'AUTO ON' : 'AUTO OFF'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomControls}>
        <TouchableOpacity style={styles.galleryButton} onPress={openGallery}>
           <Text style={styles.iconBig}>🖼</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.captureButton, autoMode && styles.captureButtonDisabled]} 
          onPress={handleCapture}
          disabled={autoMode || analyzing}
        >
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>

        <View style={styles.galleryButton} />
      </View>

      {/* Invisible Secret Button for Dev Menu (top center) */}
      <TouchableOpacity 
        style={styles.secretButton} 
        onPress={handleSecretTap} 
        activeOpacity={1}
      />

      {analyzing && <SkeletonLoader />}
      {renderDevMenu()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  secretButton: { position: 'absolute', top: 30, left: '30%', width: '40%', height: 50, zIndex: 100 },
  devMenuOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.8)', padding: 20 },
  devMenuContainer: { backgroundColor: 'white', padding: 20, borderRadius: 10 },
  devMenuTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: 'black' },
  devMenuText: { fontSize: 14, color: 'gray', marginBottom: 5 },
  devButton: { backgroundColor: '#333', padding: 15, borderRadius: 8, marginVertical: 8 },
  devButtonText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
  permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: theme.colors.background },
  permissionText: { fontSize: theme.typography.lg, color: theme.colors.danger, textAlign: 'center', marginBottom: 20 },
  permissionButton: { backgroundColor: theme.colors.primary, padding: 15, borderRadius: theme.borderRadius.medium, ...theme.shadows.light },
  permissionButtonText: { color: theme.colors.cardBackground, fontWeight: 'bold' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background },
  flashOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'white', zIndex: 10 },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  instructionText: {
    color: 'white',
    fontSize: theme.typography.lg,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.small,
    overflow: 'hidden',
    position: 'absolute',
    top: '15%',
    textAlign: 'center',
  },
  guideBox: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
    borderRadius: theme.borderRadius.large,
    backgroundColor: 'rgba(45, 125, 50, 0.1)'
  },
  topControls: {
    position: 'absolute',
    top: 90, // below header
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  controlIcon: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
    borderRadius: theme.borderRadius.pill,
  },
  iconText: { fontSize: 24, color: 'white' },
  iconBig: { fontSize: 32, color: 'white' },
  autoModePill: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.large,
    borderWidth: 1,
    borderColor: 'gray'
  },
  autoModeActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary
  },
  autoModeText: { color: '#ccc', fontWeight: 'bold' },
  autoModeTextActive: { color: theme.colors.cardBackground },
  bottomControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 2,
  },
  galleryButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    borderRadius: theme.borderRadius.pill,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonDisabled: { opacity: 0.5 },
  captureButtonInner: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: 'white',
  },
  skeletonOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(27, 27, 27, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  skeletonGuideBox: {
    width: 250,
    height: 250,
    borderRadius: theme.borderRadius.large,
    backgroundColor: theme.colors.primary,
  },
  skeletonTextBar: {
    width: 150,
    height: 20,
    borderRadius: theme.borderRadius.small,
    backgroundColor: theme.colors.primary,
    marginTop: 30,
  }
});

export default CameraScreen;
