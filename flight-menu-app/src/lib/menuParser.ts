import { MenuItem } from '@/store/menuStore';
import { detectLanguage } from './languageUtils';

export class MenuParser {
  // Known menu items and their translations
  private static KNOWN_DISHES = {
    salads: {
      en: ['vegetable salad', 'shrimp', 'marinated'],
      tr: ['sebze salatası', 'karidesli', 'salatalık']
    },
    meze: {
      en: ['moutabel', 'mutabbal'],
      tr: ['mütebbel', 'mütebel']
    },
    mains: {
      en: ['grilled chicken breast', 'basa fish', 'penne', 'tomato sauce'],
      tr: ['ızgara tavuk göğüs', 'basa balığı', 'penne makarna', 'domates soslu']
    },
    sides: {
      en: ['steamed rice', 'sautéed zucchini', 'hash brown', 'congee'],
      tr: ['buharda pilav', 'sote kabak', 'röşti patates', 'pirinç lapası']
    },
    desserts: {
      en: ['mango mousse', 'seasonal fresh fruit'],
      tr: ['mango mus', 'taze mevsim meyveleri']
    },
    basics: {
      en: ['bread', 'butter', 'jam', 'cheese', 'eggs'],
      tr: ['ekmek', 'tereyağı', 'reçel', 'peynir', 'yumurta']
    }
  };

  // Preparation methods in both languages
  private static PREPARATION_METHODS = {
    en: ['grilled', 'steamed', 'sautéed', 'scrambled', 'pickled', 'marinated'],
    tr: ['ızgara', 'buharda', 'sote', 'çırpılmış', 'turşu', 'marine']
  };

  static parseMenuItems(rawItems: any[]): MenuItem[] {
    return rawItems
      .filter(item => item && item.name && item.name.length > 1)
      .map(item => this.normalizeMenuItem(item))
      .filter(item => this.isValidDish(item));
  }

  private static isValidDish(item: MenuItem): boolean {
    const nameLower = item.name.toLowerCase();
    
    // Check against known dishes
    const isKnownDish = Object.values(this.KNOWN_DISHES)
      .some(category => 
        Object.values(category)
          .flat()
          .some(dish => 
            nameLower.includes(dish.toLowerCase()) ||
            this.isSimilarDish(nameLower, dish.toLowerCase())
          )
      );

    // Check for preparation methods
    const hasPreparationMethod = [...this.PREPARATION_METHODS.en, ...this.PREPARATION_METHODS.tr]
      .some(method => nameLower.includes(method.toLowerCase()));

    // Additional validation for short items like "Bread" or "Ekmek"
    const isBasicItem = this.KNOWN_DISHES.basics.en.concat(this.KNOWN_DISHES.basics.tr)
      .some(basic => nameLower === basic.toLowerCase());

    return isKnownDish || hasPreparationMethod || isBasicItem;
  }

  private static isSimilarDish(input: string, knownDish: string): boolean {
    // Handle variations in spelling and word order
    const normalizedInput = input
      .replace(/\s+/g, '')
      .toLowerCase()
      .replace(/ü/g, 'u')
      .replace(/ö/g, 'o')
      .replace(/ı/g, 'i')
      .replace(/ş/g, 's')
      .replace(/ğ/g, 'g')
      .replace(/ç/g, 'c');

    const normalizedKnown = knownDish
      .replace(/\s+/g, '')
      .toLowerCase()
      .replace(/ü/g, 'u')
      .replace(/ö/g, 'o')
      .replace(/ı/g, 'i')
      .replace(/ş/g, 's')
      .replace(/ğ/g, 'g')
      .replace(/ç/g, 'c');

    return normalizedInput.includes(normalizedKnown) || 
           normalizedKnown.includes(normalizedInput);
  }

  private static normalizeMenuItem(item: any): MenuItem {
    const name = this.cleanDishName(item.name);
    const description = this.cleanDescription(item.description || '');
    
    return {
      name: name,
      description: description,
      languages: this.detectLanguages(name, description),
      dietaryInfo: this.detectDietaryInfo(name, description)
    };
  }

  private static detectLanguages(name: string, description: string): string[] {
    return [...new Set([
      detectLanguage(name),
      detectLanguage(description)
    ].filter(Boolean))];
  }

  private static detectDietaryInfo(name: string, description: string): string[] {
    const text = `${name} ${description}`.toLowerCase();
    const dietaryInfo: string[] = [];

    if (/(vegetable|sebze|salad|salata)/.test(text)) dietaryInfo.push('vegetarian');
    if (/(fish|balık|basa)/.test(text)) dietaryInfo.push('seafood');
    if (/(chicken|tavuk|shrimp|karides)/.test(text)) dietaryInfo.push('poultry');
    if (/(cheese|peynir|butter|tereyağı)/.test(text)) dietaryInfo.push('dairy');
    
    return dietaryInfo;
  }

  private static cleanDishName(name: string): string {
    return name
      .trim()
      .replace(/^[-•*]\s*/, '')
      .replace(/\s+/g, ' ')
      .replace(/["""]/g, '')
      .replace(/^\d+\.\s*/, '')
      .replace(/\s*\([^)]+\)/g, ''); // Remove parenthetical translations
  }

  private static cleanDescription(desc: string): string {
    return desc
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/^[-•*]\s*/, '')
      .replace(/["""]/g, '');
  }
}
