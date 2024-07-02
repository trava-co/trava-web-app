import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/input.css'; // Import the CSS file
import axios from 'axios'
import UserApi from '../UserApi'
import getInputForTripPlan from '../get-input-for-trip-plan';
import { TripDestinationTime, UserTripStatus } from '../API';

function InputComponent() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingText, setLoadingText] = React.useState('');

  const [tripConcept, setTripConcept] = React.useState('');
  const [itineraryData, setItineraryData] = React.useState(null);
  
  const navigate = useNavigate();

  function transformApiResponse(apiResponse, userId, destinationName, coords) {
    return {
      __typename: "Trip" as const,
      attractionSwipes: {
        __typename: "ModelAttractionSwipeConnection" as const,
        items: apiResponse.attractionSwipes.items.map(item => ({
          __typename: "AttractionSwipe" as const,
          attractionId: item.attractionId,
          swipe: item.swipe,
          userId: userId,
          attraction: {
            __typename: "Attraction" as const,
            name: item.attraction.name,
            type: item.attraction.type
          }
        }))
      },
      members: {
        __typename: "ModelUserTripConnection" as const,
        items: [
          {
            __typename: "UserTrip" as const,
            status: "APPROVED" as UserTripStatus,
            userId: userId as string
          }
        ]
      },
      tripDestinations: {
        __typename: "ModelTripDestinationConnection" as const,
        items: [
          {
            __typename: "TripDestination" as const,
            destination: {
              __typename: "Destination" as const,
              name: destinationName,
              coords: {
                __typename: "Coords" as const,
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
    setIsLoading(true);
    setLoadingText("Faking Swipes: asking GPT for best matches based on two files...")
    try {
        var response = await axios.post('http://localhost:3001/ask', {
            input: tripConcept
        }, {
        headers: {
            'system': 'false'
        }
      });
      
      console.log("GPT came back with ▼");
      console.log(response.data);

      var mockResponse = transformApiResponse(response.data, "4e296663-60d1-461c-bccf-ca76e956f628", "Chicago", {lat: 41.8781, long: -87.6298})

      console.log("We transformed it into ▼")
      console.log(JSON.stringify(mockResponse));

      // at this point, we have our mock response ready. we need to call the getAttractionsForScheduler. We then need to run the local function 
      // in trava-mobile called getInputForTripPlan. then with the output of that, run the generateTripPlan query

      // hardcoded for pre-made plan and destinationId
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
    
    setLoadingText("Running AttractionsForScheduler: Grabbing all nearby activities from DB...")
    const attractions = await UserApi.getAttractionsForScheduler(input);

    console.log("AttractionsScheduler call comes back with ▼")
    console.log(attractions);

    const inputForTripPlan = getInputForTripPlan(
      mockResponse,
      attractions.attractions,
      20240721,
      20240719,
      TripDestinationTime.MORNING,
      TripDestinationTime.AFTERNOON,
    )

    console.log("Final Data Object to feed into planGenerator is ▼")
    console.log(inputForTripPlan)
  
    setLoadingText("Running planGenerator: creating the itinerary...")
    const tripPlan = await UserApi.generateTripPlan(inputForTripPlan)

    console.log("Plan Generator comes back with ▼")
    console.log(JSON.stringify(tripPlan));

      setItineraryData(tripPlan);
    } catch (error) {
      console.error('Error:', error);
      setItineraryData(null);
      setLoadingText("I'm a failure!");
    } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
    }
  };

  React.useEffect(() => {
    if (itineraryData) {
        navigate("/itin", { state: { itineraryData }})
    }
  }, [itineraryData, navigate]);

  return (
    <div className="input-container">
      {isLoading ? (
        <>
            <div className="loading-text">{loadingText}</div>
            <div className="loader"></div>
        </>
      ) : (
        <div className="input-section">
          <textarea
            value={tripConcept}
            onChange={(e) => setTripConcept(e.target.value)}
            placeholder="Enter trip concept"
          />
          <button onClick={handleDone}>Generate</button> {/* Added send button */}
        </div>
      )
      }
    </div>
  );
}

export default InputComponent;