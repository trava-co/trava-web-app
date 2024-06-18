import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/user.css'; // Import the CSS file
import axios from 'axios'

function User() {
  const [tripConcept, setTripConcept] = useState('');
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const navigate = useNavigate();

  function transformApiResponse(apiResponse, userId, destinationName, coords) {
    return {
      data: {
        getUser: {
          userTrips: {
            items: [
              {
                trip: {
                  attractionSwipes: {
                    items: apiResponse.attractionSwipes.items.map(item => ({
                      attractionId: item.attractionId,
                      swipe: item.swipe,
                      userId: userId,
                      attraction: {
                        name: item.attraction.name,
                        type: item.attraction.type
                      }
                    }))
                  },
                  members: {
                    items: [
                      {
                        status: "APPROVED",
                        userId: userId
                      }
                    ]
                  },
                  tripDestinations: {
                    items: [
                      {
                        destination: {
                          name: destinationName,
                          coords: coords
                        }
                      }
                    ]
                  }
                }
              }
            ]
          }
        }
      }
    };
  }

  const handleDone = async () => {
    try {
        var response = await axios.post('http://localhost:3001/ask', {
            input: tripConcept
        }, {
        headers: {
            'system': 'false'
        }
      });
      
      console.log(response.data);

      var mockResponse = transformApiResponse(response.data, "4e296663-60d1-461c-bccf-ca76e956f628", "Chicago", {lat: 41.8781, long: -87.6298})

      console.log(mockResponse);



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