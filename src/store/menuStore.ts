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
  toggleSelection: (itemName: string, timing?: string) => void;
  hasSelectedMainCourse: () => boolean;
}

export const useMenuStore = create<MenuStore>((set, get) => ({
  menuItems: [],
  setMenuItems: (items) => set({ menuItems: items }), // Simplified to just replace items
  clearMenuItems: () => set({ menuItems: [] }),
  addMenuItem: (item) => set((state) => ({ 
    menuItems: [...state.menuItems, item] 
  })),
  toggleSelection: (itemName: string, timing?: string) => set((state) => {
    const items = state.menuItems.map(item => {
      // Only toggle if both name AND timing match (or both don't have timing)
      if (item.name === itemName && item.timing === timing) {
        return { ...item, selected: !item.selected };
      }
      // For main courses, deselect others in the same timing category
      if (item.category === 'Main Courses' && item.timing === timing && !item.selected) {
        return { ...item, selected: false };
      }
      return item;
    });
    
    return { menuItems: items };
  }),
  hasSelectedMainCourse: () => {
    return get().menuItems.some(item => 
      item.category === 'Main Courses' && item.selected
    );
  },
}));
