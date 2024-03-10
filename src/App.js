import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [number, setNumber] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setNumber(e.target.value);
  };

  const handleAddVote = async () => {
    try {
      await axios.post(`https://long-lime-mussel-garb.cyclic.app/vote/${number}`);
      setMessage('Vote added successfully');
    } catch (error) {
      setMessage('Failed to add vote');
    }
  };

  const handleRemoveVote = async () => {
    try {
      await axios.delete(`https://long-lime-mussel-garb.cyclic.app/vote/${number}`);
      setMessage('Vote removed successfully');
    } catch (error) {
      setMessage('Failed to remove vote');
    }
  };

  const handleGetVote = async () => {
    try {
      const response = await axios.get(`https://long-lime-mussel-garb.cyclic.app/vote/${number}`);
      setMessage(`Votes for ${number}: ${response.data.status}`);
    } catch (error) {
      setMessage('Failed to get vote');
    }
  };

  return (
    <div className="app">
      <div className="center">
      <input className="input" type="number" value={number} onChange={handleChange} />
      <button className="button" onClick={handleAddVote}>Add Vote</button>
      <button className="button" onClick={handleRemoveVote}>Remove Vote</button>
      <button className="button" onClick={handleGetVote}>Get Vote</button>
      <p style={{ fontSize: '20px', color: 'green' }} >{message}</p>
      </div>
    </div>
  );
}

export default App;
