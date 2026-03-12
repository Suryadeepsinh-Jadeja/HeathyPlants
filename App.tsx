import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, StatusBar, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Camera } from 'react-native-vision-camera';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Svg, { Path } from 'react-native-svg';

import './src/data/translations';
import { loadModel } from './src/ml/modelLoader';
import AppNavigator from './src/navigation/AppNavigator';
import { theme } from './src/theme';
import ErrorBoundary from './src/components/ErrorBoundary';

// A simple Leaf icon SVG
const LeafIcon = ({ width, height, fill }: { width: number, height: number, fill: string }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill={fill}>
    <Path d="M17,8C8,10,5.9,16.17,3.82,21.34L5.71,22l1-2.3A4.49,4.49,0,0,0,8,20C19,20,22,3,22,3,21,5,14,5.25,9,6.25S2,11.5,2,13.5a6.22,6.22,0,0,0,1.75,3.75C7,8,17,8,17,8Z" />
  </Svg>
);

const SplashScreen = () => {
  const scale = useRef(new Animated.Value(0.5)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        tension: 10,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <View style={styles.splashContainer}>
      <StatusBar backgroundColor={theme.colors.primary} barStyle="light-content" />
      <Animated.View style={{ transform: [{ scale }], alignItems: 'center' }}>
        <LeafIcon width={100} height={100} fill={theme.colors.primary} />
      </Animated.View>
      <Animated.Text style={[styles.splashTitle, { opacity }]}>फसल रक्षक</Animated.Text>
      <Animated.Text style={[styles.splashSubtitle, { opacity }]}>FasalRakshak</Animated.Text>
    </View>
  );
};

const App = () => {
  const { t } = useTranslation();
  const [modelLoading, setModelLoading] = useState(true);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  useEffect(() => {
    const initModel = async () => {
      try {
        await loadModel();
      } catch (e) {
        console.error('Initial model load failed', e);
      } finally {
        setModelLoading(false);
      }
    };

    const checkPermissions = async () => {
      let cameraStatus = await Camera.getCameraPermissionStatus();
      if (cameraStatus !== 'granted') {
        cameraStatus = await Camera.requestCameraPermission();
      }

      if (Platform.OS === 'android' && Platform.Version < 33) {
        let storageStatus = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
        if (storageStatus !== RESULTS.GRANTED) {
          storageStatus = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
        }
      }

      setPermissionsGranted(cameraStatus === 'granted');
    };

    Promise.all([initModel(), checkPermissions()]);
  }, []);

  if (modelLoading) {
    return <SplashScreen />;
  }

  if (!permissionsGranted) {
    return (
      <View style={styles.centerContainer}>
        <StatusBar backgroundColor={theme.colors.background} barStyle="dark-content" />
        <Text style={styles.errorText}>{t('error.cameraPermission')}</Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <NavigationContainer>
        <StatusBar backgroundColor={theme.colors.primary} barStyle="light-content" />
        <AppNavigator />
      </NavigationContainer>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  splashTitle: {
    fontSize: theme.typography.hero,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginTop: 20,
  },
  splashSubtitle: {
    fontSize: theme.typography.xl,
    color: theme.colors.secondary,
    fontWeight: '600',
    marginTop: 5,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  errorText: {
    padding: 20,
    fontSize: theme.typography.lg,
    textAlign: 'center',
    color: theme.colors.danger,
  },
});

export default App;
