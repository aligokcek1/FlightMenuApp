import React from 'react';
import { translate } from '@/lib/languageUtils';

interface MenuFiltersProps {
  language: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedDietary: string[];
  setSelectedDietary: (dietary: string[]) => void;
  categories: string[];
  dietaryOptions: string[];
}

const MenuFilters: React.FC<MenuFiltersProps> = ({
  language,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedDietary,
  setSelectedDietary,
  categories,
  dietaryOptions
}) => {
  return (
    <div className="mb-6 space-y-4">
      {/* Search Input */}
      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={translate('Search menu items...', language)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-sm font-medium mb-2">
          {translate('Category', language)}
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="">{translate('All Categories', language)}</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {translate(category, language)}
            </option>
          ))}
        </select>
      </div>

      {/* Dietary Filters */}
      <div>
        <label className="block text-sm font-medium mb-2">
          {translate('Dietary Preferences', language)}
        </label>
        <div className="flex flex-wrap gap-2">
          {dietaryOptions.map(option => (
            <button
              key={option}
              onClick={() => {
                setSelectedDietary(
                  selectedDietary.includes(option)
                    ? selectedDietary.filter(d => d !== option)
                    : [...selectedDietary, option]
                )
              }}
              className={`text-xs px-3 py-1 rounded-full transition-colors ${
                selectedDietary.includes(option)
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {translate(option, language)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuFilters;
