import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert, Animated } from 'react-native';
import { useTranslation } from 'react-i18next';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';

import { RootStackParamList } from '../navigation/AppNavigator';
import { getDiseaseInfo, DiseaseInfo } from '../data/diseases';
import { theme } from '../theme';

type ResultScreenRouteProp = RouteProp<RootStackParamList, 'Result'>;
type ResultScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Result'>;

const AnimatedConfidenceBar = ({ confidence, color }: { confidence: number, color: string }) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: Math.round(confidence * 100),
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [confidence, animatedWidth]);

  const widthInterpolated = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.confidenceBarWrapper}>
      <Animated.View style={[styles.confidenceBarFill, { width: widthInterpolated, backgroundColor: color }]} />
    </View>
  );
};

const ResultScreen = () => {
  const { t, i18n } = useTranslation();
  const route = useRoute<ResultScreenRouteProp>();
  const navigation = useNavigation<ResultScreenNavigationProp>();
  const viewShotRef = useRef<ViewShot>(null);

  const { classification, imageUri } = route.params;

  const [activeTab, setActiveTab] = useState<'organic' | 'chemical'>('organic');
  const [preventionExpanded, setPreventionExpanded] = useState(false);

  const lang = (i18n.language === 'en' || i18n.language === 'hi' || i18n.language === 'ta') ? i18n.language : 'en';
  const diseaseData: DiseaseInfo | undefined = getDiseaseInfo(classification.disease, lang);
  const isHealthy = diseaseData?.id === 'healthy';

  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.75) return theme.colors.primary;
    if (conf >= 0.5) return theme.colors.warning;
    return theme.colors.danger;
  };

  const shareScreenshot = async () => {
    try {
      if (viewShotRef.current && viewShotRef.current.capture) {
        const uri = await viewShotRef.current.capture();
        await Share.open({
          url: uri,
          message: `${t('app.name')} - ${diseaseData ? diseaseData.name[lang] : classification.disease} (${Math.round(classification.confidence * 100)}%)`,
        });
      }
    } catch (error: any) {
      if (error.message !== 'User did not share') {
        Alert.alert('Error', 'Could not share the result.');
      }
    }
  };

  const renderBadgeAndImage = () => {
    const confidencePct = Math.round(classification.confidence * 100);
    const confColor = getConfidenceColor(classification.confidence);
    const badgeColor = diseaseData?.colorCode || theme.colors.textSecondary;
    const displayDiseaseName = diseaseData ? diseaseData.name[lang as 'en'|'hi'|'ta'] : classification.disease;

    return (
      <View style={styles.topSection}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.leafImage} />
          <View style={[styles.badgeOverlay, { backgroundColor: badgeColor }]}>
            <Text style={styles.badgeText}>{displayDiseaseName}</Text>
          </View>
        </View>

        <View style={styles.confidenceContainer}>
          <Text style={styles.confidenceLabel}>{t('result.confidence')}: {confidencePct}%</Text>
          <AnimatedConfidenceBar confidence={classification.confidence} color={confColor} />
        </View>

        {!classification.reliable && (
          <View style={styles.warningBanner}>
            <Text style={styles.warningText}>⚠️ {t('result.lowConfidence')}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderHealthyState = () => (
    <View style={styles.healthyCard}>
      <Text style={styles.healthyTitle}>🎉 {t('result.healthy')}</Text>
      <Text style={styles.healthyDesc}>
        {diseaseData ? diseaseData.causes[lang as 'en'|'hi'|'ta'] : 'Your crop looks great! Keep up the good work.'}
      </Text>
    </View>
  );

  const renderDiseaseInfo = () => {
    if (!diseaseData) return null;
    const l = lang as 'en' | 'hi' | 'ta';

    const getSeverityLabel = (sev: string) => {
      if (sev === 'high') return 'High / गंभीर';
      if (sev === 'medium') return 'Medium / मध्यम';
      return 'Low / कम';
    };

    return (
      <View style={styles.cardSection}>
        <View style={styles.rowInfo}>
           <View style={[styles.severityChip, { backgroundColor: diseaseData.colorCode }]}>
             <Text style={styles.chipText}>{t('result.severity')}: {getSeverityLabel(diseaseData.severity)}</Text>
           </View>
        </View>

        <Text style={styles.detailLabel}>Stage: <Text style={styles.detailValue}>{diseaseData.affectedStage}</Text></Text>
        <Text style={styles.detailLabel}>Spread Risk: <Text style={styles.detailValue}>{diseaseData.spreadRisk.toUpperCase()}</Text></Text>

        <Text style={styles.sectionTitle}>{t('result.symptoms')}</Text>
        {diseaseData.symptoms[l].map((sym, idx) => (
          <Text key={idx} style={styles.bulletItem}>• {sym}</Text>
        ))}

        <Text style={styles.sectionTitle}>Causes</Text>
        <Text style={styles.paragraphText}>{diseaseData.causes[l]}</Text>
      </View>
    );
  };

  const renderTreatment = () => {
    if (!diseaseData) return null;
    const l = lang as 'en' | 'hi' | 'ta';

    const remedies = activeTab === 'organic' ? diseaseData.organicTreatment[l] : diseaseData.chemicalTreatment[l];
    const icon = activeTab === 'organic' ? '🌿' : '🧪';

    return (
      <View style={styles.cardSection}>
        <Text style={styles.sectionTitle}>{t('result.treatment')}</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'organic' && styles.tabActive]}
            onPress={() => setActiveTab('organic')}
          >
             <Text style={[styles.tabText, activeTab === 'organic' && styles.tabTextActive]}>
               {t('result.organic')}
             </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'chemical' && styles.tabActive]}
            onPress={() => setActiveTab('chemical')}
          >
             <Text style={[styles.tabText, activeTab === 'chemical' && styles.tabTextActive]}>
               {t('result.chemical')}
             </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.remedyContainer}>
          {remedies.length === 0 ? (
            <Text style={styles.paragraphText}>No specific treatments listed for this category.</Text>
          ) : (
            remedies.map((remedy, idx) => (
              <View key={idx} style={styles.remedyCard}>
                <Text style={styles.remedyIcon}>{icon}</Text>
                <Text style={styles.remedyText}>{idx + 1}. {remedy}</Text>
              </View>
            ))
          )}
        </View>
      </View>
    );
  };

  const renderPrevention = () => {
    if (!diseaseData) return null;
    const l = lang as 'en' | 'hi' | 'ta';
    
    return (
      <View style={[styles.cardSection, { marginBottom: 30 }]}>
        <TouchableOpacity 
          style={styles.collapsibleHeader} 
          onPress={() => setPreventionExpanded(!preventionExpanded)}
        >
          <Text style={styles.sectionTitle}>{t('result.prevention')} {preventionExpanded ? '▼' : '▶'}</Text>
        </TouchableOpacity>
        
        {preventionExpanded && (
          <View style={styles.collapsibleBody}>
            {diseaseData.prevention[l].map((prev, idx) => (
              <Text key={idx} style={styles.bulletItem}>🛡️ {prev}</Text>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Spacer below transparent header */}
      <View style={{ height: 90 }} />
      <ScrollView>
        <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.9 }}>
          <View style={styles.viewShotContainer}>
            {renderBadgeAndImage()}
            {isHealthy ? renderHealthyState() : (
              <>
                {renderDiseaseInfo()}
                {renderTreatment()}
                {renderPrevention()}
              </>
            )}
            <View style={{ height: 20 }} />
          </View>
        </ViewShot>
      </ScrollView>

      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.scanAgainButton} onPress={() => navigation.navigate('Camera')}>
          <Text style={styles.scanAgainText}>{t('result.scanAgain')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareButton} onPress={shareScreenshot}>
          <Text style={styles.shareText}>📤 {t('result.saveResult')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  viewShotContainer: { backgroundColor: theme.colors.background },
  topSection: { padding: 15 },
  imageContainer: {
    ...theme.shadows.medium,
    borderRadius: theme.borderRadius.large,
    backgroundColor: theme.colors.cardBackground,
  },
  leafImage: {
    width: '100%',
    height: 250,
    borderRadius: theme.borderRadius.large,
    resizeMode: 'cover',
  },
  badgeOverlay: {
    position: 'absolute',
    top: 25,
    right: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.large,
    ...theme.shadows.medium,
  },
  badgeText: { color: theme.colors.cardBackground, fontWeight: '900', fontSize: theme.typography.lg },
  confidenceContainer: { marginTop: 15 },
  confidenceLabel: { fontSize: theme.typography.lg, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: 5 },
  confidenceBarWrapper: { height: 10, width: '100%', backgroundColor: '#E0E0E0', borderRadius: theme.borderRadius.pill, overflow: 'hidden' },
  confidenceBarFill: { height: '100%', borderRadius: theme.borderRadius.pill },
  
  warningBanner: { marginTop: 12, backgroundColor: '#FFF9C4', padding: 10, borderRadius: theme.borderRadius.small, borderWidth: 1, borderColor: '#FBC02D' },
  warningText: { color: '#F57F17', fontWeight: 'bold', fontSize: theme.typography.md, textAlign: 'center' },
  
  healthyCard: { margin: 15, padding: 20, backgroundColor: '#E8F5E9', borderRadius: theme.borderRadius.medium, borderColor: theme.colors.primary, borderWidth: 2, alignItems: 'center', ...theme.shadows.light },
  healthyTitle: { fontSize: theme.typography.xxl, fontWeight: 'bold', color: theme.colors.primary, marginBottom: 10 },
  healthyDesc: { fontSize: theme.typography.lg, color: '#388E3C', textAlign: 'center', lineHeight: 22 },

  cardSection: { padding: 15, backgroundColor: theme.colors.cardBackground, marginHorizontal: 15, borderRadius: theme.borderRadius.medium, marginBottom: 15, ...theme.shadows.light },
  rowInfo: { flexDirection: 'row', marginBottom: 10 },
  severityChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: theme.borderRadius.pill },
  chipText: { color: theme.colors.cardBackground, fontWeight: 'bold', fontSize: theme.typography.sm },
  detailLabel: { fontSize: theme.typography.md, color: theme.colors.textSecondary, marginBottom: 4 },
  detailValue: { fontWeight: 'bold', color: theme.colors.textPrimary },
  sectionTitle: { fontSize: theme.typography.lg, fontWeight: 'bold', color: theme.colors.primary, marginTop: 15, marginBottom: 8 },
  bulletItem: { fontSize: theme.typography.md, color: theme.colors.textSecondary, lineHeight: 24, paddingLeft: 10, marginBottom: 4 },
  paragraphText: { fontSize: theme.typography.md, color: theme.colors.textSecondary, lineHeight: 22 },

  tabContainer: { flexDirection: 'row', marginBottom: 15, backgroundColor: theme.colors.background, borderRadius: theme.borderRadius.small, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: theme.borderRadius.small },
  tabActive: { backgroundColor: theme.colors.primary },
  tabText: { fontWeight: '600', color: theme.colors.textSecondary },
  tabTextActive: { color: theme.colors.cardBackground },
  remedyContainer: { marginTop: 5 },
  remedyCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#F9F9F9', padding: 12, borderRadius: theme.borderRadius.small, marginBottom: 8, borderWidth: 1, borderColor: '#EEEEEE' },
  remedyIcon: { fontSize: 20, marginRight: 10, marginTop: -2 },
  remedyText: { flex: 1, fontSize: theme.typography.md, color: theme.colors.textPrimary, lineHeight: 22 },

  collapsibleHeader: { paddingVertical: 5 },
  collapsibleBody: { marginTop: 10 },

  actionContainer: { flexDirection: 'row', padding: 15, backgroundColor: theme.colors.cardBackground, ...theme.shadows.medium, paddingBottom: 30 },
  scanAgainButton: { flex: 1, backgroundColor: '#E0E0E0', padding: 16, borderRadius: theme.borderRadius.medium, marginRight: 10, alignItems: 'center' },
  scanAgainText: { color: theme.colors.textPrimary, fontWeight: 'bold', fontSize: theme.typography.lg },
  shareButton: { flex: 1, backgroundColor: theme.colors.primary, padding: 16, borderRadius: theme.borderRadius.medium, marginLeft: 10, alignItems: 'center' },
  shareText: { color: theme.colors.cardBackground, fontWeight: 'bold', fontSize: theme.typography.lg }
});

export default ResultScreen;
