import React, { useEffect, useState, useRef, ChangeEvent, FormEvent } from 'react';
import { createRoot } from 'react-dom/client';

import { APIProvider, Map, useMap, AdvancedMarker } from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import SignUpForm from './SignUpForm'; // Adjust the path accordingly
import SignInForm from './SignInForm'; // Adjust the path accordingly
import Chat from './chat'; // Assuming the Chat component file is in the same directory
import PasswordResetForm from './PasswordResetForm'; // New PasswordResetForm component
import DogParkCalendar from './DogParkCalendar'
import type { Marker } from '@googlemaps/markerclusterer';
import trees from './trees';
import heic2any from 'heic2any';
import { ring } from 'ldrs'
import UserProfile from './UserProfile'
ring.register('my-precious')
import {
  AdvancedMarker,
  APIProvider,
  InfoWindow,
  Map,
  Marker,
  Pin
} from '@vis.gl/react-google-maps';

import {MarkerWithInfowindow} from './marker-with-infowindow';
console.log(process.env)
const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_CLIENT_ID


import mapStyle from './mapStyle.ts';

const MapTypeId = {
  HYBRID: 'hybrid',
  ROADMAP: 'roadmap',
  SATELLITE: 'satellite',
  TERRAIN: 'terrain'
};
export type MapConfig = {
  id: string;
  label: string;
  mapId?: string;
  mapTypeId?: string;
  styles?: google.maps.MapTypeStyle[];
};

const MAP_CONFIGS: MapConfig[] = [

  {
    id: 'styled1',
    label: 'Raster / "Bright Colors" (no mapId)',
    mapTypeId: MapTypeId.ROADMAP,
    styles: mapStyle
  },

];




console.log(process.env.VITE_REACT_APP_GOOGLE_MAPS_CLIENT_ID)

const App: React.FC = () =>{

  const [username, setUsername] = useState<string>(''); // Add username state

  const [showStats, setShowStats] = useState(false);


  // useEffect(() => {
  //   // Load Google Maps API asynchronously
  //   const loadGoogleMapsApi = () => {
  //     const script = document.createElement('script');
  //     script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=maps&callback=initMap`;
  //     script.async = true;
  //     script.defer = true;
  //     script.onload = () => {
  //       // The Google Maps API has been loaded
  //       // You can initialize your map or perform other actions here
  //       console.log('Google Maps API loaded');
  //     };
  //     document.head.appendChild(script);
  //   };
  //
  //   // Call the function to load the API
  //   loadGoogleMapsApi();
  //
  //   // Clean up the script tag on component unmount
  //   return () => {
  //     const script = document.querySelector('script[src^="https://maps.googleapis.com"]');
  //     if (script) {
  //       script.remove();
  //     }
  //   };
  // }, []); // Empty dependency array ensures that this effect runs only once on component mount

  // Assuming you have state variables like this in your component
  const [bigParkData, setBigParkData] = useState([]);
  const [smallParkData, setSmallParkData] = useState([]);
  const [loadingParkData, setLoadingParkData] = useState(false)

  const toggleStats = async (park) => {
    try {
      setShowStats(true);
      setShowCheckIn(false);
      setLivePark(park);
      setShowDogStats(false);
      setShowChat(false);
      setShowCalendar(false);
      setShowCheckOut(false);
      setShowHistoricalDogParks(false)
      setShowAddDog(false);
      setShowRemoveDog(false)
      setShowEditDog(false)

      setLoadingParkData(true)

      // Make a call to update park stats
      const response = await fetch('http://localhost:3029/updateParkStats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parkName: park,
          newStats: {
            // Include the new stats structure here
            // Modify based on your schema
            // Example: newStatField: 'new value',
          },
          // Include other fields as needed
        }),
      });

      if (!response.ok) {
        console.error('Failed to update park stats:', response.statusText);
        // Handle the error here if needed
      } else {
        const data = await response.json();
        console.log(data.activeDogsBigPark)
        // Update the state with the received data
        setBigParkData(data.activeDogsBigPark);
        setSmallParkData(data.activeDogsSmallPark);
        console.log(bigParkData)
      }
    } catch (error) {
      console.error('Error during toggleStats:', error);
      // Handle the error here if needed
    } finally {
      setLoadingParkData(false)
    }
  };




  const [livePark, setLivePark] = useState('')

  const [showCheckIn, setShowCheckIn] = useState(false);

  const toggleCheckIn = (park) => {
    setShowCheckIn(true);
    setLivePark(park)
    setShowDogStats(false);
    setShowStats(false)
    setShowChat(false)
    setShowCalendar(false)
    setShowCheckOut(false)
    setShowHistoricalDogParks(false)
    setShowAddDog(false);
    setShowRemoveDog(false)
    setShowEditDog(false)

  };

  const [showCheckOut, setShowCheckOut] = useState(false);

  const toggleCheckOut = (park) => {
    setShowCheckOut(true)
    setShowCheckIn(false);
    setShowDogStats(false);
    setShowStats(false)
    setShowChat(false)
    setShowCalendar(false)
    setShowHistoricalDogParks(false)
    setShowAddDog(false);
    setShowRemoveDog(false)
    setShowEditDog(false)

    //run
  };

  const toggleHistory = async () => {
    try {
      setShowHistoricalDogParks(true)
      setShowStats(false);
      setShowCheckIn(false);
      setShowDogStats(false);
      setShowChat(false);
      setShowCalendar(false);
      setShowCheckOut(false);
      setShowAddDog(false);
      setShowRemoveDog(false)
      setShowEditDog(false)

      getUserHistory(username)

    } catch (error) {
      console.error('Error during toggleStats:', error);
      // Handle the error here if needed
    }
  };

  const [showCalendar, setShowCalendar] = useState(false);

  const toggleCalendar = (park) => {
    setShowCalendar(park)
    setShowHistoricalDogParks(false)
    setShowCheckOut(false)
    setShowChat(false)
    setShowCheckIn(false);
    setLivePark(park)
    setShowDogStats(false);
    setShowStats(false)
    setShowAddDog(false);
    setShowRemoveDog(false)
    setShowEditDog(false)

  };

  const [showChat, setShowChat] = useState(false);

  const toggleChat = (park) => {
    setShowChat(true)
    setShowHistoricalDogParks(false)
    setShowCalendar(false)
    setShowCheckOut(false)
    setShowCheckIn(false);
    setLivePark(park)
    setShowDogStats(false);
    setShowStats(false)
    setShowAddDog(false);
    setShowRemoveDog(false)
    setShowEditDog(false)

  };
  const [previousDogName, setPreviousDogName] = useState('')

  const [showEditDog, setShowEditDog] = useState(false);
  const toggleDogEdit = (dog) => {
      setPreviousDogName(dog.dogName)
      setShowEditDog(true)
      setShowDogStats(false);
      setShowHistoricalDogParks(false)
      setShowChat(false)
      setLivePark(null)
      setShowCalendar(false)
      setShowCheckOut(false)
      setShowCheckIn(false);
      setShowStats(false)
      setShowAddDog(false);
      setShowRemoveDog(false)

  }

  const [selectedDog, setSelectedDog] = useState([])
  const [showRemoveDog, setShowRemoveDog] = useState(false);
  const toggleDogRemove = (dog) => {
      setSelectedDog(dog)
      setShowRemoveDog(true)
      setShowEditDog(false)
      setShowDogStats(false);
      setShowHistoricalDogParks(false)
      setShowChat(false)
      setLivePark(null)
      setShowCalendar(false)
      setShowCheckOut(false)
      setShowCheckIn(false);
      setShowStats(false)
      setShowAddDog(false);
  }

  const [showDogStats, setShowDogStats] = useState(false);

  const toggleDogStats = () => {
    if (
      !showChat &&
      livePark === null &&
      !showCalendar &&
      !showCheckOut &&
      !showCheckIn &&
      !showHistoricalDogParks &&
      !showAddDog &&
      !showEditDog &&
      !showStats
    ) {
      setShowDogStats((prevShowDogStats) => !prevShowDogStats);
    } else {
      setShowDogStats((prevShowDogStats) => !prevShowDogStats);

      setShowHistoricalDogParks(false)
      setShowChat(false)
      setLivePark(null)
      setShowCalendar(false)
      setShowCheckOut(false)
      setShowCheckIn(false);
      setShowStats(false)
      setShowAddDog(false);
      setShowRemoveDog(false)
      setShowEditDog(false)
    }
  };


  const [selectedMenu, setSelectedMenu] = useState('breeds');

  const handleMenuClick = (menu: string) => {
    setSelectedMenu(menu);
  };

  const [mapConfig, setMapConfig] = useState<MapConfig>(MAP_CONFIGS[0]);


  const [userSignedIn, setUserSignedIn] = useState(false);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loadingSignIn, setLoadingSignIn] = useState(false)
  const[ssnToken, setssnToken] = useState('')
  const handleSignIn = async (username: string, password: string) => {
    try {
      setLoadingSignIn(true)
      const response = await fetch('http://localhost:3029/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        setssnToken(data.ssnToken)
        // Set the username in the state if available in the response
        if (data.username) {
          setUsername(data.username);
        }

        setUserSignedIn(true);
      } else {
        console.error('Sign-in failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
    } finally {
      setLoadingSignIn(false)


    }
  };


  const handleSignUp = async (username: string, email: string, password: string, dogData: Dog) => {
  try {
    const requestBody = {
      username: username,
      email: email, // Include email in the request body
      password: password,
      dogName: dogData.name,
      breed: dogData.breed,
      size: dogData.size,
      energy: dogData.energy,
      age: dogData.age.toString(),
    };

    if (dogImage) {
      const base64Image = await convertImageToBase64(dogData.image);
      requestBody.dogImage = base64Image;
    }

    const response = await fetch('http://localhost:3029/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        setUserSignedIn(true);
        setUsername(username); // Set the username in the state
      } else {
        console.error('Sign-up failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
    }
};

// Frontend (React) Code

  const handleForgotPassword = async (username: string, email: string) => {
  try {
    const requestBody = {
      username: username,
      email: email,
    };
    console.log(requestBody.email)

    const response = await fetch('http://localhost:3029/forgotpassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data.message);
      // Handle success (e.g., display a success message to the user)
    } else {
      console.error('Forgot password failed:', response.statusText);
      // Handle failure (e.g., display an error message to the user)
    }
  } catch (error) {
    console.error('Error during forgot password:', error);
  }
  };


  const handleAddDog = (newDogs: Dog[]) => {
    setDogs((prevDogs) => [...prevDogs, ...newDogs]);
  };


  // const [infowindowOpen, setInfowindowOpen] = useState(false);
  //
  // const toggleWindow = () => {
  //   setInfowindowOpen(!infowindow)
  // };



   type UserDogsResponse = {
     userDogs: Dog[];
   };

   const [userDogsLoading, setUserDogsLoading] = useState(false)
   // Function to fetch user's dogs
 const fetchUserDogs = async (username: string) => {
   try {
     setUserDogsLoading(true)
     console.log(username)
     const response = await fetch(`http://localhost:3029/userdogs?username=${username}`, {
       method: 'GET',
       headers: {
         'Content-Type': 'application/json',
       },
       // Include any necessary authentication headers, such as tokens
     });

     if (response.ok) {
       console.log(response)
       const data: UserDogsResponse = await response.json();
       console.log('userdogs')
       console.log(data.userDogs)
       return data.userDogs;
     } else {
       console.error('Failed to fetch user dogs:', response.statusText);
       return [];
     }
   } catch (error) {
     console.error('Error during fetch:', error);
     return [];
   } finally {
     setUserDogsLoading(false)
   }
 };

const [loadingCheckInBig, setLoadingCheckInBig] = useState(false)
const [loadingCheckInSmall, setLoadingCheckInSmall] = useState(false)



 const checkInPark = async (dog, side) => {
   try {
     if(side==='big'){setLoadingCheckInBig(true)}else{setLoadingCheckInSmall(true)}

     const { dogName, breed, size, energy, age, dogImage } = dog;

     // Assuming 'username' is globally available
     // Replace with the actual username

     console.log(dog);

     const response = await fetch('http://localhost:3029/checkin', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         dog,
         park: 'westwoof',
         side,
         // Add other fields if needed
       }),
     });

     if (response.ok) {
       const data = await response.json();
       console.log(data.message);
       // Perform any additional actions on successful check-in
     } else {
       console.error('Check-in failed:', response.statusText);
     }
   } catch (error) {
     console.error('Error during check-in:', error);
   } finally {
     if(side==='big'){setLoadingCheckInBig(false)}else{setLoadingCheckInSmall(false)}
   }
 };

const [loadingCheckOutBig, setLoadingCheckOutBig] = useState(false)
const [loadingCheckOutSmall, setLoadingCheckOutSmall] = useState(false)

const checkOutPark = async (dog, side) => {
  try {
    console.log(dog);
    if(side==='big'){setLoadingCheckOutBig(true)}else{setLoadingCheckOutSmall(true)}
    const response = await fetch('http://localhost:3029/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dog, park: 'westwoof', side: side, user: username /* add other fields if needed */ }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data.message);
      // Perform any additional actions on successful check-out
    } else {
      console.error('Check-out failed:', response.statusText);
    }
  } catch (error) {
    console.error('Error during check-out:', error);
  } finally {
    if(side==='big'){setLoadingCheckOutBig(false)}else{setLoadingCheckOutSmall(false)}
  }
};

 const [userDogs, setUserDogs] = useState<Dog[]>([]);


 useEffect(() => {
    const fetchData = async () => {
      if (userSignedIn) {
        try {
          const dogs = await fetchUserDogs(username);
          setUserDogs(dogs);
          console.log(dogs)
        } catch (error) {
          console.error('Error fetching user dogs:', error);
        }
      }
    };

    fetchData();
  }, [userSignedIn, username]);
    // Render user dogs
    const renderUserDogs = () => {
    if (userDogs.length === 0) {
      return <div>{userDogsLoading ? <div>   <my-precious color="white"></my-precious></div> : <div>No dogs found for the user.</div>} </div>;
    }


    return (
      <div>
        <h5 style={{ textAlign: 'left', marginBottom: '20px' }}>Your Dogs:</h5>
        <ul>
          {userDogsLoading ?  <my-precious color="white"></my-precious> :
          userDogs.map((dog, index) => (
            <li key={index}>

              <img
                src={`data:image/png;base64,${dog.dogImage}`}
                alt={`Img`}
                style={{ maxWidth: '100%', height: '100px', width: '100px' }}
              />
              {dog.dogName}{' '}
              <button onClick={() => toggleDogStats()} style={{ color: 'grey' }}>
                Stats
              </button>{' '}
              <button
                style={{ color: 'grey' }}
                onClick={() => toggleDogEdit(dog)}
              >
                Edit
              </button>{' '}
              <button
                onClick={() => toggleDogRemove(dog)}
                style={{ color: 'grey' }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };




    const [historicalDogParks, setHistoricalDogParks] = useState([]);

    const [showHistoricalDogParks, setShowHistoricalDogParks] = useState(true);


    const [loadingUserHistory, setLoadingUserHistory] = useState(false)
    const getUserHistory = async (username) => {
  try {
    setLoadingUserHistory(true)
    const response = await fetch(`http://localhost:3029/dogparkhistory?username=${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      // Check if historicalDogParks is an array and not empty before updating state
      if (Array.isArray(data.historicalDogParks) && data.historicalDogParks.length > 0) {
        setHistoricalDogParks(data.historicalDogParks);
        console.log(data);
        // Perform any additional actions with the historical dog park data
      } else {
        console.log('No historical dog park data found for the user.');
        // Optionally display a message or handle the case where no data is found
      }
    } else {
      console.error('Failed to fetch user history:', response.statusText);
    }
  } catch (error) {
    console.error('Error during user history fetch:', error);
  } finally {
    setLoadingUserHistory(false)
  }
};

    useEffect(() => {
      // Call getUserHistory when the component mounts
      //const username = 'exampleUser'; // Replace with the actual username
      fetchUserDogs(username)
      getUserHistory(username);
    }, [username]); // The empty dependency array ensures the effect runs only once



    const [showAddDog, setShowAddDog] = useState(false);

      // ... (Existing event handlers)
      const [dogName, setDogName] = useState('');
      const [breed, setBreed] = useState('');
      const [size, setSize] = useState('');
      const [energy, setEnergy] = useState('');
      const [age, setAge] = useState('');
      const [dogImage, setDogImage] = useState<File | null>(null);

      const handleDogNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDogName(e.target.value);
      };

      const handleBreedChange = (e: ChangeEvent<HTMLInputElement>) => {
      setBreed(e.target.value);
      };

      const handleSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
      setSize(e.target.value);
      };

      const handleEnergyChange = (e: ChangeEvent<HTMLInputElement>) => {
      setEnergy(e.target.value);
      };

      const handleAgeChange = (e: ChangeEvent<HTMLInputElement>) => {
      setAge(e.target.value);
      };

      const handleDogImageChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        setDogImage(e.target.files[0]);
        console.log(e.target.files[0])
      }
      };


      const handleCancelAddDogClick = () => {
        setShowAddDog(false);
      };

      const toggleAddDog = () => {
        setShowAddDog(true);
        setShowDogStats(false);
        setShowHistoricalDogParks(false)
        setShowChat(false)
        setLivePark(null)
        setShowCalendar(false)
        setShowCheckOut(false)
        setShowCheckIn(false);
        setShowStats(false)
        setShowEditDog(false)
        setShowRemoveDog(false)
      }

      const handleAddDogClick = async () => {
          try {
            const requestData = {
        username,
        dogData: {
          dogName,
          breed,
          size,
          energy,
          age,
           // If dogImage is undefined, set it to null
        },
        // Add other fields if needed
      };

      if (dogImage) {
        const base64Image = await convertImageToBase64(dogImage);
        requestData.dogData.dogImage = base64Image;
      }

      console.log(requestData);

      const response = await fetch('http://localhost:3029/adddog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

        if (response.ok) {
          // Call the onAddDog callback if the dog is added successfully
          //onAddDog();
          setShowAddDog(false)
          setShowHistoricalDogParks(true)
          fetchUserDogs(username)
        } else {
          console.error('Failed to add dog:', response.statusText);
        }
      } catch (error) {
        console.error('Error during add dog request:', error);
      }
};

useEffect(() => {
   const fetchData = async () => {
     if (userSignedIn) {
       try {
         const dogs = await fetchUserDogs(username);
         setUserDogs(dogs);
       } catch (error) {
         console.error('Error fetching user dogs:', error);
       }
     }
   };

   fetchData();
 }, [showAddDog, showEditDog, showRemoveDog]);

 const handleEditDogClick = async () => {
   try {
     const requestData = {
       username,
       previousDogName,
       dogData: {
         dogName: dogName,
         breed: breed,
         size: size,
         energy: energy,
         age: age,
       },
     };

     // Convert the dogImage to base64
     if (dogImage) {
       const base64Image = await convertImageToBase64(dogImage);
       requestData.dogData.dogImage = base64Image;
     }
     console.log(requestData);

     const response = await fetch('http://localhost:3029/editdog', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(requestData),
     });

     if (response.ok) {
       // Handle success, e.g., close the edit form and update data
       setShowEditDog(false);
       setShowHistoricalDogParks(true);
       fetchUserDogs(username);
       console.log(response);
     } else {
       console.error('Failed to edit dog:', response.statusText);
     }
   } catch (error) {
     console.error('Error during edit dog request:', error);
   }
 };

 // Function to convert a file to base64
 const convertToBase64 = (file) => {
   return new Promise((resolve, reject) => {
     const reader = new FileReader();
     reader.readAsDataURL(file);
     reader.onload = () => resolve(reader.result.split(',')[1]);
     reader.onerror = (error) => reject(error);
   });
 };


  const handleRemoveDogClick = async () => {
  try {
    const requestData = {
      username,
      dogData: {
        dogName: selectedDog.dogName,
        // You may add other fields if needed
      },
    };

    const response = await fetch('http://localhost:3029/removedog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (response.ok) {
      // Handle successful removal (e.g., update UI, fetch updated dog list)
      console.log('Dog removed successfully');
      setShowRemoveDog(false);
      fetchUserDogs(username);
    } else {
      console.error('Failed to remove dog:', response.statusText);
    }
  } catch (error) {
    console.error('Error during remove dog request:', error);
  }
};

const handleSignOut =()=>{
  setUserSignedIn(false);
}


const [showSignInForm, setShowSignInForm] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(false);

  const [emailForReset, setEmailForReset] = useState('');

  const [resetPw, setResetPw] = useState(false);

   useEffect(() => {
     // Extracting query parameters from the URL
     const urlParams = new URLSearchParams(window.location.search);
     const resetPwParam = urlParams.get('resetPw');
     const emailParam = urlParams.get('email');
     console.log(emailParam)
     // Setting state based on query parameters
     setResetPw(resetPwParam === 'true');
     setEmailForReset(emailParam || '');

   }, []);



   const handleResetPassword = async (resetPassword) => {
     try {
       // Make an API call to your backend to reset the password
       const response = await fetch('http://localhost:3029/resetpassword', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           email: emailForReset,
           newPassword: resetPassword, // Use the state variable that holds the new password
         }),
       });

       if (response.ok) {
         // Password reset successful, you can handle it accordingly
         console.log('Password reset successfully');
         setResetPw(false)
       } else {
         // Handle password reset failure
         console.error('Failed to reset password:', response.statusText);
       }
     } catch (error) {
       // Handle other errors (e.g., network issues)
       console.error('Error during password reset:', error);
     }
   };

   const convertImageToBase64 = async (file) => {
  try {
    if (file.type === 'image/heic') {
      // Convert HEIC to base64 using heic2any for HEIC files
      const arrayBuffer = await file.arrayBuffer();
      const dataUrlBlob = await heic2any({ blob: new Blob([arrayBuffer]) });

      // Convert the Blob to base64
      const base64Image = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(dataUrlBlob);
      });

      return base64Image;
    } else {
      // For other image formats (e.g., PNG, JPG), use a FileReader
      const base64Image = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(file);
      });

      return base64Image;
    }
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return null;
  }
};

const [dogStats, setDogStats] = useState([])
const [dogStatsLoading, setDogStatsLoading] = useState(true);

const fetchDogStats = async () => {
  try {
    setDogStatsLoading(true); // Set dogStatsLoading to true when starting the fetch

    const response = await fetch(`http://localhost:3029/dogStats?username=${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data.dogStats);
      setDogStats(data.dogStats);
    } else {
      console.error('Failed to fetch dog stats:', response.statusText);
    }
  } catch (error) {
    console.error('Error during fetch:', error);
  } finally {
    setDogStatsLoading(false); // Set dogStatsLoading to false when fetch is complete (success or failure)
  }
};


useEffect(() => {
  fetchDogStats();
}, [showDogStats]); // Fetch dog stats when the component mounts

const [showUserProfile, setShowUserProfile] = useState(false)

const handleUserProfileOn = () => {
  setShowUserProfile(true)
}

const handleUserProfileOff = () => {
  setShowUserProfile(false)
}

const [loadingUserProfile, setLoadingUserProfile] = useState(false)
const [loadingUpdateProfile, setLoadingUpdateProfile] = useState(false)
// Function to fetch user profile data
const getUserProfile = async () => {
  try {
    setLoadingUserProfile(true);
    console.log(username)
    const response = await fetch(`http://localhost:3029/userprofile?username=${username}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Include any necessary authentication headers, such as tokens
    },
  });

    if (response.ok) {
      const data = await response.json();
      console.log(data)
      return data.userProfile;
    } else {
      console.error('Failed to fetch user profile:', response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error during fetch:', error);
    return null;
  } finally {
    setLoadingUserProfile(false);
  }
};


// Function to update user profile data
const updateUserProfile = async (updatedData: UserProfileData, ssnToken: string) => {
  try {
    setLoadingUpdateProfile(true);

    const response = await fetch('http://localhost:3029/updateuserprofile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Include any necessary authentication headers, such as tokens
        'Authorization': `Bearer ${ssnToken}`, // Assuming a Bearer token for authentication
      },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      console.log('User profile updated successfully');
    } else {
      console.error('Failed to update user profile:', response.statusText);
    }
  } catch (error) {
    console.error('Error during update:', error);
  } finally {
    setLoadingUpdateProfile(false);
  }
};



return (

  <div style={{ width: '90%', height: '300px', margin: '0 auto' }}>
  {userSignedIn ? (
    <>
    <h2 style={{ textAlign: 'left', marginBottom: '0px' }}>Bark It </h2>
    <h4 style={{ textAlign: 'right', marginBottom: '00px' }}>{username}</h4>
    {renderUserDogs()}
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
    <div
      style={{ cursor: 'pointer', textDecoration: selectedMenu === 'breeds' ? 'underline' : 'none' }}
      onClick={() => handleMenuClick('share')}
    >
      Share
    </div>
    <div
      style={{ cursor: 'pointer', textDecoration: selectedMenu === 'sizes' ? 'underline' : 'none' }}
      onClick={() => toggleAddDog()}
    >
      Add Dog
    </div>

    <div
      style={{ cursor: 'pointer', textDecoration: selectedMenu === 'sizes' ? 'underline' : 'none' }}
      onClick={() => toggleHistory()}
    >
      History
    </div>



    <div
      style={{ cursor: 'pointer', textDecoration: selectedMenu === 'energy' ? 'underline' : 'none' }}
      onClick={() => handleUserProfileOn()}
    >
    Profile


    </div>
  </div>

    <APIProvider apiKey={API_KEY}>
      <Map
      mapId={'caa20c8067d8c74b'}
      center={{ lat: 34.054, lng: -118.4465 }}
      zoom={11}
      gestureHandling={'greedy'}
      disableDefaultUI={true}
        >
        <Markers points={trees} />
        <MarkerWithInfowindow parkname={livePark} bigParkData={bigParkData} smallParkData={smallParkData}   toggleStats={toggleStats} toggleCheckIn={toggleCheckIn} toggleCalendar={toggleCalendar} toggleCheckOut={toggleCheckOut} toggleChat={toggleChat}/>
      </Map>
    </APIProvider>



    {showStats && (
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
          <div
            style={{ cursor: 'pointer', textDecoration: selectedMenu === 'breeds' ? 'underline' : 'none' }}
            onClick={() => handleMenuClick('na')}
          >
            Active Dogs: {livePark}
          </div>
        </div>

        {/* loading park data */}
        {loadingParkData ? <div>  <my-precious color="white"></my-precious></div> :   <RosterTable bigParkData={bigParkData} smallParkData={smallParkData} />}

        {/* Your Stats Content Here */}
        {/* Content based on selected menu */}
      </div>
    )}

    {showEditDog && (
      <form>
        <h2>Edit Dog</h2>
        <label>
          Dog Name:
          <input type="text" value={dogName} onChange={handleDogNameChange} style={{ width: '100%' }} />
        </label>
        <br />
        <label>
          Breed:
          <input type="text" value={breed} onChange={handleBreedChange} style={{ width: '100%' }} />
        </label>
        <br />
        <label>
          Size:
          <input type="text" value={size} onChange={handleSizeChange} style={{ width: '100%' }} />
        </label>
        <br />
        <label>
          Energy:
          <input type="text" value={energy} onChange={handleEnergyChange} style={{ width: '100%' }} />
        </label>
        <br />
        <label>
          Age:
          <input type="text" value={age} onChange={handleAgeChange} style={{ width: '100%' }} />
        </label>
        <br />
        <label>
    Dog Image:
    <input
      type="file"
      accept="image/*,video/quicktime,image/heic"
      onChange={handleDogImageChange}
      style={{ width: '100%' }}
    />

  </label>
        <br />
        <button type="button" onClick={()=>handleEditDogClick()}>
          Edit Dog
        </button>
      </form>
    )}

    {showRemoveDog && (
      <div>
        <h2>Remove Dog</h2>
        <p>Are you sure you want to remove {selectedDog.dogName}?</p>
        <button type="button" onClick={()=>handleRemoveDogClick()}>
          Remove Dog
        </button>

      </div>
    )}

    {showUserProfile && (
      <UserProfile ssnToken={ssnToken} username={username} handleSignOut={handleSignOut} handleUserProfileOff={handleUserProfileOff} getUserProfile={getUserProfile} updateUserProfile={updateUserProfile} />
    )}

    {showCalendar && (
      <DogParkCalendar />
    )}

    {showChat &&(
       <Chat dogParkName={livePark} username={username} />
     )}

     {showHistoricalDogParks && (
       <div style={{ overflowY: 'auto', maxHeight: '300px' }}>
         {loadingUserHistory ? (
           <div>
             <my-precious color="white"></my-precious>
           </div>
         ) : (
           historicalDogParks.map((park, index) => (
             <div key={index} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '10px', margin: '10px', textAlign: 'left' }}>
               <h3>{username}'s History:</h3>
               <p>Timestamp: {park.timestamp}</p>
               <p>Check-in Event:</p>
               {park.events.map((event, eventIndex) => (
                 <div key={eventIndex}>
                   {event.checkin && (
                     <>
                       <p>Dog Name: {event.dogName}</p>
                       <p>Park Name: {event.parkname}</p>
                       <p>Check-in Timestamp: {event.timestamp}</p>
                       {/* Add other details from the check-in event */}
                     </>
                   )}
                 </div>
               ))}
               {/* Additional rendering for other events like check-out can be added similarly */}
             </div>
           ))
         )}
       </div>
     )}


  {showAddDog && (<div>
      <h2>Add Dog</h2>
      <label>
        Dog Name:
        <input type="text" value={dogName} onChange={handleDogNameChange} style={{ width: '100%' }} />
      </label>
      <br />
      <label>
        Breed:
        <input type="text" value={breed} onChange={handleBreedChange} style={{ width: '100%' }} />
      </label>
      <br />
      <label>
        Size:
        <input type="text" value={size} onChange={handleSizeChange} style={{ width: '100%' }} />
      </label>
      <br />
      <label>
        Energy:
        <input type="text" value={energy} onChange={handleEnergyChange} style={{ width: '100%' }} />
      </label>
      <br />
      <label>
        Age:
        <input type="text" value={age} onChange={handleAgeChange} style={{ width: '100%' }} />
      </label>
      <br />
      <label>
        Dog Image:
        <input type="file" accept="image/*,video/quicktime,image/heic" onChange={handleDogImageChange} style={{ width: '100%' }} />
      </label>
      <br />
      <button type="button" onClick={()=>handleAddDogClick()}>Add Dog</button>
    </div>
      )}

      {showCheckIn && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div
          style={{ cursor: 'pointer', textDecoration: selectedMenu === 'breeds' ? 'underline' : 'none' }}
          onClick={() => handleMenuClick('na')}
        >
        {userDogs.map((dog, index) => (
          <div key={index} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '10px', margin: '10px', textAlign: 'left' }}>
            {console.log(dog)}
            <h3>{dog.dogName}'s Check In: <div style={{ marginTop: '20px', textAlign: 'left' }} onClick={() => checkInPark(dog, 'big')}>Big Park</div>
            <div
              style={{
                opacity: loadingCheckInBig ? 1 : 0,
                transition: 'opacity 1s ease-in-out',
              }}
            >
              {loadingCheckInBig ? 'Checking in...' : 'Done'}
            </div>
            <div style={{ marginTop: '20px', textAlign: 'left' }} onClick={() => checkInPark(dog, 'small')}>Small Park</div></h3>
            <div
              style={{
                opacity: loadingCheckInSmall ? 1 : 0,
                transition: 'opacity 1s ease-in-out',
              }}
            >
              {loadingCheckInSmall ? 'Checking in...' : 'Done'}
            </div>
          </div>
        ))}

        </div>

      </div>

          {/* Your Stats Content Here */}


        {/* Content based on selected menu */}

        </div>
      )}

      {showCheckOut && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div
          style={{ cursor: 'pointer', textDecoration: selectedMenu === 'breeds' ? 'underline' : 'none' }}
          onClick={() => handleMenuClick('na')}
        >
        {userDogs.map((dog, index) => (
          <div key={index} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '10px', margin: '10px', textAlign: 'left' }}>
            <h3>{dog.dogName}'s Check Out: <div style={{ marginTop: '20px', textAlign: 'left' }} onClick={() => checkOutPark(dog, 'big')}>Big Park</div>
            <div
              style={{
                opacity: loadingCheckOutBig ? 1 : 0,
                transition: 'opacity 1s ease-in-out',
              }}
            >
              {loadingCheckOutBig ? 'Checking out...' : 'Done'}
            </div>
            <div style={{ marginTop: '20px', textAlign: 'left' }} onClick={() => checkOutPark(dog, 'small')}>Small Park</div></h3>
            <div
              style={{
                opacity: loadingCheckOutSmall
                 ? 1 : 0,
                transition: 'opacity 1s ease-in-out',
              }}
            >
              {loadingCheckOutSmall ? 'Checking out...' : 'Done'}
            </div>

          </div>
        ))}

        </div>

      </div>



        {/* Content based on selected menu */}

        </div>
      )}




            {showDogStats && (
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
             {userDogs.map((dog, index) => (
               <div key={index} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '10px', margin: '10px', textAlign: 'left' }}>
                 <h3>{dog.dogName}'s Park Stats</h3>
                 <ul style={{ listStyle: 'none', padding: 0 }}>
                   <li><strong>Time at Park This Week:</strong> <div style={{ marginLeft: '10px', display: 'inline-block' }}>
                  {dogStatsLoading ? (
                    <div>  <my-precious color="white"></my-precious></div>
                  ) : (
                    <>
                   {dogStats.weeklyTime || 'N/A'}
                    </>
                  )} hours</div></li>
                                 <li><strong>All Time at Park:</strong> <div style={{ marginLeft: '10px', display: 'inline-block' }}>
                                  {dogStatsLoading ? (
                     <div>  <my-precious color="white"></my-precious></div>
                   ) : (
                     <>
                   {dogStats.totalTime || 'N/A'}
                     </>
                   )} hours</div></li>
                   <li><strong>Park Breakdown</strong></li>
                   <li><strong>Energy:</strong> {dog.energy}</li>
                   <li><strong>Size:</strong> {dog.size}</li>
                   <li><strong>Breed:</strong> {dog.breed}</li>
                   <li><strong>Age:</strong> {dog.age} yrs</li>
                 </ul>
               </div>
             ))}
           </div>

            </div>

                {/* Your Stats Content Here */}


              {/* Content based on selected menu */}

              </div>
            )}

      </>
    ):(
      <>
        <h2 style={{ textAlign: 'left', marginBottom: '0px' }}> Bark It </h2>
        <h4 style={{ textAlign: 'left', marginBottom: '0px' }}> Welcome to Bark It</h4>
        <h4 style={{ textAlign: 'left', marginBottom: '0px' }}> YikYak meets Surfline for dog parks.</h4>

        {resetPw ? (
                  <div>
                     <PasswordResetForm
                       email={emailForReset}
                       onResetPassword={handleResetPassword}
                     />
                     <button onClick={() => setResetPw(false)}>Back</button>
                  </div>

                   ) : (
        <>
        <div style={{ marginBottom: '20px' }}>
               <button onClick={() => {
            setShowSignInForm(true);
            setShowSignUpForm(false); // Set SignUpForm to false when SignInForm is clicked
          }}>Sign In</button>
               <button onClick={() => {
            setShowSignUpForm(true);
            setShowSignInForm(false); // Set SignInForm to false when SignUpForm is clicked
          }}>Sign Up</button>
             </div>
             {showSignInForm && (
               <SignInForm onSignIn={handleSignIn} onForgotPassword={handleForgotPassword} loadingSignIn={loadingSignIn} />
             )}
             {showSignUpForm && (
               <SignUpForm onSignUp={handleSignUp} />
             )}
      </>
    )}
      </>
    )}
  </div>
)};


type Point = google.maps.LatLngLiteral & { key: string };
type Props = { points: Point[] };

type Dog = {
  name: string;
  breed: string;
  size: string;
  energy: string;
  age: number;
  image: File | null;
};

const Markers: React.FC<Props> = ({ points }) => {
  const map = useMap();
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  const clusterer = useRef<MarkerClusterer | null>(null);

  // Initialize MarkerClusterer
  // useEffect(() => {
  //   if (!map) return;
  //   if (!clusterer.current) {
  //     clusterer.current = new MarkerClusterer({ map });
  //   }
  // }, [map]);

  // Update markers
  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker: Marker | null, key: string) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers((prev) => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  return (
    <>
      {points.map((point) => (
        <AdvancedMarker
          position={point}
          key={point.key}
          ref={(marker) => setMarkerRef(marker, point.key)}
        >
          <span className="tree">🐶</span>
        </AdvancedMarker>
      ))}
    </>
  );
};

const RosterTable: React.FC<{ bigParkData: Dog[], smallParkData: Dog[] }> = ({ bigParkData, smallParkData }) => {
  console.log('Received bigParkData:', bigParkData);
  console.log('Received smallParkData:', smallParkData);


  return (
    <div style={{ overflowX: 'auto' }}>
    <div style={{ marginTop: '5px', textAlign: 'left', fontSize: '1.2em' }}>Big Park</div>

      <table style={{ width: '90%', overflowX: 'auto' }}>
        <thead>
          <tr>
            <th style={{ padding: '5px' }}>Dog</th>
            <th style={{ padding: '5px' }}>Pic</th>
            <th style={{ padding: '5px' }}>Breed</th>
            <th style={{ padding: '5px' }}>Size</th>
            <th style={{ padding: '5px' }}>Energy</th>
            <th style={{ padding: '5px' }}>Until</th>
            <th style={{ padding: '5px' }}>Age</th>
          </tr>
        </thead>
        <tbody>
          {/* Render rows based on bigParkData and smallParkData */}
          {/* Example: */}
          {bigParkData.map((item) => (
            <tr key={item.dog.id}>
            {console.log(item.dog)}
              <td>{item.dog.name}</td>
              <td><img
                src={`data:image/png;base64,${item.dog.imageUrl}`}
                alt={`Img`}
                style={{ maxWidth: '100%', height: '50px', width: '50px' }}
              /></td>
              <td>{item.dog.breed}</td>
              <td>{item.dog.size}</td>
              <td>{item.dog.energy}</td>
              <td>{item.checkinExpiration}</td>
              <td>{item.dog.age}</td>
            </tr>
          ))}
          {/* Repeat for smallParkData */}
        </tbody>
      </table>
      <div style={{ marginTop: '20px', textAlign: 'left', fontSize: '1.2em' }}>Small Park</div>
      <table style={{ width: '90%', overflowX: 'auto' }}>
        <thead>
          <tr>
            <th style={{ padding: '5px' }}>Dog</th>
            <th style={{ padding: '5px' }}>Pic</th>
            <th style={{ padding: '5px' }}>Breed</th>
            <th style={{ padding: '5px' }}>Size</th>
            <th style={{ padding: '5px' }}>Energy</th>
            <th style={{ padding: '5px' }}>Until</th>
            <th style={{ padding: '5px' }}>Age</th>
          </tr>
        </thead>
        <tbody>
          {/* Render rows based on bigParkData and smallParkData */}
          {/* Example: */}
          {smallParkData.map((item) => (
            <tr key={item.dog.id}>
              <td>{item.dog.name}</td>
              <td><img
                src={`data:image/png;base64,${item.dog.imageUrl}`}
                alt={`Img`}
                style={{ maxWidth: '100%', height: '100px', width: '100px' }}
              /></td>
              <td>{item.dog.breed}</td>
              <td>{item.dog.size}</td>
              <td>{item.dog.energy}</td>
              <td>{item.checkinExpiration}</td>
              <td>{item.dog.age}</td>
            </tr>
          ))}
          {/* Repeat for smallParkData */}
        </tbody>
      </table>
    </div>
  );
};




const BreedsTable: React.FC = () => (
  <table>
    <thead>
      <tr>
        <th>Breed</th>
        <th>Information</th>
      </tr>
    </thead>
    <tbody>
      {/* Add rows with breed information */}
      <tr>
        <td>Breed 1</td>
        <td>Information about Breed 1</td>
      </tr>
      <tr>
        <td>Breed 2</td>
        <td>Information about Breed 2</td>
      </tr>
      {/* ... Add more rows as needed */}
    </tbody>
  </table>
);

const SizesTable: React.FC = () => (
  <table>
    {/* Similar structure to BreedsTable */}
</table>
);

const EnergyTable: React.FC = () => (
  <table>
    {/* Similar structure to BreedsTable */}
</table>
);

export default App;

export function renderToDom(container: HTMLElement) {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// <tbody>
//   {userDogs.map((dog, index) => (
//     <tr key={index}>
//       <td style={{ padding: '5px' }}>{dog.name}</td>
//       <td style={{ padding: '5px' }}>{dog.image && <img src={URL.createObjectURL(dog.image)} alt="Dog" />}</td>
//       <td style={{ padding: '5px' }}>{dog.breed}</td>
//       <td style={{ padding: '5px' }}>{dog.size}</td>
//       <td style={{ padding: '5px' }}>{dog.energy}</td>
//       <td style={{ padding: '5px' }}>Open</td>
//       <td style={{ padding: '5px' }}>{dog.age} yrs</td>
//     </tr>
//   ))}
// </tbody>
