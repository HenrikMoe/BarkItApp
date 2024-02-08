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

const Chat: React.FC<ChatProps> = ({ dogParkName, username }) => {
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
        {chatMessages.map((message, index) => (
          <div key={index}>
            <strong>{message.user}:</strong> {message.message}
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
