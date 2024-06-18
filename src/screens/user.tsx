import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/user.css'; // Import the CSS file
import axios from 'axios'
import UserApi from '../UserApi'
import getInputForTripPlan from '../get-input-for-trip-plan';
import { TripDestinationTime } from '../API';

function User() {
  const [tripConcept, setTripConcept] = React.useState('');
  const [apiData, setApiData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [loadingText, setLoadingText] = React.useState('');
  const navigate = useNavigate();

  function transformApiResponse(apiResponse, userId, destinationName, coords) {
    return {
        attractionSwipes: {
          __typename: "ModelAttractionSwipeConnection",
          items: apiResponse.attractionSwipes.items.map(item => ({
            __typename: "AttractionSwipe",
            attractionId: item.attractionId,
            swipe: item.swipe,
            userId: userId,
            attraction: {
              __typename: "Attraction",
              name: item.attraction.name,
              type: item.attraction.type
            }
          }))
        },
        members: {
          __typename: "ModelTripMemberConnection",
          items: [
            {
              __typename: "TripMember",
              status: "APPROVED",
              userId: userId
            }
          ]
        },
        tripDestinations: {
          __typename: "ModelTripDestinationConnection",
          items: [
            {
              __typename: "TripDestination",
              destination: {
                __typename: "Destination",
                name: destinationName,
                coords: {
                  __typename: "Coords",
                  lat: coords.lat,
                  long: coords.long
                }
              }
            }
          ]
        }
    }
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

      console.log("mock response")
      console.log(mockResponse);

      // at this point, we have our mock response ready. we need to call the getAttractionsForScheduler. We then need to run the local function 
      // in trava-mobile called getInputForTripPlan. then with the output of that, run the generateTripPlan query

      const input = 
      {
        "input": {
          "centerCoords": {
            "lat": 41.8781,
            "long": -87.6298
          },
          "radius": 15,
          "tripId": "d30de4e6-97b7-4238-84a2-a1fe74f7c471",
          "destinationId": "fa18d422-44f8-42f9-9260-d0a3a95d588f"
        }
      }      
  
    const attractions = await UserApi.getAttractionsForScheduler(input);

    console.log("attractions scheduler call")
    console.log(attractions);

    console.log("user trips test: " + mockResponse)

    const inputForTripPlan = getInputForTripPlan(
      mockResponse,
      attractions.attractions,
      20240719,
      20240721,
      TripDestinationTime.MORNING,
      TripDestinationTime.AFTERNOON,
    )

    console.log(inputForTripPlan)
  
    const tripPlan = await UserApi.generateTripPlan(inputForTripPlan)

    console.log(tripPlan);

    //   let jsonData = JSON.parse(cleanJson);
    //   console.log(jsonData);

      // setApiData(cleanJson);
      setLoading(true);
      // console.log(cleanJson);
    } catch (error) {
      console.error('Error with payload:', error);
      setApiData(null);
    }
  };

  React.useEffect(() => {
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