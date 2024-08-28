const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./user');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect('mongodb+srv://ajibodedaniel477:mgHxMrydSs4vJFxZ@daniel1.ou5v0yq.mongodb.net/?retryWrites=true&w=majority&appName=Daniel1', { ssl: true })
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    process.exit(1); // Exit if the connection fails 
  });


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/add-user', (req, res) => {
  const { username, email, dateOfBirth } = req.body;

  // Validate fields
  if (!username || typeof username !== 'string') {
    return res.status(400).send('Invalid username');
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).send('Invalid email');
  }

  const dob = new Date(dateOfBirth);
  if (!dateOfBirth || isNaN(dob)) {
    return res.status(400).send('Invalid date of birth');
  }

  const newUser = new User({
    username,
    email,
    dateOfBirth: dob,
  });

  newUser.save()
    .then(() => res.send('User added successfully!'))
    .catch((error) => {
      console.error('Error while saving user to MongoDB:', error.message);
      res.status(500).send('An error occurred while saving the user');
    });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
