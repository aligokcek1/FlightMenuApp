import React, { useRef, useState, useEffect } from 'react';
import { translate } from '@/lib/languageUtils';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  language: string;
  disabled?: boolean;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, language, disabled }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string>('');

  const startCamera = async () => {
    if (disabled) return;
    setError('');
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera not supported in this browser');
      }

      const constraints = {
        video: {
          facingMode: { ideal: 'environment' }, // Prefer rear camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true'); // Important for iOS
        
        // Wait for video to be ready
        await new Promise<void>((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => {
              videoRef.current!.play()
                .then(() => resolve())
                .catch(e => {
                  console.error('Video play error:', e);
                  setError('Failed to start video stream');
                });
            };
          }
        });
        
        setIsStreaming(true);
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('Could not access camera. Please ensure camera permissions are granted.');
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
          onCapture(file);
          stopCamera();
        }
      }, 'image/jpeg');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  return (
    <div className="relative">
      {error && (
        <div className="text-red-500 text-sm mb-2 text-center">
          {error}
        </div>
      )}
      {!isStreaming ? (
        <button
          onClick={startCamera}
          disabled={disabled}
          className={`
            w-full px-4 py-2 bg-blue-500 text-white rounded-lg 
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}
            transition-colors
          `}
        >
          {translate('Take Photo', language)}
        </button>
      ) : (
        <div className="relative bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-[300px] object-cover"
            style={{
              display: 'block',
              maxWidth: '100%',
              transform: 'scaleX(-1)' // Mirror the video feed
            }}
          />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 z-10">
            <button
              onClick={captureImage}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              {translate('Capture', language)}
            </button>
            <button
              onClick={stopCamera}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              {translate('Cancel', language)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
