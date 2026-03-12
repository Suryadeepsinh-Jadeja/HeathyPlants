import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules, Platform } from 'react-native';

const LANGUAGE_STORE_KEY = '@app_language';

const resources = {
  en: {
    translation: {
      app: {
        name: "FasalRakshak",
        tagline: "Protect your crop, protect your income"
      },
      nav: {
        home: "Home",
        camera: "Scan",
        history: "History",
        about: "About"
      },
      home: {
        title: "Crop Health Scanner",
        subtitle: "Identify rice diseases instantly",
        scanButton: "Scan Crop Array",
        galleryButton: "Upload from Gallery",
        recentScans: "Recent Scans",
        noScansYet: "No scans found yet. Try scanning a leaf!",
        tip: "Farming Tip: Ensure balanced fertilizer application to prevent diseases like Rice Blast."
      },
      camera: {
        instruction: "Point camera at the affected leaf",
        analyzing: "Analyzing...",
        holdStill: "Hold Still",
        tapToCapture: "Tap to Capture"
      },
      result: {
        healthy: "Healthy Crop",
        diseaseFound: "Disease Detected",
        confidence: "Confidence",
        symptoms: "Symptoms",
        treatment: "Recommended Treatment",
        organic: "Organic Methods",
        chemical: "Chemical Methods",
        prevention: "Prevention Strategies",
        severity: "Severity Level",
        scanAgain: "Scan Another Leaf",
        saveResult: "Save Result",
        lowConfidence: "Image unclear, please retake in good lighting"
      },
      error: {
        modelNotLoaded: "AI Model could not be loaded. Please restart the app.",
        cameraPermission: "Camera access is required to scan leaves.",
        generic: "Something went wrong. Please try again."
      },
      language: {
        select: "Select Language",
        en: "English",
        hi: "हिन्दी (Hindi)",
        ta: "தமிழ் (Tamil)"
      }
    }
  },
  hi: {
    translation: {
      app: {
        name: "फसल रक्षक",
        tagline: "अपनी फसल बचाएं, अपनी आय बचाएं"
      },
      nav: {
        home: "होम",
        camera: "स्कैन",
        history: "इतिहास",
        about: "हमारे बारे में"
      },
      home: {
        title: "फसल स्वास्थ्य स्कैनर",
        subtitle: "धान के रोगों की तुरंत पहचान करें",
        scanButton: "कैमरा खोलें",
        galleryButton: "गैलरी से चुनें",
        recentScans: "हाल के स्कैन",
        noScansYet: "अभी तक कोई स्कैन नहीं। पत्ती स्कैन करने का प्रयास करें!",
        tip: "कृषि टिप: धान का झुलसा जैसे रोगों को रोकने के लिए संतुलित उर्वरक सुनिश्चित करें।"
      },
      camera: {
        instruction: "कैमरे को प्रभावित पत्ती की ओर करें",
        analyzing: "विश्लेषण कर रहा है...",
        holdStill: "स्थिर रखें",
        tapToCapture: "फोटो खींचने के लिए टैप करें"
      },
      result: {
        healthy: "स्वस्थ फसल",
        diseaseFound: "रोग का पता चला",
        confidence: "सटीकता",
        symptoms: "लक्षण",
        treatment: "सुझाया गया उपचार",
        organic: "जैविक तरीके",
        chemical: "रासायनिक तरीके",
        prevention: "बचाव के तरीके",
        severity: "गंभीरता स्तर",
        scanAgain: "दूसरी पत्ती स्कैन करें",
        saveResult: "परिणाम सेव करें",
        lowConfidence: "छवि अस्पष्ट है, कृपया अच्छी रोशनी में फिर से लें"
      },
      error: {
        modelNotLoaded: "एआई मॉडल लोड नहीं हो सका। कृपया ऐप को फिर से शुरू करें।",
        cameraPermission: "पत्तियों को स्कैन करने के लिए कैमरे की अनुमति आवश्यक है।",
        generic: "कुछ गलत हो गया। कृपया पुन: प्रयास करें।"
      },
      language: {
        select: "भाषा चुनें",
        en: "English",
        hi: "हिन्दी",
        ta: "தமிழ் (Tamil)"
      }
    }
  },
  ta: {
    translation: {
      app: {
        name: "பயிர் காப்பான் (FasalRakshak)",
        tagline: "உங்கள் பயிரைப் பாதுகாக்கவும், உங்கள் வருமானத்தைப் பாதுகாக்கவும்"
      },
      nav: {
        home: "முகப்பு",
        camera: "ஸ்கேன்",
        history: "வரலாறு",
        about: "பற்றி"
      },
      home: {
        title: "பயிர் சுகாதார ஸ்கேனர்",
        subtitle: "நெல் நோய்களை உடனடியாக அடையாளம் காணவும்",
        scanButton: "கேமராவை திறக்கவும்",
        galleryButton: "தொகுப்பிலிருந்து பதிவேற்றவும்",
        recentScans: "சமீபத்திய ஸ்கேன்கள்",
        noScansYet: "இன்னும் ஸ்கேன்கள் இல்லை. இலையை ஸ்கேன் செய்ய முயற்சிக்கவும்!",
        tip: "விவசாய குறிப்பு: குலை நோய் போன்ற நோய்களைத் தடுக்க சீரான உரப் பயன்பாட்டை உறுதி செய்யவும்."
      },
      camera: {
        instruction: "பாதிக்கப்பட்ட இலையை நோக்கி கேமராவைக் காட்டுங்கள்",
        analyzing: "பகுப்பாய்வு செய்கிறது...",
        holdStill: "அசையாமல் நிற்கவும்",
        tapToCapture: "புகைப்படம் எடுக்க தொடவும்"
      },
      result: {
        healthy: "ஆரோக்கியமான பயிர்",
        diseaseFound: "நோய் கண்டறியப்பட்டது",
        confidence: "நம்பிக்கை",
        symptoms: "அறிகுறிகள்",
        treatment: "பரிந்துரைக்கப்பட்ட சிகிச்சை",
        organic: "இயற்கை முறைகள்",
        chemical: "இரசாயன முறைகள்",
        prevention: "தடுப்பு உத்திகள்",
        severity: "தீவிர நிலை",
        scanAgain: "மற்றொரு இலையை ஸ்கேன் செய்யவும்",
        saveResult: "முடிவை சேமிக்கவும்",
        lowConfidence: "படம் தெளிவாக இல்லை, தயவுசெய்து நல்ல வெளிச்சத்தில் மீண்டும் எடுக்கவும்"
      },
      error: {
        modelNotLoaded: "AI மாடலை ஏற்ற முடியவில்லை. தயவுசெய்து ஆப்ஸை மறுதொடக்கம் செய்யவும்.",
        cameraPermission: "இலைகளை ஸ்கேன் செய்ய கேமரா அணுகல் தேவை.",
        generic: "ஏதோ தவறு நடந்துவிட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்."
      },
      language: {
        select: "மொழியைத் தேர்ந்தெடுக்கவும்",
        en: "English",
        hi: "हिन्दी (Hindi)",
        ta: "தமிழ்"
      }
    }
  }
};

const getDeviceLanguage = (): string => {
  try {
    const locale =
      Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
          NativeModules.SettingsManager.settings.AppleLanguages[0]
        : NativeModules.I18nManager.localeIdentifier;

    const shortLocale = locale ? locale.substring(0, 2) : 'en';

    if (Object.keys(resources).includes(shortLocale)) {
      return shortLocale;
    }
  } catch (error) {
    console.warn("Could not retrieve device locale. Defaulting to 'en'.", error);
  }
  return 'en';
};

const languageDetectorPlugin = {
  type: 'languageDetector' as const,
  async: true,
  init: () => {},
  detect: async (callback: (lng: string) => void) => {
    try {
      const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORE_KEY);
      if (storedLanguage) {
        return callback(storedLanguage);
      } else {
        return callback(getDeviceLanguage());
      }
    } catch (error) {
      console.warn('Error reading language from AsyncStorage', error);
      return callback(getDeviceLanguage());
    }
  },
  cacheUserLanguage: async (language: string) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORE_KEY, language);
    } catch (error) {
      console.warn('Error setting language to AsyncStorage', error);
    }
  },
};

i18n
  .use(initReactI18next)
  .use(languageDetectorPlugin)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already inherently protects from XSS
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
