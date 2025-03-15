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
  hasSelectedMainCourse: () => boolean;
}

export const useMenuStore = create<MenuStore>((set, get) => ({
  menuItems: [],
  setMenuItems: (items) => set({ menuItems: items }), // Simplified to just replace items
  clearMenuItems: () => set({ menuItems: [] }),
  addMenuItem: (item) => set((state) => ({ 
    menuItems: [...state.menuItems, item] 
  })),
  toggleSelection: (itemName: string) => set((state) => {
    const item = state.menuItems.find(item => item.name === itemName);
    
    // If item is not found, return current state
    if (!item) return state;

    // If trying to select a main course
    if (item.category === 'Main Courses') {
      // If item is already selected, allow deselection
      if (item.selected) {
        return {
          menuItems: state.menuItems.map(item =>
            item.name === itemName ? { ...item, selected: false } : item
          )
        };
      }
      
      // If trying to select a new main course, deselect any other selected main course
      return {
        menuItems: state.menuItems.map(item =>
          item.category === 'Main Courses'
            ? { ...item, selected: item.name === itemName }
            : item
        )
      };
    }

    // For non-main course items, toggle normally
    return {
      menuItems: state.menuItems.map(item =>
        item.name === itemName ? { ...item, selected: !item.selected } : item
      )
    };
  }),
  hasSelectedMainCourse: () => {
    return get().menuItems.some(item => 
      item.category === 'Main Courses' && item.selected
    );
  },
}));
