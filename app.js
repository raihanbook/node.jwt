const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { authRequire, checkUser } = require('./middleware/authMiddleware');

const app = express();

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// View engine
app.set('view engine', 'ejs');

// Database connection
const dbURI = 'mongodb+srv://node-jwt:node-jwt-01@cluster-0.nseva.mongodb.net/node-jwt?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
.then((result) => app.listen(3000))
.catch((err) => console.log(err));

// Routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', authRequire, (req, res) => res.render('smoothies'));
app.use(authRoutes);