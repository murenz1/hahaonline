export const generateSKU = (category: string, name: string): string => {
  // Get first 3 letters of category (uppercase)
  const categoryPrefix = category.substring(0, 3).toUpperCase();
  
  // Get first letter of each word in name (uppercase)
  const namePrefix = name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 3);
  
  // Add random number (4 digits)
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `${categoryPrefix}-${namePrefix}-${randomNum}`;
};

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CATEGORIES_STORAGE_KEY = 'bolt_categories';

export const categoryService = {
  getCategories: (): Category[] => {
    try {
      const categoriesJson = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      if (!categoriesJson) {
        // Initialize with default categories
        const defaultCategories: Category[] = [
          {
            id: 'cat-1',
            name: 'Gaming Peripherals',
            description: 'Gaming mice, keyboards, headsets, and other peripherals',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'cat-2',
            name: 'Components',
            description: 'Computer components and hardware',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'cat-3',
            name: 'Accessories',
            description: 'Computer and gaming accessories',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];
        localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(defaultCategories));
        return defaultCategories;
      }
      
      const categories = JSON.parse(categoriesJson);
      return categories.map((cat: any) => ({
        ...cat,
        createdAt: new Date(cat.createdAt),
        updatedAt: new Date(cat.updatedAt)
      }));
    } catch (error) {
      console.error('Error getting categories:', error);
      return [];
    }
  },

  addCategory: (name: string, description?: string): Category => {
    try {
      const categories = categoryService.getCategories();
      const newCategory: Category = {
        id: `cat-${Date.now()}`,
        name,
        description,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      categories.push(newCategory);
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
      return newCategory;
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  },

  updateCategory: (id: string, updates: Partial<Category>): Category => {
    try {
      const categories = categoryService.getCategories();
      const index = categories.findIndex(cat => cat.id === id);
      
      if (index === -1) {
        throw new Error('Category not found');
      }
      
      const updatedCategory = {
        ...categories[index],
        ...updates,
        updatedAt: new Date()
      };
      
      categories[index] = updatedCategory;
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
      return updatedCategory;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  deleteCategory: (id: string): boolean => {
    try {
      const categories = categoryService.getCategories();
      const filteredCategories = categories.filter(cat => cat.id !== id);
      
      if (filteredCategories.length === categories.length) {
        return false;
      }
      
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(filteredCategories));
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    }
  }
}; 