'use client';

import { useState } from 'react';
import Image from 'next/image';
import ImageUploader from '@/components/ImageUploader';
import MenuItemCard from '@/components/MenuItemCard';
import ChatInterface from '@/components/ChatInterface';
import LanguageSelector from '@/components/LanguageSelector';
import { translate } from '@/lib/languageUtils';
import { useMenuStore } from '@/store/menuStore';
import SelectedItems from '@/components/SelectedItems';

interface MenuItem {
  timing?: 'pre-landing' | 'regular';
  name: string;
  description: string;
}

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

  const regularItems = menuItems.filter(item => item.timing !== 'pre-landing');
  const preLandingItems = menuItems.filter(item => item.timing === 'pre-landing');

  const MenuSection = ({ title, items }: { title: string, items: MenuItem[] }) => (
    items.length > 0 ? (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {translate(title, currentLanguage)} ({items.length})
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((item, index) => (
            <MenuItemCard
              key={index}
              item={item}
              language={currentLanguage}
            />
          ))}
        </div>
      </div>
    ) : null
  );

  return (
    <main className="min-h-screen bg-white p-8 pb-24">
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
              <ChatInterface />
            </div>
            
            <div>
              {menuItems.length > 0 ? (
                <>
                  <MenuSection title="Regular Menu Items" items={regularItems} />
                  <MenuSection title="Pre-landing Menu Items" items={preLandingItems} />
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <SelectedItems language={currentLanguage} />
    </main>
  );
}
