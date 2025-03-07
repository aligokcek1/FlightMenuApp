import { create } from 'zustand';

export interface MenuItem {
  name: string;
  description: string;
  category?: string;
  languages?: string[];
  dietaryInfo?: string[];
  translations?: {
    [key: string]: {
      name: string;
      description: string;
    };
  };
  timing?: 'pre-landing' | 'regular';
  selected?: boolean;
}

interface MenuStore {
  menuItems: MenuItem[];
  setMenuItems: (items: MenuItem[]) => void;
  clearMenuItems: () => void;
  addMenuItem: (item: MenuItem) => void;
  toggleSelection: (itemName: string) => void;
}

export const useMenuStore = create<MenuStore>((set) => ({
  menuItems: [],
  setMenuItems: (items) => set({ menuItems: items }), // Simplified to just replace items
  clearMenuItems: () => set({ menuItems: [] }),
  addMenuItem: (item) => set((state) => ({ 
    menuItems: [...state.menuItems, item] 
  })),
  toggleSelection: (itemName: string) => set((state) => ({
    menuItems: state.menuItems.map(item => 
      item.name === itemName 
        ? { ...item, selected: !item.selected }
        : item
    )
  })),
}));
