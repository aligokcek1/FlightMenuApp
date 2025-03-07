'use client';

import { useState } from 'react';
import Image from 'next/image';
import ImageUploader from '@/components/ImageUploader';
import MenuItemCard from '@/components/MenuItemCard';
import ChatInterface from '@/components/ChatInterface';
import LanguageSelector from '@/components/LanguageSelector';
import { translate } from '@/lib/languageUtils';
import { useMenuStore } from '@/store/menuStore';

interface ImageUploaderProps {
  onImageUpload: (items: any[]) => void;
  language: string;
}

interface Props {
  onImageUpload: (items: any[]) => void;
  language: string;
}

export default function Home() {
  const menuItems = useMenuStore(state => state.menuItems);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="flex justify-between items-center mb-8">
        <Image
          src="/thy-logo.png"
          alt="Turkish Airlines Logo"
          width={200}  // Increased from 150
          height={40}  // Increased from 30
          priority
          className="h-auto"
        />
        <LanguageSelector 
          currentLanguage={currentLanguage}
          onLanguageChange={setCurrentLanguage}
        />
      </div>
      
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">
          <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
            {translate('Turkish Airlines', currentLanguage)}
          </span>
        </h1>
        <h2 className="text-3xl font-semibold text-black">
          {translate('Flight Menu', currentLanguage)}
        </h2>
      </div>

      <div className="text-black">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-[300px_1fr] gap-6">
            <div>
              <ImageUploader 
                language={currentLanguage}
              />
            </div>
            
            <div>
              {menuItems.length > 0 ? (
                <>
                  <h2 className="text-lg font-semibold mb-3">
                    {translate('Menu Items', currentLanguage)}
                  </h2>
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {menuItems.map((item, index) => (
                      <MenuItemCard
                        key={index}
                        item={item}
                        language={currentLanguage}
                      />
                    ))}
                  </div>
                  <ChatInterface 
                    menuItems={menuItems}
                    language={currentLanguage}
                  />
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
