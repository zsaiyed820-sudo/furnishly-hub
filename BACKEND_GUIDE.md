# FurniShop - Complete Backend & Database Guide

## 📁 Folder Structure

```
furnishop/
├── frontend/          (React app - built in Lovable)
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── data/
│   │   └── pages/
│   └── package.json
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   └── admin.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   └── adminController.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── database/
    └── schema.sql
```

## 🗄️ MySQL Database Schema (schema.sql)

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS furnishop;
USE furnishop;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Products table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category_id INT,
    description TEXT,
    image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Cart table
CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_cart_item (user_id, product_id)
);

-- Orders table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status ENUM('Pending', 'Shipped', 'Delivered') DEFAULT 'Pending',
    payment_method ENUM('COD', 'Online') NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Order items table
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- ========= SAMPLE DATA =========

-- Insert categories
INSERT INTO categories (name) VALUES
('Living Room'), ('Bedroom'), ('Dining'), ('Office'), ('Outdoor');

-- Insert admin user (password: admin123, bcrypt hashed)
-- Note: Generate hash using bcrypt in Node.js before inserting
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@furnishop.com', '$2b$10$EXAMPLE_HASH_REPLACE_ME', 'admin');

-- Insert sample user (password: user123)
INSERT INTO users (name, email, password, role) VALUES
('John Doe', 'john@example.com', '$2b$10$EXAMPLE_HASH_REPLACE_ME', 'user');

-- Insert sample products
INSERT INTO products (name, price, category_id, description, image) VALUES
('Nordic Lounge Chair', 599.00, 1, 'A beautifully crafted lounge chair with solid oak legs and premium linen upholstery.', 'https://images.unsplash.com/photo-1567538096621-38d2284b23ff?w=600&h=600&fit=crop'),
('Minimalist Coffee Table', 349.00, 1, 'Clean-lined coffee table crafted from solid walnut with a natural oil finish.', 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=600&h=600&fit=crop'),
('Velvet Sofa - Forest', 1299.00, 1, 'Luxurious three-seater sofa in deep forest green velvet.', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop'),
('Oak Platform Bed', 899.00, 2, 'Solid white oak platform bed with a floating design.', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=600&fit=crop'),
('Walnut Nightstand', 249.00, 2, 'Compact nightstand in American walnut with a single drawer.', 'https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=600&h=600&fit=crop'),
('Extendable Dining Table', 799.00, 3, 'Seats 4-8 comfortably with a hidden butterfly leaf extension.', 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&h=600&fit=crop'),
('Woven Dining Chair', 199.00, 3, 'Paper cord woven seat on a solid oak frame.', 'https://images.unsplash.com/photo-1503602642458-232111445657?w=600&h=600&fit=crop'),
('Standing Desk - Adjustable', 649.00, 4, 'Electric height-adjustable desk with bamboo top.', 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&h=600&fit=crop'),
('Ergonomic Task Chair', 499.00, 4, 'Breathable mesh back with adjustable lumbar support.', 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600&h=600&fit=crop'),
('Teak Garden Bench', 549.00, 5, 'Grade-A teak bench that weathers beautifully over time.', 'https://images.unsplash.com/photo-1591129841117-3adfd313e34f?w=600&h=600&fit=crop');
```

## 🚀 Backend Code (Node.js + Express)

### package.json (backend)
```json
{
  "name": "furnishop-backend",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.0",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### .env
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=furnishop
JWT_SECRET=furnishop_secret_key_2024
```

### config/db.js
```javascript
// Database connection configuration
const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection pool for better performance
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
```

### middleware/auth.js
```javascript
// JWT Authentication & Admin Authorization Middleware
const jwt = require('jsonwebtoken');

// Verify JWT token - protects routes that need login
const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

module.exports = { authenticate, isAdmin };
```

### server.js
```javascript
// Main server file - entry point
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### routes/auth.js
```javascript
const router = require('express').Router();
const { register, login } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

module.exports = router;
```

### controllers/authController.js
```javascript
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Register new user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password with bcrypt (10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, 'user']
    );

    // Generate JWT token
    const token = jwt.sign(
      { id: result.insertId, email, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: { id: result.insertId, name, email, role: 'user' }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    // Compare password with hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login };
```

### routes/products.js
```javascript
const router = require('express').Router();
const { getAllProducts, getProductById, getCategories } = require('../controllers/productController');

router.get('/', getAllProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);

module.exports = router;
```

### controllers/productController.js
```javascript
const db = require('../config/db');

// Get all products (with optional search, category filter, price filter)
const getAllProducts = async (req, res) => {
  try {
    const { search, category, maxPrice } = req.query;
    let query = 'SELECT p.*, c.name as category FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND p.name LIKE ?';
      params.push(`%${search}%`);
    }
    if (category) {
      query += ' AND c.name = ?';
      params.push(category);
    }
    if (maxPrice) {
      query += ' AND p.price <= ?';
      params.push(Number(maxPrice));
    }

    query += ' ORDER BY p.created_at DESC';
    const [products] = await db.query(query, params);
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const [products] = await db.query(
      'SELECT p.*, c.name as category FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?',
      [req.params.id]
    );
    if (products.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json(products[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all categories
const getCategories = async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllProducts, getProductById, getCategories };
```

### routes/cart.js
```javascript
const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { getCart, addToCart, updateCartItem, removeFromCart } = require('../controllers/cartController');

router.get('/', authenticate, getCart);
router.post('/', authenticate, addToCart);
router.put('/:productId', authenticate, updateCartItem);
router.delete('/:productId', authenticate, removeFromCart);

module.exports = router;
```

### controllers/cartController.js
```javascript
const db = require('../config/db');

// Get user's cart items
const getCart = async (req, res) => {
  try {
    const [items] = await db.query(
      `SELECT c.quantity, p.id, p.name, p.price, p.image, cat.name as category
       FROM cart c
       JOIN products p ON c.product_id = p.id
       LEFT JOIN categories cat ON p.category_id = cat.id
       WHERE c.user_id = ?`,
      [req.user.id]
    );
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add product to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    await db.query(
      'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?',
      [req.user.id, productId, quantity, quantity]
    );
    res.json({ message: 'Added to cart' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity <= 0) {
      await db.query('DELETE FROM cart WHERE user_id = ? AND product_id = ?', [req.user.id, req.params.productId]);
    } else {
      await db.query('UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?', [quantity, req.user.id, req.params.productId]);
    }
    res.json({ message: 'Cart updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    await db.query('DELETE FROM cart WHERE user_id = ? AND product_id = ?', [req.user.id, req.params.productId]);
    res.json({ message: 'Removed from cart' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };
```

### routes/orders.js
```javascript
const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { placeOrder, getUserOrders } = require('../controllers/orderController');

router.post('/', authenticate, placeOrder);
router.get('/', authenticate, getUserOrders);

module.exports = router;
```

### controllers/orderController.js
```javascript
const db = require('../config/db');

// Place a new order
const placeOrder = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { paymentMethod, address } = req.body;

    // Get cart items
    const [cartItems] = await connection.query(
      'SELECT c.quantity, p.id as product_id, p.price FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?',
      [req.user.id]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const finalTotal = total > 500 ? total : total + 49; // Free shipping over $500

    // Create order
    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, total, payment_method, address) VALUES (?, ?, ?, ?)',
      [req.user.id, finalTotal, paymentMethod, address]
    );

    // Insert order items
    for (const item of cartItems) {
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderResult.insertId, item.product_id, item.quantity, item.price]
      );
    }

    // Clear cart
    await connection.query('DELETE FROM cart WHERE user_id = ?', [req.user.id]);

    await connection.commit();
    res.status(201).json({ orderId: orderResult.insertId, message: 'Order placed successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Place order error:', error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    connection.release();
  }
};

// Get user's order history
const getUserOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    // Get items for each order
    for (const order of orders) {
      const [items] = await db.query(
        `SELECT oi.*, p.name, p.image FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { placeOrder, getUserOrders };
```

### routes/admin.js
```javascript
const router = require('express').Router();
const { authenticate, isAdmin } = require('../middleware/auth');
const { addProduct, updateProduct, deleteProduct, getAllUsers, getAllOrders, updateOrderStatus } = require('../controllers/adminController');

// All admin routes require authentication + admin role
router.use(authenticate, isAdmin);

router.post('/products', addProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.get('/users', getAllUsers);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

module.exports = router;
```

### controllers/adminController.js
```javascript
const db = require('../config/db');

// Add new product
const addProduct = async (req, res) => {
  try {
    const { name, price, category_id, description, image } = req.body;
    const [result] = await db.query(
      'INSERT INTO products (name, price, category_id, description, image) VALUES (?, ?, ?, ?, ?)',
      [name, price, category_id, description, image]
    );
    res.status(201).json({ id: result.insertId, message: 'Product added' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { name, price, category_id, description, image } = req.body;
    await db.query(
      'UPDATE products SET name=?, price=?, category_id=?, description=?, image=? WHERE id=?',
      [name, price, category_id, description, image, req.params.id]
    );
    res.json({ message: 'Product updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users (admin view)
const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, name, email, role, created_at FROM users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all orders (admin view)
const getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*, u.name as user_name, u.email as user_email
       FROM orders o JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC`
    );
    for (const order of orders) {
      const [items] = await db.query(
        'SELECT oi.*, p.name, p.image FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?',
        [order.id]
      );
      order.items = items;
    }
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addProduct, updateProduct, deleteProduct, getAllUsers, getAllOrders, updateOrderStatus };
```

## 📋 API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Register new user |
| POST | /api/auth/login | No | Login user |
| GET | /api/products | No | Get all products (search, filter) |
| GET | /api/products/categories | No | Get all categories |
| GET | /api/products/:id | No | Get product details |
| GET | /api/cart | User | Get cart items |
| POST | /api/cart | User | Add to cart |
| PUT | /api/cart/:productId | User | Update cart quantity |
| DELETE | /api/cart/:productId | User | Remove from cart |
| POST | /api/orders | User | Place order |
| GET | /api/orders | User | Get order history |
| POST | /api/admin/products | Admin | Add product |
| PUT | /api/admin/products/:id | Admin | Update product |
| DELETE | /api/admin/products/:id | Admin | Delete product |
| GET | /api/admin/users | Admin | Get all users |
| GET | /api/admin/orders | Admin | Get all orders |
| PUT | /api/admin/orders/:id/status | Admin | Update order status |

## 🏃 Steps to Run Locally

### 1. Database Setup
```bash
# Open MySQL terminal
mysql -u root -p

# Run the schema file
source /path/to/schema.sql;
```

### 2. Backend Setup
```bash
cd backend
npm install
# Edit .env with your MySQL credentials
npm run dev
# Server starts on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# App starts on http://localhost:5173
```

### 4. Generate Password Hashes
Run this in Node.js to generate bcrypt hashes for sample users:
```javascript
const bcrypt = require('bcrypt');
async function generateHash() {
  const adminHash = await bcrypt.hash('admin123', 10);
  const userHash = await bcrypt.hash('user123', 10);
  console.log('Admin hash:', adminHash);
  console.log('User hash:', userHash);
}
generateHash();
```
Update the INSERT statements in schema.sql with the generated hashes.

## 🔑 Default Credentials
- **Admin**: admin@furnishop.com / admin123
- **User**: john@example.com / user123
