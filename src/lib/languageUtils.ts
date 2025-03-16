import { franc } from 'franc-min';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  'en': {
    'Upload a menu image to get started': 'Upload a menu image to get started',
    'Menu Items': 'Menu Items',
    'Dietary Info': 'Dietary Info',
    'Flight Menu': 'Flight Menu',
    'Chat Assistant': 'Chat Assistant',
    'Processing image...': 'Processing image...',
    "Drag 'n' drop a menu image, or click to select": "Drag 'n' drop a menu image, or click to select",
    'Only *.jpeg, *.png images will be accepted': 'Only *.jpeg, *.png images will be accepted',
    'Turkish Airlines': 'Turkish Airlines',
    'Take Photo': 'Take Photo',
    'Capture': 'Capture',
    'Cancel': 'Cancel',
    'or': 'or',
    'Upload or capture a menu image': 'Upload or capture a menu image',
    'Regular Menu Items': 'Regular Menu Items',
    'Pre-landing Menu Items': 'Pre-landing Menu Items',
    'No valid menu items detected. Please upload a clear menu image.': 'No valid menu items detected. Please upload a clear menu image.',
    'Failed to process the menu image. Please try again.': 'Failed to process the menu image. Please try again.',
    'Menu Chat': 'Menu Chat',
    'Assistant:': 'Assistant:',
    'You:': 'You:',
    'Assistant is typing...': 'Assistant is typing...',
    'Ask about menu items...': 'Ask about menu items...',
    'Send': 'Send',
    'Sorry, I encountered an error. Please try again.': 'Sorry, I encountered an error. Please try again.',
    'Collapse Chat': 'Collapse Chat',
    'Expand Chat': 'Expand Chat',
    'Selected Items': 'Selected Items',
    'You can only select one main course at a time.': 'You can only select one main course at a time.',
    'Search menu items...': 'Search menu items...',
    'Category': 'Category',
    'All Categories': 'All Categories',
    'Dietary Preferences': 'Dietary Preferences',
    'vegetarian': 'Vegetarian',
    'dairy': 'Dairy',
    'seafood': 'Seafood',
    'meat': 'Meat',
    'Starters & Salads': 'Starters & Salads',
    'Soups': 'Soups',
    'Main Courses': 'Main Courses',
    'Desserts': 'Desserts',
    'Breakfast': 'Breakfast',
    'Sides & Extras': 'Sides & Extras',
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
    'Turkish Airlines': 'Türk Hava Yolları',
    'Take Photo': 'Fotoğraf Çek',
    'Capture': 'Çek',
    'Cancel': 'İptal',
    'or': 'veya',
    'Upload or capture a menu image': 'Menü resmini yükle veya çek',
    'Regular Menu Items': 'Ana Menü',
    'Pre-landing Menu Items': 'İniş Öncesi Menü',
    'No valid menu items detected. Please upload a clear menu image.': 'Geçerli menü öğesi bulunamadı. Lütfen net bir menü resmi yükleyin.',
    'Failed to process the menu image. Please try again.': 'Menü resmi işlenemedi. Lütfen tekrar deneyin.',
    'Menu Chat': 'Menü Sohbeti',
    'Assistant:': 'Asistan:',
    'You:': 'Siz:',
    'Assistant is typing...': 'Asistan yazıyor...',
    'Ask about menu items...': 'Menü öğeleri hakkında sorun...',
    'Send': 'Gönder',
    'Sorry, I encountered an error. Lütfen tekrar deneyin.': 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
    'Collapse Chat': 'Sohbeti Kapat',
    'Expand Chat': 'Sohbeti Aç',
    'Selected Items': 'Seçilen Ürünler',
    'You can only select one main course at a time.': 'Aynı anda yalnızca bir ana yemek seçebilirsiniz.',
    'Search menu items...': 'Menü öğelerinde ara...',
    'Category': 'Kategori',
    'All Categories': 'Tüm Kategoriler',
    'Dietary Preferences': 'Diyet Tercihleri',
    'vegetarian': 'Vejetaryen',
    'dairy': 'Süt Ürünü',
    'seafood': 'Deniz Ürünü',
    'meat': 'Et',
    'Starters & Salads': 'Başlangıçlar & Salatalar',
    'Soups': 'Çorbalar',
    'Main Courses': 'Ana Yemekler',
    'Desserts': 'Tatlılar',
    'Breakfast': 'Kahvaltı',
    'Sides & Extras': 'Yan Lezzetler & Ekstralar',
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