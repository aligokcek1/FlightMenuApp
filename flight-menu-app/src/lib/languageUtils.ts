import { franc } from 'franc-min';

const translations: { [key: string]: { [key: string]: string } } = {
  'en': {
    'Upload a menu image to get started': 'Upload a menu image to get started',
    'Menu Items': 'Menu Items',
    'Dietary Info': 'Dietary Info',
    'Flight Menu': 'Flight Menu',
    'Chat Assistant': 'Chat Assistant',
    'Processing image...': 'Processing image...',
    "Drag 'n' drop a menu image, or click to select": "Drag 'n' drop a menu image, or click to select",
    'Only *.jpeg, *.png images will be accepted': 'Only *.jpeg, *.png images will be accepted',
    'Turkish Airlines': 'Turkish Airlines'
  },
  'tr': {
    'Upload a menu image to get started': 'Başlamak için menü resmi yükleyin',
    'Menu Items': 'Menü Öğeleri',
    'Dietary Info': 'Diyet Bilgisi',
    'Flight Menu': 'Uçuş Menüsü',
    'Chat Assistant': 'Sohbet Asistanı',
    'Processing image...': 'Görüntü işleniyor...',
    "Drag 'n' drop a menu image, or click to select": "Menü resmini sürükleyip bırakın veya tıklayarak seçin",
    'Only *.jpeg, *.png images will be accepted': 'Sadece *.jpeg, *.png resimler kabul edilir',
    'Turkish Airlines': 'Türk Hava Yolları'
  }
};

export function translate(text: string, targetLang: string = 'en'): string {
  return translations[targetLang]?.[text] || text;
}

export function detectLanguage(text: string): string {
  return franc(text, { minLength: 3 });
}

export function translateText(text: string, targetLanguage: string): Promise<string> {
  return Promise.resolve(translate(text, targetLanguage));
}