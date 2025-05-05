import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { authService } from './services/auth.js';
import { productsService } from './services/products.js';
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

// Configure CORS
app.use(cors({
  origin: ['http://localhost:8081', 'http://localhost:19000'],
  credentials: true
}));

app.use(express.json());

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
      fullName: req.body.fullName
    });
    
    const { email, password, fullName } = req.body;
    const user = await authService.signUp(email, password, fullName);
    
    console.log('Signup successful:', user);
    res.status(201).json({ user });
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

app.get('/api/products/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const products = await productsService.getProductsByCategory(categoryId);
    res.json(products);
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
