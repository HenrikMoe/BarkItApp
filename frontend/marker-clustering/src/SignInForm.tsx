// SignInForm.tsx
import React, { useState } from 'react';

type SignInFormProps = {
  onSignIn: (username: string, password: string) => void;
  onForgotPassword: (email: string, username: string) => void;
};

const SignInForm: React.FC<SignInFormProps> = ({ onSignIn, onForgotPassword }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [emailForForgotPassword, setEmailForForgotPassword] = useState('');
  const [resetPasswordVisible, setResetPasswordVisible] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    onSignIn(username, password);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    onForgotPassword(emailForForgotPassword, username);
  };

  const handleBackToSignIn = () => {
    setResetPasswordVisible(false);
    setEmailForForgotPassword('');
  };

  const formStyle: React.CSSProperties = {
    maxWidth: '300px',
    margin: '0 auto',
    marginTop: '60px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    boxSizing: 'border-box', // Ensure padding and border are included in the width
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '10px',
    fontSize: '14px',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    border: '1px solid #ccc',
    borderRadius: '3px',
    boxSizing: 'border-box', // Ensure padding and border are included in the width
    fontSize: '14px',
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '12px',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '16px',
    marginRight: '10px', // Added margin for separation
  };

  const buttonHoverStyle: React.CSSProperties = {
    backgroundColor: '#45a049',
  };

  return (
    <div>
      {resetPasswordVisible ? (
        // "Forgot Password" Form
        <form style={formStyle} onSubmit={handleForgotPassword}>
          <label style={labelStyle}>
            Username:
            <input
              type="text"
              value={username}
              style={inputStyle}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <br />
          <label style={labelStyle}>
            Email for Forgot Password:
            <input
              type="text"
              value={emailForForgotPassword}
              style={inputStyle}
              onChange={(e) => setEmailForForgotPassword(e.target.value)}
            />
          </label>
          <br />
          <button
            type="submit"
            style={buttonStyle}
            onMouseOver={(e) => (e.currentTarget.style = buttonHoverStyle)}
            onMouseOut={(e) => (e.currentTarget.style = buttonStyle)}
          >
            Forgot Password
          </button>
          <button type="button" style={buttonStyle} onClick={handleBackToSignIn}>
            Back
          </button>
        </form>
      ) : (
        // Sign-in Form
        <form style={formStyle} onSubmit={handleSignIn}>
          <label style={labelStyle}>
            Username:
            <input type="text" value={username} style={inputStyle} onChange={(e) => setUsername(e.target.value)} />
          </label>
          <br />
          <label style={labelStyle}>
            Password:
            <input type="password" value={password} style={inputStyle} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <br />
          <button
            type="submit"
            style={buttonStyle}
            onMouseOver={(e) => (e.currentTarget.style = buttonHoverStyle)}
            onMouseOut={(e) => (e.currentTarget.style = buttonStyle)}
          >
            Sign In
          </button>
          <button style={buttonStyle} onClick={() => setResetPasswordVisible(true)}>
            Forgot Password?
          </button>
        </form>
      )}
    </div>
  );
};

export default SignInForm;
