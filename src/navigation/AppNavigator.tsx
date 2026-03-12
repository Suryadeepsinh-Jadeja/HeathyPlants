import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import HomeScreen from '../screens/HomeScreen';
import CameraScreen from '../screens/CameraScreen';
import ResultScreen from '../screens/ResultScreen';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { ClassificationResult } from '../ml/classifier';
import { theme } from '../theme';

export type RootStackParamList = {
  Home: undefined;
  Camera: undefined;
  Result: {
    classification: ClassificationResult;
    imageUri: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.cardBackground,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: theme.typography.xl,
        },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          headerTitle: "फसल रक्षक / FasalRakshak",
          headerBackVisible: false,
          headerRight: () => (
            <View>
              <LanguageSwitcher />
            </View>
          ),
        }}
      />
      <Stack.Screen 
        name="Camera" 
        component={CameraScreen} 
        options={{
          headerTitle: t('nav.camera'),
        }}
      />
      <Stack.Screen 
        name="Result" 
        component={ResultScreen} 
        options={({ navigation }) => ({
          headerTitle: t('result.diseaseFound'),
          headerRight: () => (
            <TouchableOpacity 
              style={styles.scanAgainButton}
              onPress={() => navigation.navigate('Camera')}
            >
              <Text style={styles.scanAgainText}>{t('result.scanAgain')}</Text>
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  scanAgainButton: {
    backgroundColor: theme.colors.cardBackground,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.pill,
    ...theme.shadows.light,
  },
  scanAgainText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    fontSize: theme.typography.md,
  }
});

export default AppNavigator;
