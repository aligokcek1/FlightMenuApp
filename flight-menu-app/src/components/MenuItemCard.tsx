import React from 'react';
import { MenuItem } from '@/store/menuStore';

interface MenuItemCardProps {
  item: MenuItem;
  language: string;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, language }) => {
  const getTranslatedContent = () => {
    if (item.translations?.[language]) {
      return item.translations[language];
    }
    return {
      name: item.name,
      description: item.description
    };
  };

  const translatedContent = getTranslatedContent();

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white/90 mb-2 hover:shadow-lg transition-shadow">
      <h3 className="text-base font-semibold text-gray-800">
        {translatedContent.name}
      </h3>
      {translatedContent.description && (
        <p className="text-gray-600 mt-2 text-sm italic">
          ({translatedContent.description})
        </p>
      )}
      {item.category && (
        <span className="mt-2 inline-block text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
          {item.category}
        </span>
      )}
      <div className="mt-2 flex flex-wrap gap-1.5">
        {item.dietaryInfo?.map((info) => (
          <span key={info} className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded">
            {info}
          </span>
        ))}
      </div>
    </div>
  );
}

export default MenuItemCard;