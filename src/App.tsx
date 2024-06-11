import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Assistant from './screens/assistant.tsx';
import User from './screens/user.tsx';
import './css/App.css';
import Itinerary from './screens/itinerary.tsx';
import UserApi from './UserApi.ts'

import Amplify from 'aws-amplify'
import awsConfig from './aws-exports.js' 
Amplify.configure(awsConfig)

await Amplify.Auth.signIn("gpt4api", "Pass_Word1")

//right here

function App() {

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await UserApi.getUserById("4e296663-60d1-461c-bccf-ca76e956f628")
        console.log('User data:', userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchUser();
  }, []);
  
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