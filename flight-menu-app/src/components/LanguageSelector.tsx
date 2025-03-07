import React from 'react';

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  currentLanguage, 
  onLanguageChange 
}) => {
  return (
    <select 
      value={currentLanguage}
      onChange={(e) => onLanguageChange(e.target.value)}
      className="p-2 border rounded-lg shadow-sm bg-white text-black"
    >
      <option value="en">English</option>
      <option value="tr">Türkçe</option>
    </select>
  );
};

export default LanguageSelector;
