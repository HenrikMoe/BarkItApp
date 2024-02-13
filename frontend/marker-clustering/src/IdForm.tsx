import React, { useState, ChangeEvent, FormEvent } from 'react';

type IdFormProps = {
  onIdSubmit: (idImage: File | null, selfieImage: File | null) => void;
};

const IdForm: React.FC<IdFormProps> = ({ onIdSubmit }) => {
  const [idImage, setIdImage] = useState<File | null>(null);
  const [selfieImage, setSelfieImage] = useState<File | null>(null);

  const handleIdImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIdImage(e.target.files[0]);
    }
  };
  

  const handleSelfieImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelfieImage(e.target.files[0]);
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Submit the ID and selfie images
    onIdSubmit(idImage, selfieImage);
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

export default IdForm;
