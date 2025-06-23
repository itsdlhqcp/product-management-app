
# Product Management Application

![Screenshot 2025-06-23 114314](https://github.com/user-attachments/assets/9f050040-52f7-475b-9c71-6c4cdf609a1a)
![Screenshot 2025-06-23 114904](https://github.com/user-attachments/assets/a50c4e5a-4db7-48ca-a89e-e0dbed395740)

A full-stack product management application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that allows users to manage categories, subcategories, and products with multiple variants.

## 🚀 Features

- **User Authentication** - Secure signup and login functionality
- **Category Management** - Add and manage product categories
- **Subcategory Management** - Create subcategories under main categories
- **Product Management** - Add products with multiple variants
- **Product Variants** - Each product can have multiple variants with different RAM, price, and quantity
- **Image Upload** - Support for product image uploads
- **Product Display** - View all products with detailed information
- **Product Filtering** - Filter products by subcategory
- **Search Functionality** - Search products by name
- **Pagination** - Efficient pagination for product listings
- **Responsive Design** - Mobile-friendly interface (partial implementation)

## 🛠 Technology Stack

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Frontend
- **React.js** - JavaScript library for building user interfaces
- **HTML5 & CSS3** - Markup and styling
- **JavaScript (ES6+)** - Programming language

## 📁 Project Structure

```
product-management-app/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
│   └── public/
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup
1. Clone the repository
```bash
git clone <repository-url>
cd product-management-app/backend
```

2. Install dependencies
```bash
npm install
```

3. Create environment variables
```bash
# Create .env file with the following:
MONGODB_URI=mongodb://localhost:27017/product-management
PORT=5000
JWT_SECRET=your-jwt-secret
```

4. Start the backend server
```bash
npm start
```
Server will run on `http://localhost:5000`

### Frontend Setup
1. Navigate to frontend directory
```bash
cd ../frontend
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```
Application will run on `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Categories

#### Create Category
```http
POST /category
Content-Type: application/json

{
  "name": "ELECTRO"
}
```

#### Get All Categories
```http
GET /categories
```

### Subcategories

#### Create Subcategory
```http
POST /subcategory
Content-Type: application/json

{
  "name": "resistor",
  "categoryId": "6857b8cba03a5618fc0bf070"
}
```

#### Get All Subcategories
```http
GET /subcategories
```

### Products

#### Get All Products
```http
GET /products
```

#### Get Product by ID
```http
GET /product/:id
```

#### Create Product
```http
POST /product
Content-Type: multipart/form-data

{
  "title": "Product Name",
  "description": "Product Description",
  "subCategoryId": "subcategory-id",
  "variants": [
    {
      "ram": "8GB",
      "price": 299,
      "quantity": 50
    }
  ],
  "images": [file]
}
```

## 📱 Application Status

### Backend
- ✅ **100% Complete** - All API endpoints implemented and tested
- ✅ User Authentication
- ✅ Category Management
- ✅ Subcategory Management
- ✅ Product Management with Variants
- ✅ Image Upload
- ✅ Database Integration

### Frontend
- ✅ **Large Screens** - Fully responsive and functional
- ✅ **Medium Screens** - Fully responsive and functional
- ⚠️ **Small Screens** - 20% responsive work completed

## 🔍 Sample API Responses

### Category Response
```json
{
  "category": {
    "name": "ELECTRO",
    "_id": "6857b8cba03a5618fc0bf070",
    "createdAt": "2025-06-22T08:03:23.503Z",
    "updatedAt": "2025-06-22T08:03:23.503Z",
    "__v": 0
  }
}
```

### Product Response
```json
{
  "product": {
    "_id": "6857f649bdd2a1342366bc4e",
    "title": "black room",
    "description": "black room here",
    "subCategoryId": {
      "_id": "6857f589bdd2a1342366bc36",
      "name": "BHKS",
      "categoryId": {
        "_id": "6857f576bdd2a1342366bc33",
        "name": "Rooms"
      }
    },
    "variants": [
      {
        "ram": "2",
        "price": 100,
        "quantity": 10,
        "_id": "6857f649bdd2a1342366bc4f"
      }
    ],
    "images": ["images-1750595145581-127465806.jpeg"],
    "createdAt": "2025-06-22T12:25:45.624Z",
    "updatedAt": "2025-06-22T12:25:45.624Z"
  }
}
```

## 🎯 Key Features Implemented

- **MVC Architecture** - Clean separation of concerns
- **RESTful API Design** - Standard HTTP methods and status codes
- **Data Validation** - Input validation and error handling
- **Image Handling** - File upload and storage
- **Relational Data** - Proper linking between categories, subcategories, and products
- **Product Variants** - Multiple variants per product with different specifications

## 🚧 Future Enhancements

- Complete mobile responsiveness for small screens
- User role management (Admin/User)
- Product reviews and ratings
- Shopping cart functionality
- Order management system
- Advanced search filters
- Product recommendations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 👨‍💻 Author

Dilhaque Ahemmed C P

## 📞 Support:- 8590788977

For support, email dilhaquecp@gmail.com or create an issue in the repository.

---

**Note**: This application was developed as part of a 2-day assignment to demonstrate full-stack development skills using the MERN stack.
