const express = require('express');
const app = express();
const port = 3029;
const cors = require('cors');
app.use(cors());
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Connect MongoDB client
async function connectMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Middleware
app.use(bodyParser.json());

// User schema
const userSchema = {
  username: String,
  password: String,
  dogs: [{
    name: String,
    breed: String,
    size: String,
    energy: String,
    age: Number,
    imageUrl: String, // Added image URL field
  }],
};

// Sign-up endpoint
app.post('/signup', async (req, res) => {
  console.log('hello');

  console.log(req.body);

  try {
    const { username, password, dogName, breed, size, energy, age, dogImage } = req.body;

console.log(username)
    // Check if the username already exists
    const existingUser = await client.db("barkit").collection("users").findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    console.log('sdff')

    const dogs = [{ dogName, age, breed, size, energy, dogImage }]
    // Create a new user
    const newUser = { username, password, dogs };

    console.log(newUser)
    await client.db("barkit").collection("users").insertOne(newUser);

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Sign-in endpoint (replace with actual logic)
// Sign-in endpoint
app.post('/signin', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user exists
    const user = await client.db("barkit").collection("users").findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the password is correct
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // If everything is correct, send a success response
    res.status(200).json({ message: 'Sign-in successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



// Get user dogs endpoint
app.get('/userdogs', async (req, res) => {
  try {
    const { username } = req.query;

    // Check if the username exists
    const user = await client.db("barkit").collection("users").findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If the user is found, return the user's dogs
    const userDogs = user.dogs || [];
    res.status(200).json({ userDogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Connect to MongoDB and start the Express server
connectMongoDB().then(() => {
  app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
  });
}).catch(console.error);
