export interface LocalizedText {
  en: string;
  hi: string;
  ta: string;
}

export interface LocalizedList {
  en: string[];
  hi: string[];
  ta: string[];
}

export interface DiseaseInfo {
  id: string;
  name: LocalizedText;
  severity: "low" | "medium" | "high" | "none";
  symptoms: LocalizedList;
  causes: LocalizedText;
  organicTreatment: LocalizedList;
  chemicalTreatment: LocalizedList;
  prevention: LocalizedList;
  affectedStage: string;
  spreadRisk: "low" | "medium" | "high";
  colorCode: string;
}

export const ALL_DISEASES: DiseaseInfo[] = [
  {
    id: "healthy",
    name: {
      en: "Healthy",
      hi: "स्वस्थ",
      ta: "ஆரோக்கியமான"
    },
    severity: "none",
    symptoms: {
      en: ["Vigorous green leaves", "No spots or lesions", "Healthy tillering and panicle development"],
      hi: ["हरे और मजबूत पत्ते", "कोई धब्बे या घाव नहीं", "स्वस्थ बालियाँ"],
      ta: ["ஆரோக்கியமான பச்சை இலைகள்", "எந்த புள்ளிகளும் அல்லது காயங்களும் இல்லை", "ஆரோக்கியமான கதிர் வளர்ச்சி"]
    },
    causes: {
      en: "Proper nutrition, good soil health, and favorable weather conditions.",
      hi: "उचित पोषण, अच्छी मिट्टी का स्वास्थ्य, और अनुकूल मौसम की स्थिति।",
      ta: "சரியான ஊட்டச்சத்து, நல்ல மண் வளம் மற்றும் சாதகமான வானிலை."
    },
    organicTreatment: { en: [], hi: [], ta: [] },
    chemicalTreatment: { en: [], hi: [], ta: [] },
    prevention: {
      en: ["Maintain balanced fertilization", "Ensure proper water management", "Use disease-resistant seeds"],
      hi: ["संतुलित खाद बनाए रखें", "जल प्रबंधन सुनिश्चित करें", "रोग प्रतिरोधी बीजों का उपयोग करें"],
      ta: ["சீரான உரமிடுதலை பராமரிக்கவும்", "சரியான நீர் நிர்வாகத்தை உறுதி செய்யவும்", "நோய் எதிர்ப்பு விதைகளை பயன்படுத்தவும்"]
    },
    affectedStage: "All stages",
    spreadRisk: "low",
    colorCode: "#4CAF50"
  },
  {
    id: "rice_blast",
    name: {
      en: "Rice Blast",
      hi: "धान का झुलसा रोग",
      ta: "குலை நோய்"
    },
    severity: "high",
    symptoms: {
      en: ["Spindle-shaped spots with grey centers and brown margins on leaves", "Lesions on nodes causing the stem to break", "Rotting of the neck of the panicle (Neck Blast)"],
      hi: ["पत्तियों पर धुंधले भूरे किनारे वाले धब्बे", "गांठों पर घाव जिससे तना टूट सकता है", "बालियों की गर्दन का सड़ना (नेक ब्लास्ट)"],
      ta: ["இலைகளில் சாம்பல் நிற மையம் மற்றும் பழுப்பு நிற விளிம்புகளுடன் சுழல் வடிவ புள்ளிகள்", "கணுக்களில் ஏற்படும் காயங்களால் தண்டு உடைதல்", "கதிர் கழுத்து அழுகல் நோய்"]
    },
    causes: {
      en: "Caused by the fungus Magnaporthe oryzae. Highly favored by high humidity, overcast skies, and excessive nitrogen.",
      hi: "मैग्नापोर्थे ओराइजी फफूंद के कारण। अत्यधिक नमी और नाइट्रोजन के कारण फैलता है।",
      ta: "மாக்னபோர்தே ஒரைசே என்ற பூஞ்சையால் ஏற்படுகிறது. அதிக ஈரப்பதம் மற்றும் அதிக தழைச்சத்து இதற்கு சாதகமானது."
    },
    organicTreatment: {
      en: ["Spray Pseudomonas fluorescens (10g/liter)", "Use Neem seed kernel extract (5%)", "Apply cow dung slurry to seeds"],
      hi: ["स्यूडोमोनास फ्लूरेसेंस (10g/liter) का छिड़काव", "नीम के बीज का अर्क (5%) का उपयोग", "बीजों पर गाय के गोबर का लेप"],
      ta: ["சூடோமோனாஸ் புளோரசன்ஸ் தெளிக்கவும் (10 கிராம்/லிட்டர்)", "5% வேப்பங்கொட்டை சாறை பயன்படுத்தவும்", "விதைகளில் சாணக்கரைசலை தடவவும்"]
    },
    chemicalTreatment: {
      en: ["Spray Tricyclazole 75% WP @ 0.6 g/liter of water", "Apply Isoprothiolane 40% EC @ 1.5 ml/liter", "Use Kasugamycin 3% SL"],
      hi: ["ट्राईसाइक्लोज़ोल 75% WP (0.6 ग्राम/लीटर) का छिड़काव", "आइसोप्रोथियोलेन 40% EC (1.5 मिली/लीटर) डालें", "कासुगामाइसिन 3% SL का प्रयोग करें"],
      ta: ["ட்ரைசைக்ளாசோல் 75% WP (0.6 கி/லிட்டர்) தெளிக்கவும்", "ஐசோபுரோதியோலேன் 40% EC (1.5 மிலி/லிட்டர்) பயன்படுத்தவும்", "கசுகாமைசின் 3% SL பயன்படுத்தவும்"]
    },
    prevention: {
      en: ["Avoid excessive nitrogen fertilizers", "Destroy infected crop residues", "Use resistant varieties (e.g., MTU 1001)"],
      hi: ["अत्यधिक नाइट्रोजन उर्वरकों से बचें", "संक्रमित फसल के अवशेषों को नष्ट करें", "प्रतिरोधी किस्मों (जैसे MTU 1001) का उपयोग करें"],
      ta: ["அதிகப்படியான தழைச்சத்து உரங்களை தவிர்க்கவும்", "பாதிக்கப்பட்ட பயிர் எச்சங்களை அழிக்கவும்", "நோய் எதிர்ப்பு ரகங்களை பயன்படுத்தவும்"]
    },
    affectedStage: "Seedling to grain formation",
    spreadRisk: "high",
    colorCode: "#F44336"
  },
  {
    id: "brown_spot",
    name: {
      en: "Brown Spot",
      hi: "भूरा धब्बा रोग",
      ta: "பழுப்பு புள்ளி நோய்"
    },
    severity: "medium",
    symptoms: {
      en: ["Oval-shaped brown spots with a grey or whitish center on leaves", "Infected seeds show dark brown or black discoloration", "Stunted growth and reduced tillering"],
      hi: ["पत्तियों पर अण्डाकार भूरे धब्बे जिनका केंद्र सफेद होता है", "संक्रमित बीजों पर गहरा भूरा या काला रंग", "पौधे का विकास रुकना"],
      ta: ["இலைகளில் வெள்ளை அல்லது சாம்பல் நிற மையத்துடன் நீள்வட்ட பழுப்பு நிறப் புள்ளிகள்", "பாதிக்கப்பட்ட விதைகள் அடர் பழுப்பு அல்லது கருப்பு நிறமாக மாறும்", "வளர்ச்சி குன்றுதல்"]
    },
    causes: {
      en: "Caused by fungus Bipolaris oryzae. Poor soil nutrition and water stress exacerbate it.",
      hi: "बाइपोलारिस ओराइजी फफूंद के कारण। खराब मिट्टी और पानी की कमी से बढ़ता है।",
      ta: "பைபோலாரிஸ் ஒரைசே பூஞ்சையால் ஏற்படுகிறது. மோசமான மண் ஊட்டச்சத்து மற்றும் தண்ணீர் தட்டுப்பாட்டால் இது அதிகரிக்கிறது."
    },
    organicTreatment: {
      en: ["Soak seeds in hot water (54°C) for 10 minutes", "Spray Neem oil extract", "Improve soil nutrition with organic manure"],
      hi: ["बीजों को गर्म पानी (54°C) में 10 मिनट भिगोएं", "नीम के तेल का छिड़काव", "जैविक खाद से मिट्टी का पोषण सुधारें"],
      ta: ["விதைகளை சுடுநீரில் (54°C) 10 நிமிடங்கள் ஊறவைக்கவும்", "வேப்ப எண்ணெய் தெளிக்கவும்", "இயற்கை உரங்கள் மூலம் மண் வளத்தை மேம்படுத்தவும்"]
    },
    chemicalTreatment: {
      en: ["Spray Mancozeb 75% WP @ 2g/liter", "Spray Propiconazole 25 EC @ 1ml/liter", "Seed treatment with Thiram"],
      hi: ["मैनकोजेब 75% WP (2 ग्राम/लीटर) का छिड़काव", "प्रोपिकोनाजोल 25 EC (1 मिली/लीटर) का छिड़काव", "थीरम के साथ बीज उपचार"],
      ta: ["மேன்கோசெப் 75% WP (2 கிராம்/லிட்டர்) தெளிக்கவும்", "ப்ரோபிகோனசோல் 25 EC (1 மிலி/லிட்டர்) தெளிக்கவும்", "திரம் கொண்டு விதை நேர்த்தி செய்யவும்"]
    },
    prevention: {
      en: ["Apply timely and balanced NPK fertilizers", "Ensure a proper watering schedule", "Use certified disease-free seeds"],
      hi: ["सही समय पर संतुलित NPK उर्वरक डालें", "सही सिंचाई सुनिश्चित करें", "प्रमाणित रोग मुक्त बीजों का उपयोग करें"],
      ta: ["சரியான நேரத்தில் சமச்சீர் NPK உரங்களை இடவும்", "முறையான நீர்ப்பாசன திட்டத்தை உறுதி செய்யவும்", "சான்றளிக்கப்பட்ட நோய் இல்லாத விதைகளை பயன்படுத்தவும்"]
    },
    affectedStage: "Seedling to maturity",
    spreadRisk: "medium",
    colorCode: "#FF9800"
  },
  {
    id: "leaf_smut",
    name: {
      en: "Leaf Smut",
      hi: "पत्ती की कंडिका",
      ta: "இலை கரிப்பு நோய்"
    },
    severity: "low",
    symptoms: {
      en: ["Small, slightly raised black spots (sori) on leaves", "Spots can rupture and release black powdery spores", "Usually affects only older leaves"],
      hi: ["पत्तियों पर छोटे, उभरे हुए काले धब्बे (सोराई)", "धब्बे फूटकर काले पाउडर जैसे बीजाणु छोड़ते हैं", "आमतौर पर केवल पुरानी पत्तियों को प्रभावित करता है"],
      ta: ["இலைகளில் சிறிய, சற்று உயர்த்தப்பட்ட கருப்பு புள்ளிகள்", "புள்ளிகள் வெடித்து கருப்பு தூள் போன்ற வித்துக்களை வெளியிடும்", "பொதுவாக பழைய இலைகளை மட்டுமே பாதிக்கும்"]
    },
    causes: {
      en: "A minor fungal disease caused by Entyloma oryzae. High nitrogen and dense canopies can favor it.",
      hi: "एंटिलोमा ओराइजी फफूंद के कारण। अत्यधिक नाइट्रोजन और घने पौधों से बढ़ता है।",
      ta: "என்டிலோமா ஒரைசே என்ற பூஞ்சையால் ஏற்படும் ஒரு சிறிய நோய். அதிக தழைச்சத்து இதற்கு சாதகமானது."
    },
    organicTreatment: {
      en: ["Usually requires no treatment as it rarely causes yield loss", "Ensure proper spacing between crops", "Avoid excess manure"],
      hi: ["आमतौर पर किसी उपचार की आवश्यकता नहीं होती", "पौधों के बीच उचित दूरी सुनिश्चित करें", "अत्यधिक खाद से बचें"],
      ta: ["பொதுவாக எந்த சிகிச்சையும் தேவையில்லை, இது மகசூல் இழப்பை ஏற்படுத்துவது அரிது", "பயிர்களுக்கு இடையே சரியான இடைவெளியை உறுதி செய்யவும்", "அதிகப்படியான உரத்தை தவிர்க்கவும்"]
    },
    chemicalTreatment: {
      en: ["Copper-based fungicides can be used if severity is unexpectedly high", "Propiconazole @ 1ml/liter"],
      hi: ["गंभीरता अधिक होने पर कॉपर युक्त कवकनाशी का उपयोग किया जा सकता है", "प्रोपिकोनाजोल (1 मिली/लीटर)"],
      ta: ["பாதிப்பு அதிகம் இருந்தால் தாமிர அடிப்படையிலான பூஞ்சாள கொல்லிகளை பயன்படுத்தலாம்", "புரொபிகோனசோல் 1மிலி/லிட்டர்"]
    },
    prevention: {
      en: ["Avoid dense planting", "Reduce nitrogen fertilizer dosage"],
      hi: ["घनी रोपाई से बचें", "नाइट्रोजन उर्वरक की खुराक कम करें"],
      ta: ["நெருக்கமான நடவை தவிர்க்கவும்", "தழைச்சத்து உரத்தின் அளவை குறைக்கவும்"]
    },
    affectedStage: "Late tillering to maturity",
    spreadRisk: "low",
    colorCode: "#FFEB3B"
  },
  {
    id: "bacterial_blight",
    name: {
      en: "Bacterial Blight",
      hi: "जीवाणु झुलसा",
      ta: "பாக்டீரியா இலை கருகல் நோய்"
    },
    severity: "high",
    symptoms: {
      en: ["Water-soaked yellowish stripes on leaf blades", "Leaves turn yellow, then white and later die", "Infected seedlings wither and die (Kresek phase)"],
      hi: ["पत्तियों पर पीले रंग की धारियां जो पानी से भीगी लगती हैं", "पत्तियां पीली, फिर सफेद हो जाती हैं और सूख कर मर जाती हैं", "संक्रमित छोटे पौधे सूख कर मर जाते हैं (क्रेसेक चरण)"],
      ta: ["இலைகளில் நீர் கோர்த்த மஞ்சள் நிற கோடுகள்", "இலைகள் மஞ்சளாகி, பின் வெள்ளையாகி காய்ந்துவிடும்", "பாதிக்கப்பட்ட நாற்றுக்கள் வாடி இறந்துவிடும்"]
    },
    causes: {
      en: "Caused by the bacteria Xanthomonas oryzae. Spreads rapidly during heavy rain, high winds, and continuous flooding.",
      hi: "ज़ैंथोमोनास ओराइजी बैक्टीरिया के कारण। भारी बारिश और तेज़ हवाओं के दौरान तेज़ी से फैलता है।",
      ta: "சாந்தோமோனாஸ் ஒரைசே என்ற பாக்டீரியாவால் ஏற்படுகிறது. பலத்த மழை மற்றும் அதிக காற்று வீசும்போது வேகமாக பரவும்."
    },
    organicTreatment: {
      en: ["Spray fresh cow dung extract (20%)", "Apply Trichoderma as seed treatment", "Drain the field during periods of infection"],
      hi: ["ताजे गाय के गोबर का घोल (20%) का छिड़काव", "ट्राइकोडर्मा से बीज उपचार", "संक्रमण के दौरान खेत से पानी निकाल दें"],
      ta: ["புதிய சாணக்கரைசலை (20%) தெளிக்கவும்", "ட்ரைக்கோடெர்மாவை விதை நேர்த்தியாக பயன்படுத்தவும்", "நோய்த்தொற்றின் போது வயலில் இருந்து தண்ணீரை வடிகட்டவும்"]
    },
    chemicalTreatment: {
      en: ["Spray Streptomycin sulphate + Tetracycline (e.g. Streptocycline) @ 1g/10 liters", "Apply Copper Oxychloride 50% WP @ 2.5g/liter along with antibiotics"],
      hi: ["स्ट्रेप्टोमाइसिन+टेट्रासाइक्लिन (1 ग्राम/10 लीटर) का छिड़काव", "एंटीबायोटिक के साथ कॉपर ऑक्सीक्लोराइड 50% WP (2.5 ग्राम/लीटर) डालें"],
      ta: ["ஸ்ட்ரெப்டோமைசின் + டெட்ராசைக்ளின் (1 கிராம்/10 லிட்டர்) தெளிக்கவும்", "நுண்ணுயிர் கொல்லிகளுடன் காப்பர் ஆக்சிக்குளோரைடு 50% WP (2.5 கிராம்/லிட்டர்) பயன்படுத்தவும்"]
    },
    prevention: {
      en: ["Use resistant varieties (e.g., IR 64)", "Do not clip seedling roots before transplanting", "Destroy infected stubble and weeds"],
      hi: ["प्रतिरोधी किस्मों (जैसे IR 64) का उपयोग करें", "रोपाई से पहले पोध की जड़ों को न काटें", "संक्रमित पराली और खरपतवार को नष्ट करें"],
      ta: ["நோய் எதிர்ப்பு ரகங்களை பயன்படுத்தவும்", "நடுவதற்கு முன் நாற்றின் வேர்களை நறுக்குவதை தவிர்க்கவும்", "பாதிக்கப்பட்ட தட்டை மற்றும் களைகளை அழிக்கவும்"]
    },
    affectedStage: "Seedling to grain formation",
    spreadRisk: "high",
    colorCode: "#F44336"
  },
  {
    id: "sheath_blight",
    name: {
      en: "Sheath Blight",
      hi: "शीथ ब्लाइट (पर्णच्छद झुलसा)",
      ta: "இலை உறை கருகல் நோய்"
    },
    severity: "medium",
    symptoms: {
      en: ["Oval or irregular greenish-grey spots on leaf sheaths near water level", "Spots enlarge and develop brown margins with grey centers", "In severe cases, leads to lodging of the crop"],
      hi: ["पानी की सतह के पास पर्णच्छद (शीथ) पर हरे-भूरे धब्बे", "धब्बे बड़े हो जाते हैं और उनका केंद्र ग्रे और किनारे भूरे होते हैं", "गंभीर स्थिति में फसल गिर सकती है"],
      ta: ["நீர் மட்டத்திற்கு அருகில் இலை உறைகளில் நீள்வட்ட அல்லது ஒழுங்கற்ற பச்சை கலந்த சாம்பல் நிற புள்ளிகள்", "புள்ளிகள் பெரிதாகி, சாம்பல் நிற மையத்துடன் பழுப்பு நிற விளிம்புகளை உருவாக்கும்", "கடுமையான பாதிப்பில் பயிர் சாய்ந்துவிடும்"]
    },
    causes: {
      en: "Fungal disease from Rhizoctonia solani. Favored by high seeding rates, closed canopy, and high nitrogen.",
      hi: "राइजोक्टोनिया सोलानी फफूंद के कारण। घनी बुवाई और उच्च नाइट्रोजन से बढ़ता है।",
      ta: "ரைசோக்டோனியா சோலானி என்ற பூஞ்சை நோய். நெருக்கமான நடவு மற்றும் அதிக தழைச்சத்து இதற்கு சாதகமானது."
    },
    organicTreatment: {
      en: ["Soil application of Trichoderma viride", "Use Pseudomonas fluorescens (10g/liter) spray", "Ensure field is weed-free"],
      hi: ["मिट्टी में ट्राइकोडर्मा विरिडी का प्रयोग", "स्यूडोमोनास फ्लूरेसेंस (10 ग्राम/लीटर) का छिड़काव", "खेत को खरपतवार मुक्त रखें"],
      ta: ["மண்ணில் ட்ரைக்கோடெர்மா விரிடியை இடுதல்", "சூடோமோனாஸ் புளோரசன்ஸ் பவுடரை தெளிக்கவும்", "வயலில் களையின்றி பராமரிக்கவும்"]
    },
    chemicalTreatment: {
      en: ["Spray Propiconazole 25% EC @ 1ml/liter", "Spray Hexaconazole 5% EC @ 2ml/liter", "Validamycin 3% L @ 2ml/liter"],
      hi: ["प्रोपिकोनाजोल 25% EC (1 मिली/लीटर) का छिड़काव", "हेक्साकोनाजोल 5% EC (2 मिली/लीटर) का छिड़काव", "वैलिडामाइसिन 3% L (2 मिली/लीटर) का छिड़काव"],
      ta: ["ப்ரோபிகோனசோல் 25% EC (1 மிலி/லிட்டர்) தெளிக்கவும்", "ஹெக்சாகோனசோல் 5% EC (2 மிலி/லிட்டர்) தெளிக்கவும்", "வாலிடமைசின் 3% L (2 மிலி/லிட்டர்) தெளிக்கவும்"]
    },
    prevention: {
      en: ["Increase plant spacing", "Drain the field for a few days at maximum tillering stage", "Apply adequate Potassium fertilizers"],
      hi: ["पौधों के बीच की दूरी बढ़ाएं", "अधिकतम कल्ले फूटने के समय खेत से कुछ दिनों के लिए पानी निकाल दें", "पर्याप्त पोटाश उर्वरक डालें"],
      ta: ["பயிர்களுக்கு இடையே இடைவெளியை அதிகரிக்கவும்", "அதிகபட்ச தூர்கட்டும் பருவத்தில் சில நாட்கள் வயலில் தண்ணீரை வடிக்கவும்", "போதிய பொட்டாஷ் உரங்களை இடவும்"]
    },
    affectedStage: "Tillering to maturity",
    spreadRisk: "medium",
    colorCode: "#FF9800"
  },
  {
    id: "false_smut",
    name: {
      en: "False Smut",
      hi: "आभासी कंड (हल्दी रोग)",
      ta: "பொய் கரிப்பூட்டை நோய்"
    },
    severity: "medium",
    symptoms: {
      en: ["Individual grains transformed into velvety spore balls", "Spore balls are initially orange-yellow, turning dark green/black", "Only a few grains in a panicle are usually affected"],
      hi: ["धान के दाने मखमली बीजाणु गेंदों में बदल जाते हैं", "बीजाणु आरंभ में नारंगी-पीले होते हैं, बाद में गहरे हरे/काले हो जाते हैं", "आमतौर पर एक बाली में कुछ ही दाने प्रभावित होते हैं"],
      ta: ["தனிப்பட்ட தானியங்கள் வெல்வெட் போன்ற வித்து பந்துகளாக மாறும்", "வித்து பந்துகள் ஆரம்பத்தில் ஆரஞ்சு-மஞ்சள் நிறமாகவும், பின்னர் அடர் பச்சை/கருப்பு நிறமாகவும் மாறும்", "பொதுவாக ஒரு கதிரில் சில தானியங்கள் மட்டுமே பாதிக்கப்படும்"]
    },
    causes: {
      en: "Caused by Ustilaginoidea virens fungus. High humidity and rain during flowering/panicle emergence lead to outbreaks.",
      hi: "अस्टिलैगिनोइडिया विरेन्स फफूंद के कारण। फूल आने के समय उच्च नमी और बारिश से फैलता है।",
      ta: "உஸ்டிலாஜினாய்டியா வைரென்ஸ் பூஞ்சையால் ஏற்படுகிறது. பூக்கும் தருணத்தில் அதிக ஈரப்பதம் மற்றும் மழையால் இது பரவுகிறது."
    },
    organicTreatment: {
      en: ["It is difficult to treat organically once infected", "Avoid late planting", "Remove and destroy infected panicles carefully"],
      hi: ["संक्रमण के बाद जैविक रूप से उपचार करना मुश्किल है", "देर से बुवाई न करें", "संक्रमित बालियों को सावधानी से हटाएं और नष्ट करें"],
      ta: ["தொற்று ஏற்பட்டவுடன் இயற்கையான முறையில் குணப்படுத்துவது கடினம்", "தாமதமாக நடுவிடுவதை தவிர்க்கவும்", "பாதிக்கப்பட்ட கதிர்களை கவனமாக அகற்றி அழிக்கவும்"]
    },
    chemicalTreatment: {
      en: ["Prophylactic spray of Copper Oxychloride 50 WP @ 2.5g/liter at booting stage", "Propiconazole 25 EC @ 1ml/liter just before flowering"],
      hi: ["फूल आने से पहले कॉपर ऑक्सीक्लोराइड 50 WP (2.5 ग्राम/लीटर) का छिड़काव", "फूल आने से ठीक पहले प्रोपिकोनाजोल 25 EC (1 मिली/लीटर) का छिड़काव"],
      ta: ["கதிர் வரும் பருவத்தில் காப்பர் ஆக்சிக்குளோரைடு 50 WP (2.5 கி/லி) தெளிக்கவும்", "பூக்கும் தருணத்திற்கு சற்று முன்பு ப்ரோபிகோனசோல் 25 EC (1 மிலி/லி) தெளிக்கவும்"]
    },
    prevention: {
      en: ["Use disease-free seeds from healthy crops", "Provide balanced nitrogen (avoid excessive late applications)", "Apply prophylactic sprays before flowering"],
      hi: ["स्वस्थ फसल से प्राप्त रोग मुक्त बीजों का उपयोग करें", "संतुलित नाइट्रोजन दें (देर से अत्यधिक उपयोग से बचें)", "फूल आने से पहले एहतियाती छिड़काव करें"],
      ta: ["ஆரோக்கியமான பயிர்களில் இருந்து பெறப்பட்ட விதைகளை பயன்படுத்தவும்", "சமச்சீரான தழைச்சத்தை கொடுக்கவும்", "பூப்பதற்கு முன் தடுப்பு மருந்துகளை தெளிக்கவும்"]
    },
    affectedStage: "Flowering and maturity",
    spreadRisk: "medium",
    colorCode: "#FF9800"
  }
];

export const getDiseaseInfo = (diseaseName: string, lang: string = "en"): DiseaseInfo | undefined => {
  if (!diseaseName) return undefined;
  
  const normalizedSearch = diseaseName.toLowerCase().trim();
  
  return ALL_DISEASES.find(disease => {
    // Exact internal ID match check
    if (disease.id === normalizedSearch) return true;
    
    // Check main English name match
    if (disease.name.en.toLowerCase() === normalizedSearch) return true;
    
    return false;
  });
};
