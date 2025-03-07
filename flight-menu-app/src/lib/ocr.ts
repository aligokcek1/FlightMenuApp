import Tesseract from 'tesseract.js';

// Detailed menu item interface
interface MenuItemType {
  name: string;
  description: string;
  category?: string;
  languages?: string[];
  dietaryInfo?: string[];
}

// OCR Configuration and Utility Functions
export class MenuOCRProcessor {
  // Dietary restriction keywords in multiple languages
  private static DIETARY_KEYWORDS = {
    gluten: {
      en: ['gluten-free', 'gluten free'],
      tr: ['glutensiz', 'gluten İçermeyen'],
      de: ['glutenfrei']
    },
    vegetarian: {
      en: ['vegetarian', 'veg'],
      tr: ['vejetaryen'],
      de: ['vegetarisch']
    },
    vegan: {
      en: ['vegan'],
      tr: ['vegan', 'vejeteryan'],
      de: ['vegan']
    },
    halal: {
      en: ['halal'],
      tr: ['helal'],
      ar: ['حلال']
    }
  };

  // Advanced OCR configuration with Turkish support
  private static OCR_CONFIG = {
    lang: 'tur+eng', // Prioritize Turkish language
    tesseditPageSegMode: Tesseract.PSM.AUTO,
    tesseditOcrEngineMode: Tesseract.OEM.LSTM_ONLY,
    dpi: 300,
    options: {
      preserve_interword_spaces: '1',
      language_model_penalty_non_dict_word: '0.5',
      language_model_penalty_case: '0.1',
      textord_min_linesize: '2.5',
      // Explicitly include Turkish characters in whitelist
      characterWhitelist: 'ABCÇDEFGĞHIİJKLMNOÖPQRSŞTUÜVWXYZabcçdefgğhıijklmnoöpqrsştuüvwxyz0123456789 .-',
    }
  };

  /**
   * Extract text from menu image with advanced processing
   * @param imageFile - File object of the menu image
   * @returns Promise of extracted menu items
   */
  static async extractMenuText(imageFile: File): Promise<MenuItemType[]> {
    try {
      // Preprocess image (optional - could use canvas for further optimization)
      const preprocessedImage = await this.preprocessImage(imageFile);

      // Perform OCR
      const { data: { text } } = await Tesseract.recognize(
        preprocessedImage, 
        this.OCR_CONFIG.lang,
        {
          logger: (m) => console.log('OCR Progress:', m),
          ...this.OCR_CONFIG
        }
      );

      // Parse extracted text
      return this.parseMenuText(text);
    } catch (error) {
      console.error('OCR Extraction Error:', error);
      throw new Error('Failed to extract menu information');
    }
  }

  /**
   * Preprocess image for better OCR accuracy
   * @param imageFile - Original image file
   * @returns Preprocessed image
   */
  private static async preprocessImage(imageFile: File): Promise<File> {
    // Basic preprocessing steps
    // In a real-world scenario, you might:
    // 1. Adjust contrast
    // 2. Remove noise
    // 3. Enhance text regions
    return imageFile;
  }

  /**
   * Parse extracted text into structured menu items
   * @param rawText - Raw OCR extracted text
   * @returns Parsed menu items
   */
  private static parseMenuText(rawText: string): MenuItemType[] {
    const lines = rawText.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 3);

    const menuItems: MenuItemType[] = [];
    let currentCategory = '';
    let currentItem: Partial<MenuItemType> | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines
      if (!line) continue;

      // Check if this is a category header
      if (this.isCategoryLine(line)) {
        currentCategory = line;
        continue;
      }

      // Check if this is potentially a menu item name
      if (this.isLikelyItemName(line)) {
        // Save previous item if exists
        if (currentItem) {
          menuItems.push(currentItem as MenuItemType);
        }

        // Start new item
        currentItem = {
          name: line,
          description: '',
          category: currentCategory || 'Main Course',
          dietaryInfo: this.detectDietaryRestrictions(line)
        };
      } 
      // If we have a current item and this line isn't a new item, it's probably part of the description
      else if (currentItem && line.length > 2) {
        currentItem.description = currentItem.description
          ? `${currentItem.description} ${line}`
          : line;
      }
    }

    // Don't forget to add the last item
    if (currentItem) {
      menuItems.push(currentItem as MenuItemType);
    }

    return menuItems;
  }

  private static isLikelyItemName(line: string): boolean {
    // Enhanced patterns for menu item detection
    const itemPatterns = [
      /^[A-Z][\w\s]{2,}/,          // Starts with capital letter
      /^[\w\s]+(with|served|and)/i, // Common food descriptors
      /^[\w\s]+(chicken|fish|beef|pork|salad|soup)/i,  // Common food items
      /^[\w\s]+\(.+\)/,            // Has parenthetical information
      /^[\w\s]+(topped|garnished|accompanied)/i, // Cooking terms
      /^[A-Z].*\d+/,               // Items with numbers (like prices)
      /^["'][\w\s]+["']/,          // Quoted names
    ];

    return itemPatterns.some(pattern => pattern.test(line));
  }

  private static isCategoryLine(line: string): boolean {
    const categoryPatterns = [
      /^(appetizers?|starters?|mains?|desserts?|beverages?|sides?)/i,
      /^(hot|cold|breakfast|lunch|dinner)/i,
      /^menu$/i,
      /^[\w\s]{3,20}:$/,  // Words ending with colon
      /^-{3,}$/,          // Divider lines
      /section|course|selection|category|type/i
    ];

    return categoryPatterns.some(pattern => pattern.test(line));
  }

  /**
   * Normalize and clean extracted text
   * @param text - Raw extracted text
   * @returns Cleaned text
   */
  private static normalizeText(text: string): string {
    // Turkish-aware text normalization
    return text
      .replace(/[^\wçÇğĞıİöÖşŞüÜ\s.,()]/g, '') // Keep Turkish characters
      .replace(/\s+/g, ' ')
      .toLowerCase()
      // Handle common OCR mistakes with Turkish characters
      .replace(/i̇/g, 'i') // Fix dotted i issue
      .replace(/g\u0306/g, 'ğ') // Fix ğ recognition
      .replace(/s\u0327/g, 'ş') // Fix ş recognition
      .replace(/u\u0308/g, 'ü') // Fix ü recognition
      .replace(/o\u0308/g, 'ö') // Fix ö recognition
      .replace(/c\u0327/g, 'ç'); // Fix ç recognition
  }

  /**
   * Detect if a line is likely a menu item
   * @param line - Text line to evaluate
   * @returns Boolean indicating if line is a menu item
   */
  private static isMenuItemLine(line: string): boolean {
    const menuItemPatterns = [
      /^[a-zA-Z\s]+with/i,
      /^[a-zA-Z\s]+(chicken|fish|salad|beef)/i,
      /[a-zA-Z\s]+\s*\(.*\)/
    ];

    return menuItemPatterns.some(pattern => pattern.test(line));
  }

  /**
   * Extract item name from a line
   * @param line - Text line containing item name
   * @returns Extracted item name
   */
  private static extractItemName(line: string): string {
    // Remove parenthetical information
    return line.replace(/\(.*\)/, '').trim();
  }

  /**
   * Extract item description from subsequent lines
   * @param lines - Lines following the item name
   * @returns Extracted description
   */
  private static extractItemDescription(lines: string[]): string {
    const descriptionLines = lines
      .filter(line => line.length > 5 && !/^\d+/.test(line))
      .slice(0, 2);
    return descriptionLines.join(' ').trim();
  }

  /**
   * Detect dietary restrictions in menu item
   * @param text - Text to check for dietary information
   * @returns Array of detected dietary restrictions
   */
  private static detectDietaryRestrictions(text: string): string[] {
    const detectedRestrictions: string[] = [];

    Object.entries(this.DIETARY_KEYWORDS).forEach(([restriction, languageMap]) => {
      Object.values(languageMap).some(keywords => 
        keywords.some(keyword => 
          text.toLowerCase().includes(keyword.toLowerCase())
        ) && detectedRestrictions.push(restriction)
      );
    });

    return detectedRestrictions;
  }

}

// Example usage in an API route
export async function processMenuImage(imageFile: File) {
  try {
    const menuItems = await MenuOCRProcessor.extractMenuText(imageFile);
    return {
      success: true,
      menuItems,
      totalItems: menuItems.length
    };
  } catch (error) {
    console.error('Menu Image Processing Error:', error);
    return {
      success: false,
      error: 'Failed to process menu image'
    };
  }
}