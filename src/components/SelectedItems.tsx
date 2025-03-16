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

  const regularItems = selectedItems.filter(item => !item.timing || item.timing === 'regular');
  const preLandingItems = selectedItems.filter(item => item.timing === 'pre-landing');

  return (
    <div className="fixed bottom-0 right-0 left-0 bg-white border-t shadow-lg py-2 px-4"> {/* reduced padding */}
      <div className="container mx-auto px-4">
        <h3 className="text-sm font-semibold mb-2 text-right"> {/* reduced text size and margin */}
          {translate('Selected Items', language)} ({selectedItems.length})
        </h3>
        <div className="flex flex-col items-end gap-2"> {/* reduced gap */}
          {regularItems.length > 0 && (
            <div className="w-full">
              <h4 className="text-right text-xs font-medium text-gray-600 mb-1"> {/* reduced text size and margin */}
                {translate('Regular Menu', language)}
              </h4>
              <div className="flex flex-wrap justify-end gap-1"> {/* reduced gap */}
                {regularItems.map(item => (
                  <div 
                    key={item.name}
                    className="bg-red-50 text-red-700 px-2 py-0.5 rounded-full text-xs" 
                  >
                    {item.translations?.[language]?.name || item.name}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {preLandingItems.length > 0 && (
            <div className="w-full">
              <h4 className="text-right text-xs font-medium text-gray-600 mb-1"> {/* reduced text size and margin */}
                {translate('Pre-landing Menu', language)}
              </h4>
              <div className="flex flex-wrap justify-end gap-1"> {/* reduced gap */}
                {preLandingItems.map(item => (
                  <div 
                    key={item.name}
                    className="bg-red-50 text-red-700 px-2 py-0.5 rounded-full text-xs" 
                  >
                    {item.translations?.[language]?.name || item.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectedItems;
