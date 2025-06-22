// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import authRoutes from './routes/auth.js';
// import categoryRoutes from './routes/category.js';
// import productRoutes from './routes/product.js';

// dotenv.config();
// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api', categoryRoutes);
// app.use('/api', productRoutes);

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ msg: 'Something went wrong!' });
// });

// // 404 handler - Fixed for Express 5
// app.all('/{*catchall}', (req, res) => {
//   res.status(404).json({ msg: 'Route not found' });
// });

// // Database connection and server startup
// const PORT = process.env.PORT || 5000;

// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => {
//   console.log('Connected to MongoDB');
//   app.listen(PORT, () => {
//     console.log(`Server started on port ${PORT}`);
//   });
// })
// .catch(err => {
//   console.error('Database connection error:', err);
//   process.exit(1);
// });


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
// ... other route imports

// Load environment variables
dotenv.config();

const app = express();

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
// ... other routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: 'Something went wrong!' });
});

// 404 handler - Fixed for Express 5
// app.all('/*', (req, res) => {
//   res.status(404).json({ msg: 'Route not found' });
// });

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
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});