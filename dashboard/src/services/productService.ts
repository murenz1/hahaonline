interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'draft' | 'archived';
  image?: string;
  sku: string;
  variants?: {
    id: string;
    name: string;
    price: number;
    stock: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const STORAGE_KEY = 'bolt_products';

// Helper function to convert date strings back to Date objects
const parseProduct = (product: any): Product => ({
  ...product,
  createdAt: new Date(product.createdAt),
  updatedAt: new Date(product.updatedAt)
});

export const productService = {
  getProducts: (): Product[] => {
    try {
      const products = localStorage.getItem(STORAGE_KEY);
      if (!products) return [];
      return JSON.parse(products).map(parseProduct);
    } catch (error) {
      console.error('Error loading products:', error);
      return [];
    }
  },

  saveProducts: (products: Product[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      console.error('Error saving products:', error);
    }
  },

  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product => {
    const products = productService.getProducts();
    const newProduct: Product = {
      ...product,
      id: `PROD-${String(products.length + 1).padStart(3, '0')}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    products.push(newProduct);
    productService.saveProducts(products);
    return newProduct;
  },

  updateProduct: (id: string, updates: Partial<Product>): Product | null => {
    const products = productService.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    const updatedProduct: Product = {
      ...products[index],
      ...updates,
      id: products[index].id, // Ensure ID doesn't change
      createdAt: products[index].createdAt, // Preserve creation date
      updatedAt: new Date() // Update modification date
    };
    products[index] = updatedProduct;
    productService.saveProducts(products);
    return updatedProduct;
  },

  deleteProduct: (id: string): boolean => {
    const products = productService.getProducts();
    const filteredProducts = products.filter(p => p.id !== id);
    if (filteredProducts.length === products.length) return false;
    productService.saveProducts(filteredProducts);
    return true;
  },

  // Initialize with sample data if no products exist
  initializeWithSampleData: (): void => {
    const existingProducts = productService.getProducts();
    if (existingProducts.length === 0) {
      const sampleProducts: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[] = [
        {
          name: 'Wireless Gaming Mouse',
          description: 'High-performance wireless gaming mouse with RGB lighting',
          category: 'Gaming Peripherals',
          price: 79.99,
          stock: 150,
          status: 'active',
          sku: 'WGM-001',
          variants: [
            {
              id: 'VAR-001',
              name: 'Black',
              price: 79.99,
              stock: 100
            },
            {
              id: 'VAR-002',
              name: 'White',
              price: 79.99,
              stock: 50
            }
          ]
        },
        {
          name: 'Mechanical Keyboard',
          description: 'RGB mechanical keyboard with blue switches',
          category: 'Gaming Peripherals',
          price: 129.99,
          stock: 75,
          status: 'active',
          sku: 'MKB-001'
        },
        {
          name: 'Gaming Headset',
          description: '7.1 surround sound gaming headset',
          category: 'Gaming Peripherals',
          price: 99.99,
          stock: 0,
          status: 'active',
          sku: 'GHS-001'
        }
      ];

      sampleProducts.forEach(product => productService.addProduct(product));
    }
  }
}; 