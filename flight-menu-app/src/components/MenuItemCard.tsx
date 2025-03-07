import React from 'react';

interface MenuItemCardProps {
  item: {
    name: string;
    description: string;
    dietaryInfo?: string[];
  };
  language: string;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  return (
    <div className="p-4 border rounded-lg shadow-md bg-white/90 mb-4 hover:shadow-lg transition-shadow backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
      {item.description && (
        <p className="text-gray-600 mt-2">{item.description}</p>
      )}
      {item.dietaryInfo && item.dietaryInfo.length > 0 && (
        <div className="mt-2 text-sm text-gray-500">
          {item.dietaryInfo.join(', ')}
        </div>
      )}
    </div>
  );
};

export default MenuItemCard;