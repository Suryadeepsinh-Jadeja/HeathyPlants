import { useRef, useState, useCallback, useEffect } from "react";
import { Camera, Image as ImageIcon, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraViewProps {
  onCapture: (imageSrc: string) => void;
  isProcessing: boolean;
}

export function CameraView({ onCapture, isProcessing }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState(false);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setActive(true);
    } catch (err) {
      console.error("Camera error:", err);
      setError("Unable to access camera. Please try uploading an image instead.");
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setActive(false);
    }
  }, [stream]);

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageSrc = canvas.toDataURL("image/jpeg");
        stopCamera();
        onCapture(imageSrc);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onCapture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  if (active) {
    return (
      <div className="fixed inset-0 bg-black z-[100] flex flex-col">
        <div className="relative flex-1 bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          <button 
            onClick={stopCamera}
            className="absolute top-6 right-6 p-2 rounded-full bg-black/40 text-white backdrop-blur-md"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Guidelines overlay */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-[80%] aspect-square border-2 border-white/50 rounded-3xl relative">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl -mt-1 -ml-1"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl -mt-1 -mr-1"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl -mb-1 -ml-1"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl -mb-1 -mr-1"></div>
            </div>
            <p className="absolute bottom-32 text-white/80 text-sm font-medium bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
              Center the leaf in the frame
            </p>
          </div>
        </div>

        <div className="bg-black p-8 flex justify-center items-center gap-8 pb-12">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <ImageIcon className="w-6 h-6" />
          </button>
          
          <button
            onClick={capturePhoto}
            disabled={isProcessing}
            className="w-20 h-20 rounded-full bg-white border-4 border-gray-300 shadow-lg flex items-center justify-center transform active:scale-95 transition-all"
          >
            <div className="w-16 h-16 rounded-full bg-white border-2 border-black/10" />
          </button>
          
          <div className="w-14" /> {/* Spacer for balance */}
        </div>
        
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileUpload}
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div 
        onClick={startCamera}
        className="aspect-[4/3] rounded-3xl bg-muted border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 group"
      >
        <div className="w-16 h-16 rounded-full bg-background shadow-sm group-hover:shadow-md flex items-center justify-center text-primary transition-all group-hover:scale-110 duration-300">
          <Camera className="w-8 h-8" />
        </div>
        <div className="text-center px-4">
          <p className="font-semibold text-foreground">Tap to take a photo</p>
          <p className="text-sm text-muted-foreground mt-1">or select from gallery</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          className="h-12 rounded-xl border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload File
        </Button>
        <Button 
          className="h-12 rounded-xl primary-gradient shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
          onClick={startCamera}
        >
          <Camera className="w-4 h-4 mr-2" />
          Open Camera
        </Button>
      </div>

      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileUpload}
      />
      
      {error && (
        <p className="mt-4 text-sm text-destructive bg-destructive/10 p-3 rounded-lg text-center">
          {error}
        </p>
      )}
    </div>
  );
}
