import React from 'react';
import { MenuItem } from '@/store/menuStore';
import { useMenuStore } from '@/store/menuStore';

interface MenuItemCardProps {
  item: MenuItem;
  language: string;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, language }) => {
  const toggleSelection = useMenuStore(state => state.toggleSelection);
  const hasSelectedMainCourse = useMenuStore(state => state.hasSelectedMainCourse);

  const handleClick = () => {
    // If trying to select a new main course when one is already selected
    if (item.category === 'Main Courses' && !item.selected && hasSelectedMainCourse()) {
      alert('You can only select one main course at a time.');
      return;
    }
    toggleSelection(item.name);
  };

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
    <div 
      onClick={handleClick}
      className={`
        p-4 border rounded-lg shadow-md mb-2 cursor-pointer
        transition-all duration-200 ease-in-out
        ${item.selected 
          ? 'bg-red-50 border-red-200 shadow-red-100' 
          : 'bg-white/90 hover:shadow-lg'}
      `}
    >
      <div className="flex items-start justify-between">
        <h3 className="text-base font-semibold text-gray-800">
          {translatedContent.name}
        </h3>
        <div className={`
          w-4 h-4 rounded-full border-2 ml-2 flex-shrink-0
          transition-colors duration-200
          ${item.selected 
            ? 'border-red-500 bg-red-500' 
            : 'border-gray-300'}
        `}>
          {item.selected && (
            <svg 
              className="w-3 h-3 text-white m-auto" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          )}
        </div>
      </div>

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