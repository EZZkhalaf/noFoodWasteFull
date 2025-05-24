// const express = require('express');
// const dotenv = require('dotenv').config();
// const connectdb = require('./Config/mongoConnect');
// const jwt = require('jsonwebtoken')
// const cors = require('cors');
// const cloudinary = require('./cloudinaryConfig')
// const path = require('path');

// const app = express();
// app.use(cors({
//   origin: ['https://nofoodwaste-occn.onrender.com'],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
// app.options('*', cors());


// const PORT = process.env.PORT || 5000;
// connectdb();

// app.use(express.static(path.join(__dirname, 'client/dist'))); // or 'client/build' for CRA
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client/dist', 'index.html')); // adjust if you're using 'build'
// });

// app.use(express.json())


// app.use('/recipe' ,require("./routes/recipe"));
// app.use('/user' , require('./routes/user'));
// app.use('/ingredients' , require('./routes/ingredients'));
// app.use('/apiDeepseek' , require('./routes/apiDeepseek'))


// app.listen(PORT , (err) =>{
//     console.log(`running in PORT ${PORT}`)
// })


// module.exports = app;

// /api
// ├── /ingredients
// │   ├── POST /           - Add ingredients entered by the user
// │   └── GET /suggestions - Get ingredient suggestions (optional feature)
// │
// ├── /recipes
// │   ├── GET /            - Get all recipes (with optional filters)
// │   ├── POST /search     - Search recipes based on user ingredients
// │   ├── GET /:id         - Get recipe details by recipe ID
// │   └── POST /           - Add a new recipe (admin or user-uploaded)
// │   └── POST /recipes/:id/reviews - Add a review or rating for a recipe(not added yet)
// │   └──GET /recipes/:id/reviews - Get all reviews for a recipe(not added yet)
// │
// ├── /users
// │   ├── POST /register   - Register a new user
// │   ├── POST /login      - Log in a user
// │   ├── GET /:id/favorites - Get a user's favorite recipes
// │   └── POST /:id/favorites - Add a recipe to user’s favorites
// |   └── PUT /users/:id - Update user profile information(not added yet )
// |   └──DELETE /users/:id - Delete user account(not added yet)
// |   └──POST /users/:id/shopping-list - Add ingredients to a shopping list(ot added yet)


const express = require('express');
const dotenv = require('dotenv').config();
const path = require('path');
const connectdb = require('./Config/mongoConnect');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectdb();

const allowedOrigins = [
  'https://nofoodwaste-occn.onrender.com',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options('*', cors());


// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/recipe', require('./routes/recipe'));
app.use('/user', require('./routes/user'));
app.use('/ingredients', require('./routes/ingredients'));
app.use('/apiDeepseek', require('./routes/apiDeepseek'));

// Serve React frontend static files from foodbank_frontend/build
app.use(express.static(path.join(__dirname, 'foodbank_frontend/build')));

// For any other GET requests not handled by API routes,
// send back React's index.html to allow client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'foodbank_frontend/build', 'index.html'));
});

// 404 handler for other HTTP methods on unknown routes (optional)
app.use((req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

