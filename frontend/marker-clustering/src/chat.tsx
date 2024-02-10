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

  const receiveMessage = (message: Message) => {
    setParkChatMessages((prevMessages) => [...prevMessages, message]);
  };

  const sendMessage = async () => {
    if (newMessage.trim() !== '') {
      receiveMessage({ user: username, message: newMessage, timestamp: new Date().toISOString() });

      try {
        const targetEndpoint = activeTab === 'park' ? `sendmessage/${dogParkName}` : `dms/${username}`;
        await fetch(`http://localhost:3029/${targetEndpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user: username, message: newMessage }),
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
            setDMChatMessages(data.messages);
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
  }, [dogParkName, username, activeTab]);

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

const handleDMChatTabClick = () => {
  setActiveTab('dm');
  setUserSelected('');
};

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
                    <p onClick={handleDMChatTabClick}>DM </p>
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
              <h3>Direct Messages with {userSelected}</h3>
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
                  placeholder={`Type your message to ${userSelected}...`}
                />
                <button onClick={sendMessage}>Send</button>
              </div>
            </div>
          )}
          </div>}

    </div>
  );
};

export default Chat;
