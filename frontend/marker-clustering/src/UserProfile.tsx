import React, { useEffect, useState } from 'react';
import IdForm from './IdForm'

type UserProfileProps = {
  getUserProfile: () => Promise<UserProfileData>; // Function to get user profile data
  updateUserProfile: (updatedData: UserProfileData) => Promise<void>; // Function to update user profile data
};

type UserProfileData = {
  username: string;
  verified: boolean;
  fullName: string;
  rating: number;
  dms: number;
  calendar: number;
  profilePhoto: string; // URL or path to the profile photo
};

const UserProfile: React.FC<UserProfileProps> = ({ ssnToken, getUserProfile, updateUserProfile, handleSignOut, handleUserProfileOff, username }) => {
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState<UserProfileData | null>(null);
  const [newProfilePhoto, setNewProfilePhoto] = useState<File | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfileData = await getUserProfile();
        setUserData(userProfileData);
        setEditedData(userProfileData);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Handle the error if needed
      }
    };

    fetchUserProfile();
  }, []);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedData(userData);
  };

  const handleSaveEdit = async () => {
    if (editedData) {
      try {
        if (newProfilePhoto) {
          // Handle profile photo upload
          // You may want to use a dedicated function or API endpoint for photo uploads
          // and update the editedData.profilePhoto accordingly
          console.log('Uploading new profile photo:', newProfilePhoto);
        }

        await updateUserProfile(editedData, ssnToken);
        setUserData(editedData);
        setEditMode(false);
      } catch (error) {
        console.error('Error updating user profile:', error);
        // Handle the error if needed
      }
    }
  };

  console.log(editedData)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewProfilePhoto(e.target.files[0]);
    }
  };

  const [showId, setShowId] = useState(false)

  const handleIdClick = () => {
    setShowId(true)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
       <div style={{ backgroundColor: 'rgba(0, 0, 50, 0.5)', padding: '20px', borderRadius: '8px', maxWidth: '600px', width: '100%' }}>
         {userData ? (
        <div>
          <h2>User Profile</h2>
          {editMode ? (
            <>
              <label>
                Username:
                <input type="text" name="username" value={editedData?.username} onChange={handleInputChange} />
              </label>
              <br />
              <label>
                Full Name:
                <input type="text" name="fullName" value={editedData?.fullName} onChange={handleInputChange} />
              </label>
              <br />
              <label>
                Rating:
                <input type="number" name="rating" value={editedData?.rating} onChange={handleInputChange} />
              </label>
              <br />

              <br />
              <label>
                Calendar:
                <input type="number" name="calendar" value={editedData?.calendar} onChange={handleInputChange} />
              </label>
              <br />
              <label>
                Profile Photo:
                <input type="file" accept="image/jpeg,image/png,image/heic" onChange={handleProfilePhotoChange} />
              </label>
              <br />
            </>
          ) : (
            <>
              <img src={userData.profilePhoto} alt="Profile" style={{ maxWidth: '100px' }} />
              <p>Username: {userData.username}</p>
              <p>Verified: {userData.verified ? 'Yes' : <div><p>No </p> <button onClick={handleIdClick}>Verfiy</button></div>}</p>
              <p>Full Name: {userData.fullName}</p>
              <p>Rating: {userData.rating}</p>
              <p>Calendar: {userData.calendar}</p>
              <p onClick={handleSignOut}> Sign Out </p>
              <p onClick={handleUserProfileOff}> Exit </p>
            </>
          )}

          {editMode ? (
            <>
              <button onClick={handleCancelEdit}>Cancel</button>
              <button onClick={handleSaveEdit}>Save</button>
            </>
          ) : (
            <button onClick={handleEditClick}>Edit</button>
          )}
        </div>
      ) : (
        <p>Loading user profile...</p>
      )}

      {showId &&
        <IdForm />
      }

    </div>
    </div>
  );
};

export default UserProfile;
