const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const Collection = require('./config');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set view engine and static files
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.render('Login');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

// Signup Route
app.post('/signup', async (req, res) => {
  const data = {
    name: req.body.username,
    password: req.body.password,
  };

  // Check if user already exists
  const existingUser = await Collection.findOne({ name: data.name });
  if (existingUser) {
    res.send('User already exists');
  } else {
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    data.password = hashedPassword;

    // Save new user
    const userdata = await Collection.insertMany(data);
    console.log(userdata);
    res.send('User registered successfully');
  }
});

// Login Route
app.post('/Login', async (req, res) => {
  try {
    const check = await Collection.findOne({ name: req.body.username });

    if (!check) {
      return res.send('User not found');
    }

    const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);

    if (isPasswordMatch) {
      res.render('Home');
    } else {
      res.send('Wrong password');
    }
  } catch (error) {
    console.error(error);
    res.send('An error occurred');
  }
});

// Start Server
const PORT = 7000;
app.listen(PORT, () => {
  console.log('Server is running on port 7000');
});
