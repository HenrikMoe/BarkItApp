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

//dogpark
const dogParkSchema = {
  parkname: String,
  activeDogsBigPark: [{
    name: String,
    breed: String,
    size: String,
    energy: String,
    age: Number,
    imageUrl: String, // Added image URL field
  }],
  activeDogsSmallPark: [{
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

const HistoricalDogPark = {
  parkname: String,
  activeDogsBigPark: [
    {
      dog: {
        name: String,
        breed: String,
        size: String,
        energy: String,
        age: Number,
        imageUrl: String,
      },
      checkinExpiration: Date,
    },
  ],
  activeDogsSmallPark: [
    {
      dog: {
        name: String,
        breed: String,
        size: String,
        energy: String,
        age: Number,
        imageUrl: String,
      },
      checkinExpiration: Date,
    },
  ],
  timestamp: Date,
};

app.post('/checkin', async (req, res) => {
  try {
    const { dog, park, side /* other fields */ } = req.body;

    console.log(dog)
    // Check if the dog park already exists
    let dogPark = await client.db("barkit").collection("dogparks").findOne({ parkname: park });

    if (!dogPark) {
      // Create a new document for the initial state
      dogPark = {
        parkname: park,
        activeDogsBigPark: [],
        activeDogsSmallPark: [],
        timestamp: new Date(),
      };
    }

    const newDog = {
      name: dog.dogName,
      breed: dog.breed,
      size: dog.size,
      energy: dog.energy,
      age: dog.age,
      imageUrl: dog.imageUrl,
      checkinExpiration: new Date(Date.now() + 1.5 * 60 * 60 * 1000), // 1.5 hours expiration
    };

    // Add the new dog to the appropriate side (big or small)
    if (side === 'big') {
      dogPark.activeDogsBigPark.push({
        dog: newDog,
        checkinExpiration: newDog.checkinExpiration,
      });
    } else {
      dogPark.activeDogsSmallPark.push({
        dog: newDog,
        checkinExpiration: newDog.checkinExpiration,
      });
    }

    // Save the historical data to a separate collection
    await client.db("barkit").collection("historicalDogParks").insertOne({
      ...dogPark,
      timestamp: new Date(),
    });

    // Save the current state to the dogparks collection
    await client.db("barkit").collection("dogparks").updateOne(
      { parkname: park },
      {
        $set: dogPark,
      },
      { upsert: true }
    );

    res.status(201).json({ message: 'Check-in successful', dog: newDog });
  } catch (error) {
    console.error('Error during check-in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

  setInterval(async () => {
   try {
     // Find and update expired check-ins
     await cleanupExpiredCheckins();
   } catch (error) {
     console.error('Error during check-in cleanup:', error);
   }
 }, 60 * 1000);

 async function cleanupExpiredCheckins() {
  const currentTime = new Date();

  // Find and update dog parks with expired check-ins
  await client.db('barkit').collection('dogparks').updateMany(
    {
      $or: [
        { 'activeDogsBigPark.checkinExpiration': { $lt: currentTime } },
        { 'activeDogsSmallPark.checkinExpiration': { $lt: currentTime } },
      ],
    },
    {
      $pull: {
        'activeDogsBigPark': { checkinExpiration: { $lt: currentTime } },
        'activeDogsSmallPark': { checkinExpiration: { $lt: currentTime } },
      },
    }
  );
}

// Assuming you have an Express app
app.post('/updateParkStats', async (req, res) => {
  try {
    const { parkName, newStats /* other fields */ } = req.body;

    // Find the dog park in the database
    const dogPark = await client.db("barkit").collection("dogparks").findOne({ parkname: parkName });

    if (!dogPark) {
      return res.status(404).json({ message: 'Dog park not found' });
    }

    // Update the dog park with new stats
    // Modify this part based on your schema
    dogPark.stats = newStats;

    // Save the updated dog park to the database
    await client.db("barkit").collection("dogparks").updateOne(
      { parkname: parkName },
      {
        $set: dogPark,
      }
    );

    // Get the active dogs in the big and small parks
    const activeDogsBigPark = dogPark.activeDogsBigPark || [];
    const activeDogsSmallPark = dogPark.activeDogsSmallPark || [];

    res.status(200).json({
      message: 'Park stats updated successfully',
      activeDogsBigPark,
      activeDogsSmallPark,
    });
  } catch (error) {
    console.error('Error updating park stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Connect to MongoDB and start the Express server
connectMongoDB().then(() => {
  app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
  });
}).catch(console.error);
