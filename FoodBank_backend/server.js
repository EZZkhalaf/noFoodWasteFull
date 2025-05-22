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
const cloudinary = require('./cloudinaryConfig');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectdb();

// CORS setup for your frontend origin
app.use(cors({
  origin: 'https://nofoodwaste-occn.onrender.com', // Your frontend URL
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

// Serve React frontend static files
app.use(express.static(path.join(__dirname, 'client/build')));

// For any other GET request that is NOT handled by API routes,
// serve React's index.html file to let React Router handle the route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Optional: 404 handler for other HTTP methods on unknown routes (not GET)
app.use((req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});


