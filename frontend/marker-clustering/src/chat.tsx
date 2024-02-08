import React, { useState, useEffect, useRef } from 'react';

interface Message {
  user: string;
  message: string;
  timestamp: string;
}

interface ChatProps {
  dogParkName: string;
  username: string;
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
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('park');

  const receiveMessage = (message: Message) => {
    setChatMessages((prevMessages) => [...prevMessages, message]);
  };

  const sendMessage = async () => {
    if (newMessage.trim() !== '') {
      receiveMessage({ user: username, message: newMessage, timestamp: new Date().toISOString() });

      try {
        const targetEndpoint = activeTab === 'park' ? `chat/${dogParkName}` : `dms/${username}`;
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

  useEffect(() => {
    const chatRequestInterval = setInterval(async () => {
      try {
        const targetEndpoint = activeTab === 'park' ? `chat/${dogParkName}` : `dms/${username}`;
        const response = await fetch(`http://localhost:3029/${targetEndpoint}`);
        if (response.ok) {
          const data = await response.json();
          setChatMessages(data.messages);
        } else {
          console.error('Failed to fetch chat:', response.statusText);
        }
      } catch (error) {
        console.error('Error during chat request:', error);
      }
    }, 1000);
    

    return () => clearInterval(chatRequestInterval);
  }, [dogParkName, username, activeTab]);

  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatMessages]);

  type UserProfileData = {
    username: string;
    verified: boolean;
    fullName: string;
    rating: number;
    dms: number;
    calendar: number;
    profilePhoto: string; // URL or path to the profile photo
  };

  const [userData, setUserData] = useState<UserProfileData | null>(null);


  const fetchUserProfile = async (user: string) => {
    try {
      const userProfileData = await openUser(user);
      setUserData(userProfileData);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Handle the error if needed
    }
  };

  const [userSelected, setUserSelected] = useState('')

  const handleUserSelected  = (user: string) => {
    console.log(user)
    setUserSelected(user)
    fetchUserProfile(user);
  }

  const handleUserDataOff = () =>{
    setUserData(null)
  }

  return (
    <div>
      <Tabs setActiveTab={setActiveTab} />

      <div
        ref={chatRef}
        style={{
          height: '200px',
          overflowY: 'auto',
          border: '1px solid #ccc',
          padding: '10px',
        }}
      >
      {userData && (
         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div style={{ backgroundColor: 'rgba(0, 0, 50, 0.5)', padding: '20px', borderRadius: '8px', maxWidth: '600px', width: '100%' }}>
             <div>
               <h2>User Profile</h2>
                 <>
                   <img src={userData.profilePhoto} alt="Profile" style={{ maxWidth: '100px' }} />
                   <p>Username: {userData.username}</p>
                   <p>Verified: {userData.verified ? 'Yes' : 'No'}</p>
                   <p>Full Name: {userData.fullName}</p>
                   <p>Rating: {userData.rating}</p>
                   <p>DM: {userData.dms}</p>
                   <p>Calendar: {userData.calendar}</p>
                   <p onClick={handleUserDataOff}> Exit </p>
                 </>


               </div>
               </div>
               </div>
       )}

        {chatMessages.map((message, index) => (
          <div key={index}>
            <strong onClick={()=> handleUserSelected(message.user)}>{message.user}:</strong> {message.message}
            <div style={{ fontSize: '10px', color: '#888' }}>
              {new Date(message.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '10px' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={{ width: '80%', marginRight: '5px' }}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>

  );
};

export default Chat;
