import { MenuItem } from '@/store/menuStore';
import { detectLanguage } from './languageUtils';
import menuData from '@/data/menu.json';

export class MenuParser {
  private static PRE_LANDING_INDICATORS = {
    tr: ['inişten önce', 'iniş öncesi', 'inmeden önce'],
    en: ['before landing', 'pre-landing', 'prior to landing']
  };

  private static readonly MENU_DATA = menuData;

  static parseMenuItems(rawItems: any[]): MenuItem[] {
    let isPreLandingSection = false;
    
    return rawItems
      .filter(item => item && item.name && item.name.length > 1)
      .map(item => {
        const itemTextLower = item.name.toLowerCase();
        
        if (this.isPreLandingHeader(itemTextLower)) {
          isPreLandingSection = true;
          return undefined;
        }
        
        const normalizedItem = this.normalizeMenuItem(item);
        if (!normalizedItem) return undefined;
        
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
      tr: { name: string; description?: string; }
    }
  } | undefined {
    const normalizedName = this.normalizeText(name);

    for (const [category, items] of Object.entries(this.MENU_DATA)) {
      interface MenuItemData {
        en: { name: string; description?: string; };
        tr: { name: string; description?: string; };
      }

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

  private static normalizeMenuItem(item: any): MenuItem | undefined {
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
      dietaryInfo: this.detectDietaryInfo(
        `${menuItem.en.name} ${menuItem.tr.name}`,
        `${menuItem.en.description || ''} ${menuItem.tr.description || ''}`
      )
    };
  }

  private static detectDietaryInfo(name: string, description: string): string[] {
    const text = `${name} ${description}`.toLowerCase();
    const dietaryInfo: string[] = [];

    if (/(vegetable|sebze|salad|salata)/.test(text)) dietaryInfo.push('vegetarian');
    if (/(fish|balık|basa|cod|morina)/.test(text)) dietaryInfo.push('seafood');
    if (/(chicken|tavuk|turkey|hindi)/.test(text)) dietaryInfo.push('poultry');
    if (/(cheese|peynir|butter|tereyağı)/.test(text)) dietaryInfo.push('dairy');
    if (/(beef|dana|meat|et)/.test(text)) dietaryInfo.push('meat');
    
    return dietaryInfo;
  }
}
