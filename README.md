# 🍽️ NoFoodWaste - Recipe Sharing Platform

**NoFoodWaste** is a full-stack MERN (MongoDB, Express, React, Node.js) application that allows users to share, explore, and save food recipes based on ingredients they already have. This project aims to reduce food waste by promoting creative, community-driven cooking habits and mindful consumption.

---

## 🚀 Features

- 🔐 **User Authentication**
  - Register, log in, and manage sessions securely
  - JWT-based protected API routes

- 📚 **Recipe Management**
  - Create, edit, and delete custom recipes
  - Add details like title, ingredients, preparation steps, and category (e.g., dessert, main dish)

- 🔍 **Advanced Filtering**
  - Search recipes by name
  - Filter by type (e.g., breakfast, lunch, dinner)
  - Match recipes by one or multiple ingredients

- ❤️ **Favorite Recipes**
  - Save recipes to a personal list for quick access later

- ⚡ **Modern, Responsive UI**
  - Smooth navigation and dynamic views
  - Built with React and styled using Tailwind CSS

- 🤖 **Optional AI Integration (OpenRouter)**
  - AI-powered enhancement suggestions or features (if implemented)

---

## 🛠️ Tech Stack

### 🌐 Frontend

- React.js
- React Router
- Fetch API
- Tailwind CSS or CSS Modules
- Context API for global state management

### 🔧 Backend

- Node.js
- Express.js
- MongoDB (Mongoose)
- JSON Web Tokens (JWT) for auth
- bcrypt.js for password hashing
- dotenv for environment configs
- Cloudinary for image storage
- OpenRouter (AI API integration)

---

## 📂 Folder Structure

nofoodwastefull/
│
├── foodbank_frontend/ # React frontend
│ ├── components/
│ ├── pages/
│ ├── Context/
│ └── App.js
│
└── FoodBank_Backend/ # Node.js backend
├── routes/
├── controllers/
├── models/
├── middleware/
├── config/
└── server.js


---

## 📦 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/EZZkhalaf/nofoodWasteFull.git
cd nofoodWasteFull
```

***Backend*** 
cd FoodBank_Backend
npm install

***frontend***
cd ../foodbank_frontend
npm install



*** Environment Variables***
PORT=3000
JWT_SECRET=your_jwt_secret
NODE_ENV=development
CONNECT_DATABASE=mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
HUNTER_API_KEY=your_hunter_api_key
API_INSTRUCTIONS_IMPROVE_KEY=your_ai_api_key


---

## ✅ Summary

**NoFoodWaste** is more than just a recipe-sharing app — it's a meaningful solution aimed at reducing food waste through community collaboration and creative cooking. By allowing users to share and search recipes based on available ingredients, the platform encourages smarter food usage and prevents unnecessary waste. This project helped me sharpen my full-stack development skills, implement real-world RESTful API design, and integrate user-friendly features like authentication, filtering, and state management.

It reflects my passion for solving real problems with code — and I'm always looking for new ways to improve it.

---



