import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Assistant.css'; // Import the CSS file for styling
import axios from 'axios';

// Creates the thread on the assistant

function Assistant() {
  const [destination, setDestination] = useState('');
  const [numDays, setNumDays] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const navigate = useNavigate();

  const handleNext = async () => {
    setIsLoading(true);
    setLoadingText("Thread requested for creation...");
    try {
        const response = await axios.post('http://localhost:3001/ask', {
          numDays,
          destination
        }, {
          headers: {
            'system': 'true'
          }
        });
        setLoadingText(`Thread ${response.data} created!`);
        setTimeout(() => {
            navigate('/user', { state: { destination, numDays } });
        }, 2000);
    } catch (error) {
        console.error('Error sending data:', error);
        setLoadingText("Failed to create thread!");
    } finally {
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }
  };

  const incrementDays = () => setNumDays(numDays + 1);
  const decrementDays = () => setNumDays(numDays - 1 > 0 ? numDays - 1 : 1);

  const handleDestinationSelect = (city) => {
    setDestination(city);
  };

  return (
    <div className="assistant-container">
      {isLoading ? (
        <>
            <div className="loading-text">{loadingText}</div>
            <div className="loader"></div>
        </>
      ) : (
        <>
            <div className="section-container destination-section">
                <h2>Pick a destination</h2>
                <div className="destination-grid">
                <button className={`destination-button ${destination === 'Chicago' ? 'active' : ''}`} onClick={() => handleDestinationSelect('Chicago')}>
                <img src="https://cdn-icons-png.flaticon.com/512/2359/2359697.png" alt="Chicago" />
            </button>
            {/* Update other buttons similarly with their respective cities and conditions */}
            <button className={`destination-button ${destination === 'New York' ? 'active' : ''}`} onClick={() => handleDestinationSelect('New York')}>
                <img src="https://cdn-icons-png.freepik.com/512/284/284489.png" alt="New York" />
            </button>
            <button className={`destination-button ${destination === 'Los Angeles' ? 'active' : ''}`} onClick={() => handleDestinationSelect('Los Angeles')}>
                <img src="https://cdn1.iconfinder.com/data/icons/united-states-of-america-gradient-freedom-trail/512/Hollywood-512.png" alt="Los Angeles" />
            </button>
            <button className={`destination-button ${destination === 'Miami' ? 'active' : ''}`} onClick={() => handleDestinationSelect('Miami')}>
                <img src="https://vectorflags.s3.amazonaws.com/flags/in-circle-01.png" alt="Miami" />
            </button>
                </div>
            </div>
            <div className="section-container days-section">
                <h2>How many days are you visiting?</h2>
                <div className="num-days-selector">
                    <button onClick={decrementDays}>-</button>
                    <span>{numDays}</span>
                    <button onClick={incrementDays}>+</button>
                </div>
            </div>
            <div className="section-container next-section">
                <button onClick={handleNext}>Next</button>
            </div>
        </>
      )}
    </div>
  );
}

export default Assistant;