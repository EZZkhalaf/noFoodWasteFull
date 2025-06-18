


const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
const connectdb = require('./Config/mongoConnect');
connectdb();



// Enable CORS for your frontend origins
app.use(cors({
  origin: ['https://nofoodwaste-occn.onrender.com'],
  credentials: true,
   methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));



app.options('*', cors());

app.use(express.json({limit : '10mb'}));


// API routes (register before static serving so API routes are matched first)
app.use('/recipe', require('./routes/recipe'));
app.use('/user', require('./routes/user'));
app.use('/ingredients', require('./routes/ingredients'));
app.use('/apiDeepseek', require('./routes/apiDeepseek'));


// Serve React frontend static files from client/dist
const frontendPath = path.join(__dirname, 'client', 'dist');
app.use(express.static(frontendPath));


// For any GET request not handled by the API, serve React index.html (client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'foodbank_frontend/build', 'index.html'));
});
// Start the server
app.listen(PORT, () => {console.log(` Server running on port ${PORT}`);});



