import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './user.css'; // Import the CSS file
import axios from 'axios'

function User() {
  const [tripConcept, setTripConcept] = useState('');
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const navigate = useNavigate();

  const handleDone = async () => {
    try {
        var response = await axios.post('http://localhost:3001/ask', {
            input: tripConcept
        }, {
        headers: {
            'system': 'false'
        }
      });
      
      console.log(response.data.data);

    //   let jsonData = JSON.parse(cleanJson);
    //   console.log(jsonData);

      // setApiData(cleanJson);
      setLoading(true);
      // console.log(cleanJson);
    } catch (error) {
      console.error('Error sending data:', error);
      setApiData(null);
    }
  };

  useEffect(() => {
    if (apiData) {
        navigate("/itin", { state: { apiData }})
    }
  }, [apiData, navigate]);

  return (
    <div className="input-container">
      <div className="input-section">
        <textarea
          value={tripConcept}
          onChange={(e) => setTripConcept(e.target.value)}
          placeholder="Enter trip concept"
        />
        <button onClick={handleDone}>Generate</button> {/* Added send button */}
      </div>
    </div>
  );
}

export default User;