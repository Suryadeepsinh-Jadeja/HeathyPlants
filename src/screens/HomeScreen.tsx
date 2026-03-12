import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { isModelReady } from '../ml/modelLoader';
import { theme } from '../theme';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const ObjectTips = [
  "Ensure balanced fertilizer application to prevent diseases like Rice Blast.",
  "Water deeply but rarely to encourage deep root growth.",
  "Check crop leaves weekly for early signs of fungal infections."
];

const HomeScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [tipIndex, setTipIndex] = useState(0);
  const [modelReady, setModelReady] = useState(isModelReady());

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % ObjectTips.length);
    }, 5000);

    const modelInterval = setInterval(() => {
      if (isModelReady() && !modelReady) {
        setModelReady(true);
      }
    }, 1000);

    return () => {
      clearInterval(tipInterval);
      clearInterval(modelInterval);
    };
  }, [modelReady]);

  return (
    <View style={styles.container}>
      {/* Spacer for clear header area */}
      <View style={{ height: 100 }} />

      <View style={styles.headerContainer}>
        <Image 
          source={require('../../assets/images/app_icon.png')} 
          style={styles.logo}
          defaultSource={require('../../assets/images/leaf_placeholder.png')}
        />
        <Text style={styles.title}>{t('app.name')}</Text>
        <Text style={styles.tagline}>{t('app.tagline')}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.cameraButton]}
          onPress={() => navigation.navigate('Camera')}
        >
          <Text style={styles.actionButtonIcon}>📷</Text>
          <Text style={styles.actionButtonText}>{t('home.scanButton')}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.galleryButton]}
          onPress={() => {
            console.log("Gallery button pressed");
          }}
        >
          <Text style={styles.actionButtonIcon}>🖼</Text>
          <Text style={styles.actionButtonText}>{t('home.galleryButton')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statusContainer}>
        <View style={[styles.statusIndicator, { backgroundColor: modelReady ? theme.colors.primary : theme.colors.warning }]} />
        <Text style={styles.statusText}>
          {modelReady ? "Model Ready" : "Loading Model..."}
        </Text>
      </View>

      <View style={styles.tipContainer}>
        <Text style={styles.tipLabel}>💡 Farming Tip:</Text>
        <Text style={styles.tipText}>{ObjectTips[tipIndex]}</Text>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: theme.typography.xxl,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  tagline: {
    fontSize: theme.typography.lg,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20, 
  },
  actionButton: {
    width: width * 0.85,
    padding: 24,
    borderRadius: theme.borderRadius.large,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.medium,
  },
  cameraButton: {
    backgroundColor: theme.colors.primary,
  },
  galleryButton: {
    backgroundColor: theme.colors.secondary,
  },
  actionButtonIcon: {
    fontSize: theme.typography.xxl,
    marginRight: 15,
  },
  actionButtonText: {
    fontSize: theme.typography.xl,
    fontWeight: 'bold',
    color: theme.colors.cardBackground,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: theme.typography.md,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  tipContainer: {
    backgroundColor: theme.colors.cardBackground,
    padding: 20,
    borderRadius: theme.borderRadius.medium,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    marginBottom: 20,
    ...theme.shadows.light,
  },
  tipLabel: {
    fontWeight: 'bold',
    fontSize: theme.typography.lg,
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  tipText: {
    fontSize: theme.typography.md,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  }
});

export default HomeScreen;
