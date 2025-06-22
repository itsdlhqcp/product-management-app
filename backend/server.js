import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/auth.js';
import categoryRoutes from './routes/category.js';
import productRoutes from './routes/product.js';

// Load environment variables
dotenv.config();

const app = express();

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware - Order matters!
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Debug middleware - Add this temporarily to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  console.log('Headers:', req.headers);
  next();
});

// Test route to verify server is working
app.get('/', (req, res) => {
  res.json({ 
    message: 'Server is running!',
    endpoints: {
      auth: '/api/auth',
      categories: '/api',
      products: '/api'
    }
  });
});

// Routes - Register these BEFORE any catch-all routes
app.use('/api/auth', authRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);

// Error handling middleware for multer and other errors
app.use((err, req, res, next) => {
  console.error('Error caught by middleware:', err);
  
  // Handle multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ msg: 'File too large' });
  }
  
  if (err.message === 'Only image files are allowed!') {
    return res.status(400).json({ msg: 'Only image files are allowed' });
  }

  // Handle multer field errors
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ msg: 'Unexpected file field' });
  }
  
  res.status(500).json({ 
    msg: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.all('/{*catchall}', (req, res) => {
  res.status(404).json({ msg: 'Route not found' });
});

// Database connection and server startup
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Available routes:');
    console.log(`  POST /api/product - Create product`);
    console.log(`  GET  /api/products - Get all products`);
    console.log(`  GET  /api/product/:id - Get single product`);
    console.log(`  DELETE /api/product/:id - Delete product`);
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});