import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Assistant from './assistant.tsx';
import User from './user.tsx';


import './App.css';
import axios from 'axios';
import Itinerary from './itinerary.tsx';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [response, setResponse] = useState('');
  const [numDays, setNumDays] = useState(0);
  const [destination, setDestination] = useState('');


  const handleSend = async () => {
    try {
      const response = await axios.post('http://localhost:3001/ask', {
          inputValue
      }, {
        headers: {
          'system': 'false'
        }
      });
      // Assuming the server response is the message directly
      console.log(response.data);
      setResponse(response.data);
    } catch (error) {
        console.error('Error asking question:', error);
        setResponse('error');
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Assistant />}></Route>
        <Route path="/user" element={<User />}></Route>
        <Route path="/itin" element={<Itinerary />}></Route>
      </Routes>
    </Router>
  );
}

export default App;