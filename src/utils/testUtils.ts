// Hardcoded test URIs pointing to dummy/remote paths for quick testing verification
// In a real device environment, these would map to local bundle assets or `require()` modules.
export const TEST_URIs = [
  'https://raw.githubusercontent.com/spMohanty/PlantVillage-Dataset/master/raw/color/Tomato___Bacterial_spot/00a7c269-3476-4d25-b744-44d6353cd921___GCREC_Bact.Sp_5807.JPG',
  'https://raw.githubusercontent.com/spMohanty/PlantVillage-Dataset/master/raw/color/Tomato___Early_blight/00c5c908-fc25-4710-a109-db143da23112___RS_Erly.B_7778.JPG',
  'https://raw.githubusercontent.com/spMohanty/PlantVillage-Dataset/master/raw/color/Tomato___healthy/0a0d6a11-afec-47d0-998d-4228cb61edef___GH_Hlthy_9796.JPG',
  'https://raw.githubusercontent.com/spMohanty/PlantVillage-Dataset/master/raw/color/Corn_(maize)___Common_rust_/0a0e50f5-961d-4034-adce-aa94e8ed71bc___RS_Rust_2308.JPG',
  'https://raw.githubusercontent.com/spMohanty/PlantVillage-Dataset/master/raw/color/Corn_(maize)___healthy/0a0cd5c3-beee-430a-a5f1-331da294cfbe___R.S_HL_8006.JPG',
];

export const runAutomatedTests = async (processImageFn: (uri: string) => Promise<void>) => {
  console.log("=== STARTING AUTOMATED TEST SUITE ===");
  for (let i = 0; i < TEST_URIs.length; i++) {
    console.log(`[Test ${i + 1}/${TEST_URIs.length}] Analyzing URI...`);
    try {
      await processImageFn(TEST_URIs[i]);
      // Give UI 2 seconds to breathe before forcefully advancing if needed, 
      // but in this flow we immediately push to ResultScreen anyway.
      await new Promise<void>(r => setTimeout(r, 2000));
    } catch (e) {
      console.error(`[Test ${i + 1}] FAILED`, e);
    }
  }
  console.log("=== AUTOMATED TEST SUITE FINISHED ===");
};
