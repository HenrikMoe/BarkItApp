
import React, { useState, ChangeEvent, FormEvent } from 'react';

const VerificationForm: React.FC = () => {
  const [idImageBase64, setIdImageBase64] = useState<string>('');
  const [selfieImageBase64, setSelfieImageBase64] = useState<string>('');

  const handleIdImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const idImageFile = e.target.files[0];
      const idImageBase64 = await convertFileToBase64(idImageFile);
      setIdImageBase64(idImageBase64);
    }
  };

  const handleSelfieImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selfieImageFile = e.target.files[0];
      const selfieImageBase64 = await convertFileToBase64(selfieImageFile);
      setSelfieImageBase64(selfieImageBase64);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log(idImageBase64)
    try {
      const response = await fetch('http://localhost:3029/verifyUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idImageBase64,
          selfieImageBase64,
        }),
      });

      if (response.ok) {
        // Handle success (if needed)
        console.log('Images submitted successfully');
      } else {
        // Handle error
        console.error('Failed to submit images:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting images:', error);
    }
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



  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ maxWidth: '600px', width: '100%', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <form onSubmit={handleFormSubmit}>
          {/* ID Image Form */}
          <h2>ID Image</h2>
          <label>
            Upload or Capture ID Image:
            <input
              type="file"
              accept="image/jpeg,image/png,image/heic"
              onChange={handleIdImageChange}
              style={{ width: '100%' }}
            />
          </label>
          <br />

          {/* Selfie Image Form */}
          <h2>Selfie Image</h2>
          <label>
            Upload or Capture Selfie:
            <input
              type="file"
              accept="image/jpeg,image/png,image/heic"
              onChange={handleSelfieImageChange}
              style={{ width: '100%' }}
            />
          </label>
          <br />

          <button type="submit" style={buttonStyle}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default VerificationForm;
