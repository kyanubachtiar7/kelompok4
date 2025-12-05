import { useState, useEffect, useRef } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Terminal } from 'lucide-react';

const CameraStream = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState('Memuat model...');
  const [personCount, setPersonCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let model: cocoSsd.ObjectDetection;
    let animationFrameId: number;

    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await new Promise((resolve) => {
            if (videoRef.current) {
              videoRef.current.onloadedmetadata = () => resolve(videoRef.current);
            }
          });
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
        setError("Izin kamera ditolak atau tidak ditemukan. Mohon izinkan akses kamera di browser Anda.");
        setStatus("Gagal mengakses kamera");
      }
    };

    const detectFrame = async () => {
      if (!videoRef.current || !canvasRef.current || !model) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const predictions = await model.detect(video);
        const personPredictions = predictions.filter(p => p.class === 'person');
        
        setPersonCount(personPredictions.length);

        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        ctx.font = '16px Arial';
        
        personPredictions.forEach(prediction => {
          const [x, y, width, height] = prediction.bbox;
          ctx.strokeStyle = '#00FF00';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, width, height);
          ctx.fillStyle = '#00FF00';
          ctx.fillText(
            `${prediction.class} (${Math.round(prediction.score * 100)}%)`,
            x,
            y > 10 ? y - 5 : 10
          );
        });
      }
      animationFrameId = requestAnimationFrame(detectFrame);
    };

    const loadModelAndStart = async () => {
      await setupCamera();
      try {
        model = await cocoSsd.load();
        setStatus('Model dimuat. Mendeteksi...');
        detectFrame();
      } catch (e) {
        console.error("Error loading model: ", e);
        setError("Gagal memuat model deteksi objek.");
        setStatus("Error");
      }
    };

    loadModelAndStart();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const isPresent = personCount > 0;
  const presenceText = isPresent ? `ADA ORANG (${personCount})` : 'TIDAK ADA ORANG';
  const indicatorColor = isPresent ? 'bg-green-500' : 'bg-red-500';

  if (error) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="relative aspect-video w-full">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute top-0 left-0 w-full h-full object-cover rounded-md"
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full object-cover rounded-md"
      />
      {status.startsWith('Memuat') && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md">
          <div className="text-center">
            <Skeleton className="w-full h-full" />
            <p className="text-white mt-2">{status}</p>
          </div>
        </div>
      )}
      <div className="absolute top-2 left-2 bg-black/50 p-2 rounded-md text-white flex items-center space-x-2">
        <div className={`h-3 w-3 rounded-full animate-pulse ${indicatorColor}`}></div>
        <span>{presenceText}</span>
      </div>
    </div>
  );
};

export default CameraStream;