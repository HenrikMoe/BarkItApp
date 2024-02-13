import React, { useState, useEffect, useRef } from 'react';
import { ring } from 'ldrs'
ring.register('my-precious')

interface Message {
  user: string;
  message: string;
  timestamp: string;
}

interface UserProfileData {
  username: string;
  verified: boolean;
  fullName: string;
  rating: number;
  dms: number;
  calendar: number;
  profilePhoto: string;
}

interface ChatProps {
  dogParkName: string;
  username: string;
  openUser: (user: string) => Promise<UserProfileData>;
}

interface TabsProps {
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const Tabs: React.FC<TabsProps> = ({ setActiveTab }) => (
  <div style={{ marginBottom: '10px' }}>
    <button onClick={() => setActiveTab('park')}>Park Chat</button>
    <button onClick={() => setActiveTab('dm')}>DMs</button>
  </div>
);

const Chat: React.FC<ChatProps> = ({ dogParkName, username, openUser }) => {
  const [parkChatMessages, setParkChatMessages] = useState<Message[]>([]);
  const [dmChatMessages, setDMChatMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('park');
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [userSelected, setUserSelected] = useState('');
  const [dmUsers, setDMUsers] = useState<string[]>([]);
  const [selectedDMUser, setSelectedDMUser] = useState<string>(''); // Track the selected user for DM

  const receiveMessage = (message: Message) => {
    setParkChatMessages((prevMessages) => [...prevMessages, message]);
  };



  const sendMessage = async () => {
    if (newMessage.trim() !== '') {
      receiveMessage({ user: selectedDMUser, message: newMessage, timestamp: new Date().toISOString() });

      try {
        const targetEndpoint = activeTab === 'park' ? `sendmessage/${dogParkName}` : `dms/${username}`;
        await fetch(`http://localhost:3029/${targetEndpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user: selectedDMUser, message: newMessage }),
        });
      } catch (error) {
        console.error('Error sending message:', error);
      }

      setNewMessage('');
    }
  };

const [loadingChat, setLoadingChat] = useState(true)



  useEffect(() => {
    const chatRequestInterval = setInterval(async () => {
      try {
        const targetEndpoint = activeTab === 'park' ? `chat/${dogParkName}` : `dms/${username}`;
        const response = await fetch(`http://localhost:3029/${targetEndpoint}`);
        if (response.ok) {
          const data = await response.json();
          if(activeTab === 'park'){
            setParkChatMessages(data.messages);
          }else{
            console.log(selectedDMUser)
            console.log(data.messages)
            setDMChatMessages(data.messages.filter(message => message.user === selectedDMUser));
          }
        } else {
          console.error('Failed to fetch chat:', response.statusText);
        }
      } catch (error) {
        console.error('Error during chat request:', error);
      } finally {
        if(parkChatMessages){
          setLoadingChat(false)
        }
      }
    }, 1000);

    return () => clearInterval(chatRequestInterval);
  }, [dogParkName, username, activeTab, selectedDMUser]);

  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [parkChatMessages, dmChatMessages]);

  const [loadingUserProfile, setLoadingUserProfile] = useState<boolean>(false)

  const fetchUserProfile = async (user: string) => {
    try {
      setLoadingUserProfile(true)
      const userProfileData = await openUser(user);
      setUserData(userProfileData);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoadingUserProfile(false)
    }
  };

  const handleUserSelected = (user: string) => {
    setUserSelected(user);
    fetchUserProfile(user);
  };

  const handleUserDataOff = () => {
    setUserData(null);
  };

  const handleParkChatTabClick = () => {
  setActiveTab('park');
  setUserSelected('');
};

const handleDMChatTabClick = (user) => {
  setActiveTab('dm');
  setSelectedDMUser(user.username);
  setUserData('')

};


const fetchDMUsers = async () => {
  try {
    const response = await fetch(`http://localhost:3029/dmusers/${username}`);
    if (response.ok) {
      const data = await response.json();
      setDMUsers(data.users);
    } else {
      console.error('Failed to fetch DM users:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching DM users:', error);
  }
};
useEffect(() => {
  // Fetch the list of DM users when the component mounts
  fetchDMUsers();

  // ... rest of your code
}, [!selectedDMUser]);

const handleBackToDMList = ()=>{
  setSelectedDMUser('')
}

const [searchQuery, setSearchQuery] = useState<string>('');
const [searchingUsers, setSearchingUsers] = useState<string>('');

const fetchDMUsersBySearch = async (searchQuery) => {
  try {
    const response = await fetch(`http://localhost:3029/users/search/${searchQuery}`);
    if (response.ok) {
      const data = await response.json();
      setSearchingUsers(data.users);
    } else {
      console.error('Failed to fetch DM users:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching DM users:', error);
  }
};

useEffect(() => {
  // Fetch the list of DM users when the component mounts
  fetchDMUsersBySearch(searchQuery);

  // ... rest of your code
}, [searchQuery]);

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
      <button onClick={handleParkChatTabClick}>Park Chat</button>
      <button onClick={handleDMChatTabClick}>DMs</button>
    </div>
    {userData && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}
            >
              <div style={{ backgroundColor: 'rgba(0, 0, 50, 0.5)', padding: '20px', borderRadius: '8px', maxWidth: '600px', width: '100%' }}>
                <div>
                  <h2>User Profile</h2>
                  <>
                    <img src={userData.profilePhoto} alt="Profile" style={{ maxWidth: '100px' }} />
                    <p>Username: {userData.username}</p>
                    <p>Verified: {userData.verified ? 'Yes' : 'No'}</p>
                    <p>Full Name: {userData.fullName}</p>
                    <p>Rating: {userData.rating}</p>
                    <p onClick={()=>handleDMChatTabClick(userData)}>DM </p>
                    <p>Calendar: {userData.calendar}</p>
                    <p onClick={handleUserDataOff}> Exit </p>
                  </>
                </div>
              </div>
            </div>
          )}

          {loadingUserProfile && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}
            >
              <div style={{ backgroundColor: 'rgba(0, 0, 50, 0.5)', padding: '20px', borderRadius: '8px', maxWidth: '600px', width: '100%' }}>
                <div>
                  <>
                    <p>Loading user profile...</p>
                  </>
                </div>
              </div>
            </div>
          )}

          {loadingChat ? <div>  <my-precious color="white"></my-precious></div> : <div>

          {activeTab === 'park' && (
            <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
            <h3>Park Chat Messages {dogParkName}</h3>
            <div ref={chatRef} style={{ height: '200px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
              {parkChatMessages.map((message, index) => (
                <div key={index}>
                  <strong onClick={() => handleUserSelected(message.user)}>{message.user}:</strong> {message.message}
                  <div style={{ fontSize: '10px', color: '#888' }}>{new Date(message.timestamp).toLocaleString()}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '10px' }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                style={{ width: '80%', marginRight: '5px' }}
                placeholder={`Type your message to ${dogParkName}...`}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
            </div>
          )}

          {activeTab === 'dm' && (
  <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
    {selectedDMUser ? (
      // If a user is selected, show the conversation
      <>
        <h3>Direct Messages with {selectedDMUser} <button onClick={()=>handleBackToDMList()}>Back</button></h3>
        <div ref={chatRef} style={{ height: '100px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
          {dmChatMessages.map((message, index) => (
            <div key={index}>
              <strong>{message.user}:</strong> {message.message}
              <div style={{ fontSize: '10px', color: '#888' }}>{new Date(message.timestamp).toLocaleString()}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '10px' }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            style={{ width: '80%', marginRight: '5px' }}
            placeholder={`Type your message to ${selectedDMUser}...`}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </>
    ) : (
      // If no user is selected, show the list of DM users
      <>
        <h3>Your Direct Message Conversations </h3>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '80%', marginBottom: '5px' }}
          placeholder="Search DM users..."
        />
        <ul>


          {dmUsers &&
            dmUsers.map((user, index) => (
            <li key={index} onClick={() => setSelectedDMUser(user)}>
              {user}
            </li>
          ))}
          {searchingUsers &&
          searchingUsers.map((user, index) => (
              <li key={index} onClick={() => setSelectedDMUser(user)}>
                {user}
              </li>
            ))}
        </ul>
      </>
    )}
    
  </div>
)}
          </div>}

    </div>
  );
};

export default Chat;
