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


//will be added search by user name 
const express = require('express');
const dotenv = require('dotenv').config();
const connectdb = require('./Config/mongoConnect');
const cors = require('cors');
const cloudinary = require('./cloudinaryConfig'); // Assuming this sets up cloudinary
const path = require('path');

// Initialize Express App
const app = express();

// Connect to MongoDB
connectdb();

// CORS Configuration
app.use(cors({
  origin: 'https://nofoodwaste-occn.onrender.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors()); // Preflight requests

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/recipe', require('./routes/recipe'));
app.use('/user', require('./routes/user'));
app.use('/ingredients', require('./routes/ingredients'));
app.use('/apiDeepseek', require('./routes/apiDeepseek'));

// Serve Frontend Build
const frontendPath = path.join(__dirname, '../foodbank_frontend/dist');
app.use(express.static(frontendPath));

// Handle React Routing, Avoiding API Routes
const apiRoutes = ['/recipe', '/user', '/ingredients', '/apiDeepseek'];
app.get('*', (req, res, next) => {
  if (apiRoutes.some(route => req.path.startsWith(route))) {
    return next();
  }
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

module.exports = app;
