'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { MenuOCRProcessor } from '@/lib/ocr';
import { ImagePreprocessor } from '@/lib/imagePreprocess';
import { translate } from '@/lib/languageUtils';
import { useMenuStore } from '@/store/menuStore';
import { MenuParser } from '@/lib/menuParser';
import CameraCapture from './CameraCapture';
import Image from 'next/image';

export default function ImageUploader({ language }: { language: string }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setMenuItems = useMenuStore(state => state.setMenuItems);
  const clearMenuItems = useMenuStore(state => state.clearMenuItems);

  const processImage = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    try {
      clearMenuItems();
      
      const preprocessedImage = await ImagePreprocessor.enhanceContrast(file);
      const rawMenuItems = await MenuOCRProcessor.extractMenuText(preprocessedImage);
      
      const parsedMenuItems = MenuParser.parseMenuItems(rawMenuItems);
      
      if (parsedMenuItems.length === 0) {
        setError(translate('No valid menu items detected. Please upload a clear menu image.', language));
        return;
      }
      
      setMenuItems(parsedMenuItems);
    } catch (error) {
      console.error('Image processing error:', error);
      setError(translate('Failed to process the menu image. Please try again.', language));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImage = async (file: File) => {
    setPreview(URL.createObjectURL(file));
    processImage(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (isProcessing) return; // Prevent new uploads while processing
      const file = acceptedFiles[0];
      if (file) handleImage(file);
    },
    disabled: isProcessing, // Disable dropzone while processing
  });

  return (
    <div className="space-y-4">
      <p className="text-gray-600 text-center font-medium">
        {translate('Upload or capture a menu image', language)}
      </p>
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}
      
      <div className="grid gap-4">
        <div 
          {...getRootProps()} 
          className={`
            p-6 border-2 border-dashed rounded-lg text-center 
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-500'}
            transition-colors relative
          `}
        >
          <input {...getInputProps()} disabled={isProcessing} />
          {isProcessing && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                <span className="text-gray-600">{translate('Processing image...', language)}</span>
              </div>
            </div>
          )}
          {preview ? (
            <Image 
              src={preview} 
              alt="Preview" 
              width={400}
              height={300}
              className="mx-auto max-h-64 rounded-lg object-contain" 
              unoptimized
            />
          ) : (
            <>
              <p className="text-gray-600">
                {translate("Drag 'n' drop a menu image, or click to select", language)}
              </p>
              <em className="text-xs text-gray-500">
                {translate('Only *.jpeg, *.jpg, *.png images will be accepted', language)}
              </em>
            </>
          )}
        </div>

        <div className="text-center">
          <span className="text-gray-500">
            {translate('or', language)}
          </span>
        </div>

        <CameraCapture 
          onCapture={handleImage}
          language={language}
          disabled={isProcessing}
        />
      </div>
    </div>
  );
}