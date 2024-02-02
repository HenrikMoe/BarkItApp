import React, { useState, useEffect, useRef } from 'react';

interface Message {
  user: string;
  message: string;
}

interface ChatProps {
  dogParkName: string;
}

const Chat: React.FC<ChatProps> = ({ dogParkName, username }) => {
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  const receiveMessage = (message: Message) => {
    setChatMessages((prevMessages) => [...prevMessages, message]);
  };

  const sendMessage = async () => {
    if (newMessage.trim() !== '') {
      receiveMessage({ user: username, message: newMessage });

      try {
        await fetch(`http://localhost:3029/sendmessage/${dogParkName}`, {
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

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     receiveMessage({ user: 'OtherUser', message: 'Hello!' });
  //   }, 5000);
  //
  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    const chatRequestInterval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:3029/chat/${dogParkName}`);
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
  }, [dogParkName]);

  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <div>
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
