import React, { useState } from 'react';
import jsonData from './data/data.json';
import axios from 'axios';
import './Main.css';
import Cookies from 'js-cookie';

const BALLOT_BOXES = [
    {from: 1, to: 7065, floor: "GF", box: 1},
    {from: 7066, to: 9957, floor: "GF", box: 2},
    {from: 9958, to: 12541, floor: "GF", box: 3},
    {from: 12542, to: 15865, floor: "GF", box: 4},
    {from: 15866, to: 19316, floor: "GF", box: 5},
    {from: 19317, to: 22892, floor: "GF", box: 6},
    {from: 22893, to: 26270, floor: "GF", box: 7},
    {from: 26271, to: 29515, floor: 1, box: 8},
    {from: 29516, to: 32679, floor: 1, box: 9},
    {from: 32680, to: 35858, floor: 1, box: 10},
    {from: 35859, to: 39124, floor: 1, box: 11},
    {from: 39125, to: 42315, floor: 1, box: 12},
    {from: 42316, to: 45606, floor: 1, box: 13},
    {from: 45607, to: 48896, floor: 1, box: 14},
    {from: 48897, to: 52156, floor: 2, box: 15},
    {from: 52157, to: 55336, floor: 2, box: 16},
    {from: 55337, to: 58415, floor: 2, box: 17},
    {from: 58416, to: 61277, floor: 2, box: 18},
    {from: 61278, to: 63940, floor: 3, box: 19},
    {from: 63941, to: 66121, floor: 3, box: 20}
];

const Main = () => {
  const isLoggedIn = !!Cookies.get('token');
  if (!isLoggedIn)
    window.location.href = '/';
  const [number, setNumber] = useState('');
  const [message, setMessage] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const handleSearch = () => {
    setMessage('');
    const result = jsonData.find(item => item.Code === parseInt(number));
    if (result != null) {
      for (var i = 0; i < BALLOT_BOXES.length; i++) {
        if (parseInt(number) >= BALLOT_BOXES[i].from && parseInt(number) <= BALLOT_BOXES[i].to) {
          result.Floor = BALLOT_BOXES[i].floor;
          result.Ballot_Box = BALLOT_BOXES[i].box;
          setMessage('Floor: ' + result.Floor + ', Ballot Box: ' + result.Ballot_Box);
        }
      }
      console.log(result);
      setSearchResult(result);
    } else {
      setMessage('Engineer with ID ' + number + ' not found'); 
    }
  };
  
  const handleChange = (e) => {
    console.log(process.env.REACT_APP_TEST);
    setNumber(e.target.value);
  };
  
  const handleNavigate = () => {
    console.log(1);
  }

  const handleAddVote = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_OEA_BACKEND_HOST}/votes/${number}`);
      setMessage('Vote added successfully');
    } catch (error) {
      setMessage('Failed to add vote');
    }
  };

  const handleRemoveVote = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_OEA_BACKEND_HOST}/votes/${number}`);
      setMessage('Vote removed successfully');
    } catch (error) {
      setMessage('Failed to remove vote');
    }
  };

  const handleGetVote = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_OEA_BACKEND_HOST}/votes/${number}`);
      setMessage(`Votes for ${number}: ${response.data.status}`);
    } catch (error) {
      setMessage('Failed to get vote');
    }
  };

  const logout = () => {
    Cookies.remove('token');
    window.location.href = '/';
  }

  return (
    <div>
      <div style={{ textAlign: 'right', marginBottom: '20px', position: 'top' }}>
        <button className="red-button" onClick={logout}>logout</button>
      </div>
      <div className="app">
        <div className="center">
        <p style={{ fontSize: '20px', color: 'green' }} >{message}</p>
        <input
            className="input"
            type="number"
            value={number}
            onChange={handleChange}
            placeholder="Enter a number"
            autoComplete="on" // Enable autocompletion
            list="data-keys" // Specify the datalist ID for autocompletion
          />
          <datalist id="data-keys">
            {jsonData.map((item, index) => (
              <option key={index} value={item.Code} />
            ))}
          </datalist>
          <button className="button" onClick={handleSearch}>Search</button>
            {searchResult && (
            <div>
                <table className="table">
                <tbody>
                    {Object.keys(searchResult).map(key => (
                    <tr key={key}>
                        <td>{key}</td>
                        <td><strong>{searchResult[key]}</strong></td>
                    </tr>
                    ))}
                </tbody>
                </table>
                <br/>
            </div>
            )}
        <button className="button" onClick={handleAddVote}>Add Vote</button>
        <button className="button" onClick={handleRemoveVote}>Remove Vote</button>
        <button className="button" onClick={handleGetVote}>Get Vote</button>
        {/* <a style={{ fontSize: '20px'}} href={process.env.REACT_APP_OEA_BACKEND_HOST+"/votes"} target="_blank" >Export Votes</a> */}
        </div>
      </div>
    </div>
  );
}

export default Main;
