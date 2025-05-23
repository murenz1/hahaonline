import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { authService } from './services/auth.js';
import { productsService } from './services/products.js';
import { categoriesService } from './services/categories.js';
import { cartService } from './services/cart.js';
import { ordersService } from './services/orders.js';

const app = express();
const port = process.env.PORT || 3001;

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`\n${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  console.log('Request Body:', req.body);
  console.log('Request Headers:', req.headers);
  next();
});

// Configure CORS - more permissive configuration
app.use(cors({
  // Allow requests from any origin in development
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if(!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:8081',
      'http://localhost:19000',
      'http://localhost:8082',
      'http://localhost:3000',
      'http://127.0.0.1:62548',
      'http://127.0.0.1:8081',
      'http://127.0.0.1:8082',
      'http://127.0.0.1:8083',
      'http://127.0.0.1:3000',
      'http://192.168.1.66:8082',
      'http://192.168.1.66:8081',
      'http://10.15.36.221:3000',
      'http://10.15.36.221:8081',
      'http://10.15.36.221:8082',
      'http://10.15.36.221:19000',
      'http://10.15.36.221:19006',
      // Add any other origins you need
    ];
    
    if(allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.log('CORS blocked request from:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// Categories endpoints
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await categoriesService.getCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Products endpoints
app.get('/api/products', async (req, res) => {
  try {
    const products = await productsService.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/featured', async (req, res) => {
  try {
    const products = await productsService.getFeaturedProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const products = await productsService.getProductsByCategory(categoryId);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    status: err.status || 500
  });
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// Test API route
// Test API route
app.get('/', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Authentication routes
app.post('/auth/signup', async (req, res) => {
  try {
    console.log('Signup request received:', {
      email: req.body.email,
      fullName: req.body.fullName,
      phoneNumber: req.body.phoneNumber
    });
    
    const { email, password, fullName, phoneNumber } = req.body;
    const user = await authService.signUp(email, password, fullName, phoneNumber);
    
    console.log('Signup successful:', user);
    // Make sure we're returning the user object with the token
    res.status(201).json({ user: { ...user, token: user.token } });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(400).json({ error: error.message });
  }
});

app.post('/auth/signin', async (req, res) => {
  try {
    console.log('Login request received:', {
      email: req.body.email
    });
    
    const { email, password } = req.body;
    const user = await authService.signIn(email, password);
    
    console.log('Login successful:', {
      uid: user.uid,
      displayName: user.displayName
    });
    res.json({ user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ error: error.message });
  }
});

app.post('/auth/reset-password', async (req, res) => {
  try {
    const { email } = req.body;
    await authService.resetPassword(email);
    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Authentication routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    const user = await authService.signUp(email, password, fullName);
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.signIn(email, password);
    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email } = req.body;
    await authService.resetPassword(email);
    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Products routes
app.get('/api/products', async (req, res) => {
  try {
    const products = await productsService.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const products = await productsService.getProductsByCategory(categoryId);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search products by name
app.get('/api/products/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    const products = await productsService.searchProducts(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get featured products
app.get('/api/products/featured', async (req, res) => {
  try {
    const featuredProducts = await productsService.getFeaturedProducts();
    res.json(featuredProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Filter products by multiple criteria
app.post('/api/products/filter', async (req, res) => {
  try {
    const { minPrice, maxPrice, rating, inStock, sortBy, sortOrder } = req.body;
    const filteredProducts = await productsService.filterProducts({
      minPrice, maxPrice, rating, inStock, sortBy, sortOrder
    });
    res.json(filteredProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cart routes
app.post('/api/cart/add', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    await cartService.addToCart(userId, productId, quantity);
    res.json({ message: 'Item added to cart' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/cart/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await cartService.getCart(userId);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Orders routes
app.post('/api/orders', async (req, res) => {
  try {
    const { userId, items, shippingAddress, totalPrice } = req.body;
    const orderId = await ordersService.createOrder(userId, items, shippingAddress, totalPrice);
    res.status(201).json({ orderId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/orders/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await ordersService.getUserOrders(userId);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`
===================================
Server started successfully!
===================================
`);
  console.log(`Server running on port ${port}`);
  console.log(`API endpoints:`);
  console.log(`- Test: GET /`);
  console.log(`- Signup: POST /auth/signup`);
  console.log(`- Login: POST /auth/signin`);
  console.log(`- Reset Password: POST /auth/reset-password`);
  console.log(`===================================\n`);
});
