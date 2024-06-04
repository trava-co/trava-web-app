import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Assistant from './assistant.tsx';
import User from './user.tsx';


import './App.css';
import Itinerary from './itinerary.tsx';
import Amplify from 'aws-amplify'

const Auth = Amplify.Auth

await Auth.signIn()

function App() {
  const [inputValue, setInputValue] = useState('');
  const [response, setResponse] = useState('');
  const [numDays, setNumDays] = useState(0);
  const [destination, setDestination] = useState('');

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