'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import ImageUploader from '@/components/ImageUploader';
import MenuItemCard from '@/components/MenuItemCard';
import ChatInterface from '@/components/ChatInterface';
import LanguageSelector from '@/components/LanguageSelector';
import { translate } from '@/lib/languageUtils';
import { useMenuStore } from '@/store/menuStore';
import SelectedItems from '@/components/SelectedItems';
import MenuFilters from '@/components/MenuFilters';

interface MenuItem {
  name: string;
  description: string;
  category?: string;
  languages?: string[];
  dietaryInfo?: string[];
  translations?: {
    [key: string]: {
      name: string;
      description: string;
    };
  };
  timing?: 'pre-landing' | 'regular';
  selected?: boolean;
}

export default function Home() {
  const menuItems = useMenuStore(state => state.menuItems);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);

  const regularItems = menuItems.filter(item => item.timing !== 'pre-landing');
  const preLandingItems = menuItems.filter(item => item.timing === 'pre-landing');

  const categories = useMemo(() => {
    const categorySet = new Set(menuItems.map(item => item.category));
    return Array.from(categorySet).filter(Boolean) as string[];
  }, [menuItems]);

  const dietaryOptions = useMemo(() => {
    const optionsSet = new Set(menuItems.flatMap(item => item.dietaryInfo || []));
    return Array.from(optionsSet);
  }, [menuItems]);

  const filterItems = (items: MenuItem[]) => {
    return items.filter(item => {
      const matchesSearch = !searchQuery || 
        item.translations?.[currentLanguage]?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = !selectedCategory || item.category === selectedCategory;

      const matchesDietary = selectedDietary.length === 0 || 
        selectedDietary.every(diet => item.dietaryInfo?.includes(diet));

      return matchesSearch && matchesCategory && matchesDietary;
    });
  };

  const filteredRegularItems = filterItems(regularItems);
  const filteredPreLandingItems = filterItems(preLandingItems);

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
    <main className="min-h-screen bg-white p-8 pb-32"> {/* increased bottom padding */}
      <div className="flex justify-between items-center mb-8">
        <Image
          src="/thy-logo.png"
          alt="Turkish Airlines Logo"
          width={200}  
          height={40} 
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

      <div className="text-black mb-24"> {/* added margin bottom */}
        <div className="container mx-auto">
          <div className="grid md:grid-cols-[300px_1fr] gap-6">
            <div>
              <ImageUploader 
                language={currentLanguage}
              />
              {menuItems.length > 0 && (
                <div className="mt-6">
                  <MenuFilters
                    language={currentLanguage}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    selectedDietary={selectedDietary}
                    setSelectedDietary={setSelectedDietary}
                    categories={categories}
                    dietaryOptions={dietaryOptions}
                  />
                </div>
              )}
            </div>
            
            <div>
              {menuItems.length > 0 ? (
                <>
                  <MenuSection title="Regular Menu Items" items={filteredRegularItems} />
                  <MenuSection title="Pre-landing Menu Items" items={filteredPreLandingItems} />
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <SelectedItems language={currentLanguage} />
      <ChatInterface language={currentLanguage} />
    </main>
  );
}
