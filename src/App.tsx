import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SetupComponent from './screens/setup';
import InputComponent from './screens/input';
import './css/App.css';
import ItineraryDisplayComponent from './screens/itinerary-display';
import UserApi from './UserApi'

import Amplify from 'aws-amplify'
import awsConfig from './aws-exports.js' 
Amplify.configure(awsConfig)

await Amplify.Auth.signIn("gpt4api", "Pass_Word1")

//right here

function App() {

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await UserApi.getUserById("4e296663-60d1-461c-bccf-ca76e956f628")
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchUser();
  }, []);
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SetupComponent />}></Route>
        <Route path="/user" element={<InputComponent />}></Route>
        <Route path="/itin" element={<ItineraryDisplayComponent />}></Route>
      </Routes>
    </Router>
  );
}

export default App;