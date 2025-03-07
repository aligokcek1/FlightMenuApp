'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { MenuOCRProcessor } from '@/lib/ocr';
import { ImagePreprocessor } from '@/lib/imagePreprocess';
import { translate } from '@/lib/languageUtils';
import { useMenuStore } from '@/store/menuStore';
import { MenuParser } from '@/lib/menuParser';

interface ImageUploaderProps {
  language: string;
}

export default function ImageUploader({ language }: { language: string }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const setMenuItems = useMenuStore(state => state.setMenuItems);

  const processImage = async (file: File) => {
    setIsProcessing(true);
    try {
      const preprocessedImage = await ImagePreprocessor.enhanceContrast(file);
      const rawMenuItems = await MenuOCRProcessor.extractMenuText(preprocessedImage);
      
      // Parse and store menu items
      const parsedMenuItems = MenuParser.parseMenuItems(rawMenuItems);
      setMenuItems(parsedMenuItems);
    } catch (error) {
      console.error('Image processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']  // Only accept images
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setPreview(URL.createObjectURL(file));
        processImage(file);
      }
    }
  });

  return (
    <div className="space-y-4">
      <p className="text-gray-600 text-center font-medium">
        {translate('Upload a menu image to get started', language)}
      </p>
      <div 
        {...getRootProps()} 
        className={`
          p-6 border-2 border-dashed rounded-lg text-center cursor-pointer
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}
          hover:border-blue-500 transition-colors
        `}
      >
        <input {...getInputProps()} />
        {isProcessing ? (
          <div className="text-gray-600">{translate('Processing image...', language)}</div>
        ) : preview ? (
          <img 
            src={preview} 
            alt="Preview" 
            className="mx-auto max-h-64 rounded-lg" 
          />
        ) : (
          <>
            <p className="text-gray-600">
              {translate("Drag 'n' drop a menu image, or click to select", language)}
            </p>
            <em className="text-xs text-gray-500">
              {translate('Only *.jpeg, *.png images will be accepted', language)}
            </em>
          </>
        )}
      </div>
    </div>
  );
}