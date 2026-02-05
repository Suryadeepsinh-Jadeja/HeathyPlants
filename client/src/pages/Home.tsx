import { useState, useEffect, useRef } from "react";
import * as tflite from "@tensorflow/tfjs-tflite";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import { CameraView } from "@/components/CameraView";
import { ScanResultCard } from "@/components/ScanResultCard";
import { useCreateScan } from "@/hooks/use-scans";
import Layout from "@/components/Layout";
import { Header } from "@/components/Header";
import { Loader2, RefreshCw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Configure TFLite path
tflite.setWasmPath("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-tflite@0.0.1-alpha.10/dist/");

type Prediction = {
  label: string;
  confidence: number;
};

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [model, setModel] = useState<tflite.TFLiteModel | null>(null);
  const [labels, setLabels] = useState<string[]>([]);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<Prediction[] | null>(null);
  const [topPrediction, setTopPrediction] = useState<Prediction | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  
  const createScan = useCreateScan();
  const { toast } = useToast();

  // Load model and labels on mount
  useEffect(() => {
    async function loadResources() {
      try {
        // Load Labels
        const labelResponse = await fetch('/models/labels.txt');
        const labelText = await labelResponse.text();
        const labelArray = labelText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        setLabels(labelArray);

        // Load Model
        const loadedModel = await tflite.loadTFLiteModel('/models/model.tflite');
        setModel(loadedModel);
        setIsModelLoading(false);
        console.log("Model loaded successfully");
      } catch (err) {
        console.error("Failed to load model:", err);
        toast({
          title: "Model Error",
          description: "Failed to load the analysis model. Please refresh.",
          variant: "destructive",
        });
        setIsModelLoading(false);
      }
    }
    loadResources();
  }, []);

  const analyzeImage = async (imageSrc: string) => {
    if (!model || labels.length === 0) return;

    setIsAnalyzing(true);
    setResult(null);
    setTopPrediction(null);
    setIsSaved(false);

    try {
      // Create an image element to process
      const img = new Image();
      img.src = imageSrc;
      await new Promise((resolve) => { img.onload = resolve; });

      // Preprocess image for MobileNet (224x224, normalized 0-1)
      const tensor = tf.tidy(() => {
        let t = tf.browser.fromPixels(img);
        t = tf.image.resizeBilinear(t, [224, 224]);
        t = t.expandDims(0);
        return t.div(255.0); // Normalize to 0-1
      });

      // Run inference
      const prediction = model.predict(tensor) as tf.Tensor;
      const values = await prediction.data();
      
      // Cleanup tensors
      tensor.dispose();
      prediction.dispose();

      // Map to labels
      const predictions: Prediction[] = Array.from(values)
        .map((confidence, i) => ({
          label: labels[i] || `Unknown (${i})`,
          confidence: confidence as number
        }))
        .sort((a, b) => b.confidence - a.confidence);

      setResult(predictions);
      setTopPrediction(predictions[0]);

    } catch (err) {
      console.error("Analysis failed:", err);
      toast({
        title: "Analysis Failed",
        description: "Could not process this image.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCapture = (imageSrc: string) => {
    setImage(imageSrc);
    analyzeImage(imageSrc);
  };

  const handleSave = () => {
    if (!image || !result || !topPrediction) return;

    createScan.mutate({
      imageUrl: image, // In real app, upload this first
      predictions: result,
      topLabel: topPrediction.label,
      confidence: topPrediction.confidence.toFixed(4)
    }, {
      onSuccess: () => {
        setIsSaved(true);
        toast({
          title: "Saved",
          description: "Scan result saved to history.",
        });
      }
    });
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setTopPrediction(null);
    setIsSaved(false);
  };

  return (
    <Layout>
      <Header 
        title="Rice Leaf Doctor" 
        subtitle="AI-powered disease detection" 
      />

      {isModelLoading ? (
        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6 relative">
             <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">Loading AI Model...</h3>
          <p className="text-muted-foreground mt-2 text-center max-w-[250px]">
            Downloading neural network resources. This happens once.
          </p>
        </div>
      ) : !image ? (
        <div className="animate-in fade-in duration-500">
          <CameraView onCapture={handleCapture} isProcessing={isAnalyzing} />
          
          <div className="mt-8">
            <h3 className="font-semibold text-foreground mb-3">How it works</h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                { step: 1, text: "Take a clear photo of the affected leaf" },
                { step: 2, text: "AI analyzes the patterns instantly" },
                { step: 3, text: "Get diagnosis and confidence score" },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-4 bg-card rounded-xl p-3 border border-border/50">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                    {item.step}
                  </span>
                  <p className="text-sm font-medium text-foreground/80">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-6">
          {isAnalyzing ? (
             <div className="bg-card rounded-3xl overflow-hidden border border-border shadow-xl">
               <div className="relative aspect-video">
                 <img src={image} className="w-full h-full object-cover blur-sm" />
                 <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center z-10">
                    <div className="w-full h-1 bg-white/30 absolute top-0 scan-animation" />
                    <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
                    <p className="text-white font-semibold text-lg drop-shadow-md">Analyzing Leaf...</p>
                 </div>
               </div>
             </div>
          ) : result && topPrediction ? (
            <>
              <ScanResultCard 
                scan={{
                  id: 0,
                  imageUrl: image,
                  predictions: result,
                  topLabel: topPrediction.label,
                  confidence: topPrediction.confidence.toFixed(4),
                  createdAt: new Date(),
                }} 
              />
              
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider pl-1">Top Predictions</h3>
                {result.slice(0, 3).map((pred, i) => (
                  <div key={i} className="bg-card p-3 rounded-xl border border-border flex items-center gap-3">
                    <div className="w-12 h-1 bg-muted rounded-full overflow-hidden flex-1 order-last max-w-[100px]">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${pred.confidence * 100}%` }}
                      />
                    </div>
                    <span className="flex-1 font-medium text-sm text-foreground">{pred.label}</span>
                    <span className="text-xs font-mono text-muted-foreground">{(pred.confidence * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button 
                  variant="outline" 
                  onClick={reset}
                  className="h-12 rounded-xl"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  New Scan
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={createScan.isPending || isSaved}
                  className="h-12 rounded-xl primary-gradient shadow-lg shadow-primary/20 hover:shadow-primary/30"
                >
                  {createScan.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : isSaved ? (
                    <Save className="w-4 h-4 mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {isSaved ? "Saved!" : "Save Result"}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-destructive">Something went wrong.</p>
              <Button onClick={reset} variant="ghost" className="mt-4">Try Again</Button>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
