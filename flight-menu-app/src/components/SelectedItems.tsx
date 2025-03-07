import React from 'react';
import { useMenuStore } from '@/store/menuStore';
import { translate } from '@/lib/languageUtils';

interface SelectedItemsProps {
  language: string;
}

const SelectedItems: React.FC<SelectedItemsProps> = ({ language }) => {
  const menuItems = useMenuStore(state => state.menuItems);
  const selectedItems = menuItems.filter(item => item.selected);

  if (selectedItems.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
      <div className="container mx-auto">
        <h3 className="text-lg font-semibold mb-2">
          {translate('Selected Items', language)} ({selectedItems.length})
        </h3>
        <div className="flex flex-wrap gap-2">
          {selectedItems.map(item => (
            <div 
              key={item.name}
              className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm"
            >
              {item.translations?.[language]?.name || item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectedItems;
