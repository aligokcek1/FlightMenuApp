import { MenuItem } from '@/store/menuStore';
import { detectLanguage } from './languageUtils';
import menuData from '@/data/menu.json';

// Update the RawMenuItem interface to match MenuItemType
interface RawMenuItem {
  name: string;
  confidence?: number;
  boundingBox?: { x: number; y: number; width: number; height: number };
}

interface MenuItemData {
  en: { name: string; description?: string };
  tr: { name: string; description?: string };
  dietaryInfo?: string[];
}

export class MenuParser {
  private static PRE_LANDING_INDICATORS = {
    tr: ['inişten önce', 'iniş öncesi', 'inmeden önce'],
    en: ['before landing', 'pre-landing', 'prior to landing']
  };

  private static readonly MENU_DATA = menuData;

  static parseMenuItems(rawItems: RawMenuItem[]): MenuItem[] {
    let isPreLandingSection = false;
    const seenItems = new Set<string>();
    
    return rawItems
      .filter(item => item && item.name && item.name.length > 1)
      .map(item => {
        const itemTextLower = item.name.toLowerCase();
        
        if (this.isPreLandingHeader(itemTextLower)) {
          isPreLandingSection = true;
          seenItems.clear(); // Reset seen items for new section
          return undefined;
        }
        
        const normalizedItem = this.normalizeMenuItem(item);
        if (!normalizedItem) return undefined;

        // Create unique key combining name and timing
        const itemKey = `${normalizedItem.name}_${isPreLandingSection ? 'pre-landing' : 'regular'}`;
        
        // Skip if we've seen this item in current section
        if (seenItems.has(itemKey)) return undefined;
        seenItems.add(itemKey);
        
        return {
          ...normalizedItem,
          timing: isPreLandingSection ? 'pre-landing' : 'regular'
        } as MenuItem;
      })
      .filter((item): item is MenuItem => item !== undefined);
  }

  private static isPreLandingHeader(text: string): boolean {
    return Object.values(this.PRE_LANDING_INDICATORS)
      .flat()
      .some(indicator => text.includes(indicator));
  }

  private static findMatchingMenuItem(name: string): { 
    category: string;
    item: {
      en: { name: string; description?: string; },
      tr: { name: string; description?: string; },
      dietaryInfo?: string[];
    }
  } | undefined {
    const normalizedName = this.normalizeText(name);

    for (const [category, items] of Object.entries(this.MENU_DATA)) {
      const match = (items as MenuItemData[]).find((item: MenuItemData) => 
        this.isSimilarText(normalizedName, this.normalizeText(item.en.name)) ||
        this.isSimilarText(normalizedName, this.normalizeText(item.tr.name))
      );

      if (match) {
        return { category, item: match };
      }
    }
    return undefined;
  }

  private static normalizeText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\wçÇğĞıİöÖşŞüÜ\s]/g, '')
      .replace(/\s+/g, '')
      .replace(/ü/g, 'u')
      .replace(/ö/g, 'o')
      .replace(/ı/g, 'i')
      .replace(/ş/g, 's')
      .replace(/ğ/g, 'g')
      .replace(/ç/g, 'c');
  }

  private static isSimilarText(text1: string, text2: string): boolean {
    return text1.includes(text2) || text2.includes(text1);
  }

  private static normalizeMenuItem(item: RawMenuItem): MenuItem | undefined {
    const matchingItem = this.findMatchingMenuItem(item.name);
    if (!matchingItem) return undefined;

    const { category, item: menuItem } = matchingItem;
    const originalLang = detectLanguage(item.name) === 'tur' ? 'tr' : 'en';
    
    return {
      name: menuItem[originalLang].name,
      description: menuItem[originalLang].description || '',
      category,
      translations: {
        en: {
          name: menuItem.en.name,
          description: menuItem.en.description || ''
        },
        tr: {
          name: menuItem.tr.name,
          description: menuItem.tr.description || ''
        }
      },
      languages: ['en', 'tr'],
      dietaryInfo: menuItem.dietaryInfo || [] // Use dietary info from JSON
    };
  }
}
