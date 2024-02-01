import React, { useState } from 'react';

const PasswordResetForm = ({ email, onResetPassword }) => {
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the onResetPassword prop with the new password
    onResetPassword(newPassword);
  };

  return (
    <div>
      <h2>Password Reset</h2>
      <p>Resetting password for {email}</p>
      <form onSubmit={handleSubmit}>
        <label>
          New Password:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default PasswordResetForm;
