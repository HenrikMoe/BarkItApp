import React, { useState, ChangeEvent, FormEvent } from 'react';

type SignUpFormProps = {
  onSignUp: (username: string, password: string, dogData: Dog) => void;
};

const SignUpForm: React.FC<SignUpFormProps> = ({ onSignUp }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [dogName, setDogName] = useState('');
  const [breed, setBreed] = useState('');
  const [size, setSize] = useState('');
  const [energy, setEnergy] = useState('');
  const [age, setAge] = useState('');
  const [dogImage, setDogImage] = useState<File | null>(null);
  const [email, setEmail] = useState(''); // Add email state

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

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
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();

    const dogData = {
      name: dogName,
      breed,
      size,
      energy,
      age,
      image: dogImage,
    };


     onSignUp(username, email, password, dogData);
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '12px',
    marginTop: '20px',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '16px',
  };

  // ... (Previous code)

    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ maxWidth: '600px', width: '100%', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
          {/* Dog Information Form */}
          <form onSubmit={handleFormSubmit}>
            <h2>Sign Up</h2>
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
                accept="image/*,video/quicktime"
                onChange={handleDogImageChange}
                style={{ width: '100%' }}
              />
            </label>
            <br />

            {/* Email Form */}
            <h2>Email</h2>
            <label>
              Email:
              <input type="text" value={email} onChange={handleEmailChange} style={{ width: '100%' }} />
            </label>
            <br />

          {/* Username and Password Form */}
            <h2>Username and Password</h2>
            <label>
              Username:
              <input type="text" value={username} onChange={handleUsernameChange} style={{ width: '100%' }} />
            </label>
            <br />
            <label>
              Password:
              <input type="password" value={password} onChange={handlePasswordChange} style={{ width: '100%' }} />
            </label>
            <br />
            <button type="submit" style={buttonStyle}>Sign Up</button>
          </form>
        </div>
      </div>
    );
  };

  export default SignUpForm;
