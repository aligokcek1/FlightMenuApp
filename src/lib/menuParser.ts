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
  en: { name: string; description?: string | null };
  tr: { name: string; description?: string | null };
  dietaryInfo?: string[];
}

interface MenuDataType {
  [category: string]: MenuItemData[];
}

interface BestMatch {
  category: string;
  item: MenuItemData;
  similarity: number;
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

  private static findMatchingMenuItem(name: string): { category: string; item: MenuItemData } | undefined {
    const normalizedInput = this.normalizeText(name);
    let bestMatch: BestMatch | undefined;

    for (const [category, items] of Object.entries(this.MENU_DATA as MenuDataType)) {
      for (const item of items) {
        const enMatch = this.isSimilarText(normalizedInput, item.en.name);
        const trMatch = this.isSimilarText(normalizedInput, item.tr.name);

        if (enMatch || trMatch) {
          const similarity = Math.max(
            this.calculateSimilarity(normalizedInput, this.normalizeText(item.en.name)),
            this.calculateSimilarity(normalizedInput, this.normalizeText(item.tr.name))
          );

          if (!bestMatch || similarity > bestMatch.similarity) {
            bestMatch = { category, item, similarity };
          }
        }
      }
    }

    return bestMatch ? { category: bestMatch.category, item: bestMatch.item } : undefined;
  }

  private static normalizeText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\wçÇğĞıİöÖşŞüÜ\s]/g, '') // Keep Turkish characters
      .replace(/\s+/g, ' ')
      .trim();
  }

  private static isSimilarText(text1: string, text2: string): boolean {
    const normalized1 = this.normalizeText(text1);
    const normalized2 = this.normalizeText(text2);

    // Direct match after normalization
    if (normalized1 === normalized2) return true;

    // Check if one contains the other
    if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) return true;

    // Split into words and check for significant word matches
    const words1 = normalized1.split(' ').filter(w => w.length > 2);
    const words2 = normalized2.split(' ').filter(w => w.length > 2);

    // Calculate percentage of matching words
    const matchingWords = words1.filter(w => words2.some(w2 => 
      w2.includes(w) || w.includes(w2) || this.levenshteinDistance(w, w2) <= 2
    ));

    // Consider it a match if more than 60% of words match
    return matchingWords.length >= Math.min(words1.length, words2.length) * 0.6;
  }

  private static calculateSimilarity(str1: string, str2: string): number {
    const distance = this.levenshteinDistance(str1, str2);
    const maxLength = Math.max(str1.length, str2.length);
    return 1 - distance / maxLength;
  }

  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str1.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str2.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str1.length; i++) {
      for (let j = 1; j <= str2.length; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str1.length][str2.length];
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
