const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory user storage for demonstration purposes
const users = [];
const secretKey = 'your_jwt_secret';  // Replace with a more secure key

// Session configuration
app.use(session({
  secret: 'your_session_secret',  // Replace with a more secure key
  resave: false,
  saveUninitialized: true,
}));

// Register endpoint
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.status(201).send('User registered');
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ username }, secretKey);
    req.session.token = token; // Store token in session
    res.json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

// Middleware to check authentication
const authenticateToken = (req, res, next) => {
  const token = req.session.token;
  
  if (token) {
    jwt.verify(token, secretKey, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Example protected endpoint
app.get('/transactions', authenticateToken, (req, res) => {
  // Placeholder for transactions data
  res.json([{ id: 1, amount: 50, description: 'Grocery' }]);
});

app.listen(3000, () => console.log('Server running on port 3000'));
