const express = require('express');
const app = express();
const port = 3029;
const cors = require('cors');
app.use(cors());
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const nodemailer = require('nodemailer');

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_URI;
const { EMAIL_USER, EMAIL_PASSWORD } = process.env; // Use environment variables
app.use(express.json({ limit: '10mb' })); // Adjust the limit accordingly

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
    const { username, password, dogName, breed, size, energy, age, dogImage, email } = req.body;

    console.log(username);
    // Check if the username already exists
    const existingUser = await client.db("barkit").collection("users").findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Check if the email already exists
    const existingEmail = await client.db("barkit").collection("users").findOne({ email });

    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    console.log('sdff');

    const dogs = [{ dogName, age, breed, size, energy, dogImage }];
    // Include email in the user schema
    const newUser = { username, password, email, dogs };

    console.log(newUser);
    await client.db("barkit").collection("users").insertOne(newUser);

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Sign-in endpoint (replace with actual logic)
app.post('/signin', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user exists by username or email
    var user = await client.db("barkit").collection("users").findOne({
      $or: [
        { username: username },
        { email: username },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the password is correct
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // If everything is correct, send a success response with the username
    res.status(200).json({ message: 'Sign-in successful', username: user.username });
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
    console.log(userDogs)
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

    console.log(dog);
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
      imageUrl: dog.dogImage,
      checkinExpiration: new Date(Date.now() + 1.5 * 60 * 60 * 1000), // 1.5 hours expiration
      user: { username: dog.username }, // Include the username from the client
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
      parkname: dogPark.parkname,
      activeDogsBigPark: dogPark.activeDogsBigPark,
      activeDogsSmallPark: dogPark.activeDogsSmallPark,
      timestamp: new Date(),
    });

    // Save the current state to the dogparks collection
    await client.db("barkit").collection("dogparks").updateOne(
      { parkname: park },
      {
        $set: {
          parkname: dogPark.parkname,
          activeDogsBigPark: dogPark.activeDogsBigPark,
          activeDogsSmallPark: dogPark.activeDogsSmallPark,
          timestamp: new Date(),
        },
      },
      { upsert: true }
    );

    res.status(201).json({ message: 'Check-in successful', dog: newDog });
  } catch (error) {
    console.error('Error during check-in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Assuming you have an Express app

// Existing route for updating park stats
app.post('/updateParkStats', async (req, res) => {
  try {
    const { parkName, newStats, /* other fields */ } = req.body;
    console.log(req.body);

    // Find the dog park in the database
    const dogPark = await client.db("barkit").collection("dogparks").findOne({ parkname: parkName });

    console.log(dogPark)
    if (!dogPark) {
      return res.status(404).json({ message: 'Dog park not found' });
    }

    // Prepare the update object with the provided fields
    const updateObject = {
      $set: {
        parkname: dogPark.parkname,
        activeDogsBigPark: dogPark.activeDogsBigPark,
        activeDogsSmallPark: dogPark.activeDogsSmallPark,
        timestamp: new Date(),
      },
    };

    // Add newStats to the updateObject if it is provided
    if (newStats) {
      updateObject.$set.stats = newStats;
    }
    console.log(updateObject)

    // Save the current state to the dogparks collection
    await client.db("barkit").collection("dogparks").updateOne(
      { parkname: parkName },
      updateObject,
      { upsert: true }
    );

    console.log(dogPark)


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


// Modified cleanup function with historical data integration
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
  const result = await client.db('barkit').collection('dogparks').updateMany(
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

  // Save historical data only if updates were made
  if (result.modifiedCount > 0) {
    const dogParks = await client.db('barkit').collection('dogparks').find().toArray();

    // Save the historical data to a separate collection
    await client.db("barkit").collection("historicalDogParks").insertMany(
      dogParks.map(dogPark => ({
        parkname: dogPark.parkname,
        activeDogsBigPark: dogPark.activeDogsBigPark,
        activeDogsSmallPark: dogPark.activeDogsSmallPark,
        timestamp: new Date(),
      }))
    );
  }
}


app.post('/checkout', async (req, res) => {
  console.log('hello');
  try {
    console.log('hello2');

    const { dog, park, side, user /* other fields */ } = req.body;

    // Check if the affiliated user matches the username provided in the request
    if (dog.username !== user.username) {
      return res.status(403).json({ message: 'Unauthorized: The specified user does not match the affiliated user of the dog' });
    }

    // Find the dog park in the database
    let dogPark = await client.db("barkit").collection("dogparks").findOne({ parkname: park });

    if (!dogPark) {
      return res.status(404).json({ message: 'Dog park not found' });
    }

    // Check if the dog is in the specified side (big or small) and belongs to the same user
    const dogToCheckOut = side === 'big'
      ? dogPark.activeDogsBigPark.find(d => d.dog.name === dog.dogName && d.dog.username === dog.username)
      : dogPark.activeDogsSmallPark.find(d => d.dog.name === dog.dogName && d.dog.username === dog.username);

    if (!dogToCheckOut) {
      return res.status(404).json({ message: 'Dog not found in the specified side or does not belong to the user' });
    }

    // Remove the dog from the specified side
    if (side === 'big') {
      dogPark.activeDogsBigPark = dogPark.activeDogsBigPark.filter(d => d.dog.name !== dog.dogName);
    } else {
      dogPark.activeDogsSmallPark = dogPark.activeDogsSmallPark.filter(d => d.dog.name !== dog.dogName);
    }

    // Update the dog park in the database
    await client.db("barkit").collection("dogparks").updateOne(
      { parkname: park },
      {
        $set: {
          parkname: dogPark.parkname,
          activeDogsBigPark: dogPark.activeDogsBigPark,
          activeDogsSmallPark: dogPark.activeDogsSmallPark,
          timestamp: new Date(),
        },
      }
    );

    // Save the checkout information to historical data, including user information
    await client.db("barkit").collection("historicalDogParks").insertOne({
      parkname: dogPark.parkname,
      activeDogsBigPark: dogPark.activeDogsBigPark,
      activeDogsSmallPark: dogPark.activeDogsSmallPark,
      timestamp: new Date(),
      checkoutInfo: { dog, park, side, user: { username: dog.username } },
    });

    res.status(200).json({ message: 'Check-out successful', dog });
  } catch (error) {
    console.error('Error during check-out:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.get('/dogparkhistory', async (req, res) => {
  console.log('hello');
  try {
    const { username } = req.query;

    // Check if the username exists
    const user = await client.db("barkit").collection("users").findOne({ username });

    console.log(user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If the user is found, fetch historical dog park data
    const historicalDogParks = await client.db("barkit").collection("historicalDogParks")
      .aggregate([
        {
          $match: {
            $or: [
              { 'activeDogsBigPark.dog.user.username': username },
              { 'checkoutInfo.dog.user.username': username },
              { 'activeDogsSmallPark.dog.user.username': username },
            ],
          },
        },
        {
          $project: {
            dogName: {
              $cond: {
                if: { $eq: ['$activeDogsBigPark', null] },
                then: { $ifNull: ['$checkoutInfo.dog.name', '$activeDogsSmallPark.dog.name'] },
                else: '$activeDogsBigPark.dog.name'
              }
            },
            parkname: '$parkname',
            timestamp: '$timestamp',
            checkin: {
              $cond: {
                if: {
                  $and: [
                    { $ne: ['$activeDogsBigPark', null] },
                    { $isArray: '$activeDogsBigPark' },
                    { $gt: [{ $size: '$activeDogsBigPark' }, 0] }
                  ]
                },
                then: {
                  dog: { $arrayElemAt: ['$activeDogsBigPark.dog', 0] },
                  checkinExpiration: '$activeDogsBigPark.checkinExpiration'
                },
                else: {
                  // If there's no check-in in big park, check for small park
                  $cond: {
                    if: {
                      $and: [
                        { $ne: ['$activeDogsSmallPark', null] },
                        { $isArray: '$activeDogsSmallPark' },
                        { $gt: [{ $size: '$activeDogsSmallPark' }, 0] }
                      ]
                    },
                    then: {
                      dog: { $arrayElemAt: ['$activeDogsSmallPark.dog', 0] },
                      checkinExpiration: '$activeDogsSmallPark.checkinExpiration'
                    },
                    else: null
                  }
                }
              }
            },
            checkout: {
              $cond: {
                if: { $ne: ['$checkoutInfo', null] },
                then: {
                  dog: '$checkoutInfo.dog',
                  park: '$checkoutInfo.park',
                  side: '$checkoutInfo.side',
                  user: '$checkoutInfo.user'
                },
                else: null
              }
            }
          }
        },
        {
          $group: {
            _id: { dogName: '$dogName', parkname: '$parkname', timestamp: '$timestamp' },
            checkin: { $first: '$checkin' },
            checkout: { $first: '$checkout' },
            events: { $push: '$$ROOT' } // Save all events for later filtering
          }
        },
        {
          $project: {
            _id: 0,
            dogName: '$_id.dogName',
            parkname: '$_id.parkname',
            timestamp: '$_id.timestamp',
            events: '$events'
          }
        }
      ])
      .toArray();

    // Filter events to include only those with a check-in
    const filteredEvents = historicalDogParks.filter(({ checkin }) => checkin !== null);

    console.log(historicalDogParks);

    res.status(200).json({ historicalDogParks: filteredEvents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



// ... (Existing imports and code)

app.post('/adddog', async (req, res) => {
  try {
    const { username, dogData } = req.body;
    console.log(username, dogData )

    // Find the user by username
    const user = await client.db("barkit").collection("users").findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(user)
    // Add the new dog to the user's dogs array
    user.dogs.push(dogData);

    // Update the user in the database
    await client.db("barkit").collection("users").updateOne({ username }, { $set: { dogs: user.dogs } });

    res.status(201).json({ message: 'Dog added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.post('/editdog', async (req, res) => {
  try {
    const { username, previousDogName, dogData } = req.body;
    console.log(dogData)

    // Find the user by username
    const user = await client.db("barkit").collection("users").findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

console.log(user)
console.log(previousDogName)

    // Find the index of the dog to be edited using previousDogName
    const dogIndex = user.dogs.findIndex(dog => dog.dogName === previousDogName);

    console.log(dogIndex)
    if (dogIndex === -1) {
      return res.status(404).json({ message: 'Dog not found' });
    }

    // Update the dog details
    user.dogs[dogIndex] = dogData;

    console.log(dogData)
    // Update the user in the database
    await client.db("barkit").collection("users").updateOne({ username }, { $set: { dogs: user.dogs } });

    res.status(200).json({ message: 'Dog edited successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



app.post('/removedog', async (req, res) => {
  try {
    const { username, dogData } = req.body;

    // Find the user by username
    const user = await client.db("barkit").collection("users").findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the index of the dog to be removed
    const dogIndex = user.dogs.findIndex(dog => dog.dogName === dogData.dogName);

    if (dogIndex === -1) {
      return res.status(404).json({ message: 'Dog not found' });
    }

    // Remove the dog from the user's dogs array
    user.dogs.splice(dogIndex, 1);

    // Update the user in the database
    await client.db("barkit").collection("users").updateOne({ username }, { $set: { dogs: user.dogs } });

    res.status(200).json({ message: 'Dog removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Backend (Node.js + Express) Code
app.post('/forgotpassword', async (req, res) => {
  try {
    const { email } = req.body;

    // Fetch user from the database based on email
    const user = await client.db("barkit").collection("users").findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found or invalid email' });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      secure: false, // Use SSL
    });

    // URL with username and email as query parameters
    const resetUrl = `http://localhost:3029?resetPw=true&email=${user.email}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset',
      text: `Click the following link to reset your password: ${resetUrl}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error sending password reset email' });
      }

      console.log('Email sent: ' + info.response);
      res.status(200).json({ message: 'Password reset link sent successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

  app.post('/resetpassword', async (req, res) => {
    try {
      const { email, newPassword } = req.body;

      console.log('hello')
      console.log(email, newPassword)

      // Check if the email exists
      const user = await client.db('barkit').collection('users').findOne({ email });

      console.log(user)

      if (!user) {
        return res.status(404).json({ message: 'User not found or invalid email' });
      }

      // Hash the new password before storing it
    //  const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password in the database
      await client.db('barkit').collection('users').updateOne(
        { email },
        { $set: { password: newPassword } }
      );

      res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });


  // Handler to send messages to the 'dogParkChats' database object
  app.post('/sendmessage/:dogParkName', async (req, res) => {
    try {
      const { dogParkName } = req.params;
      const { user, message } = req.body;

      const timestamp = new Date().toISOString();

      // Insert the new message with timestamp into the 'dogParkChats' collection
      await client.db('barkit').collection('dogParkChats').updateOne(
        { dogParkName },
        { $push: { messages: { user, message, timestamp } } },
        { upsert: true } // Create the document if it doesn't exist
      );

      res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

// Existing handler to get chat messages for a specific dog park
app.get('/chat/:dogParkName', async (req, res) => {
  try {
    const { dogParkName } = req.params;

    // Retrieve chat messages for the specified dog park from the database
    const chatData = await client.db('barkit').collection('dogParkChats').findOne({ dogParkName });

    if (!chatData) {
      return res.status(404).json({ messages: [] });
    }

    res.status(200).json({ messages: chatData.messages });
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
