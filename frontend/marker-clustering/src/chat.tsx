import React, { useState, useEffect, useRef } from 'react';

interface Message {
  user: string;
  message: string;
}

interface ChatProps {
  dogParkName: string;
}

const Chat: React.FC<ChatProps> = ({ dogParkName }) => {
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  // Dummy function to simulate receiving new chat messages
  const receiveMessage = (message: Message) => {
    setChatMessages((prevMessages) => [...prevMessages, message]);
  };

  // Dummy function to simulate sending a chat message
  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      // You can replace this with actual logic to send messages to the server
      receiveMessage({ user: 'User', message: newMessage });
      setNewMessage('');
    }
  };

  // Dummy useEffect to simulate receiving new messages
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate receiving a new message every 5 seconds
      receiveMessage({ user: 'OtherUser', message: 'Hello!' });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const chatRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom of the chat when new messages arrive
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <div>
      {/* Upper Section: Display Chat Messages */}
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
          </div>
        ))}
      </div>

      {/* Lower Section: Type and Submit Message */}
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
