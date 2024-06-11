import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../css/itinerary.css';
import axios from 'axios';

// establishes all the states, renders the actual table
function Itinerary() {

    // ---------------------------------------------------------------------------------------------------
    // pulls in the activity-excel.xlsx as JSON
    const [activityData, setActivityData] = useState(null);
    const [table, setTable] = useState<React.ReactNode | null>(null);
    const getSheetData = async () => {
        try {
            const response = await axios.post('http://localhost:3001/file', {
                params: {
                    type: "do"
                }
            });
            setActivityData(response.data);
        } catch (error) {
            console.error('Error fetching activity data:', error);
        }
    }
    useEffect(() => {
        getSheetData();
    }, [])
    // ---------------------------------------------------------------------------------------------------

    const location = useLocation();
    const { apiData } = location.state || {};

    
    setTimeout(() => {
        console.log(apiData);
        setTable(createTable(apiData, activityData));
    }, 5000);

    return (
        <div>
            {table}
        </div>
    );
}

// 
function transformData(gptOutput, ourSheetData) {
    return gptOutput.map(item => {
       let EVright = Math.floor(parseFloat(item.probability) * 10);

      const matchingActivity = ourSheetData.find(activity => activity[0] === item.id);
      console.log(matchingActivity);
      const name = matchingActivity ? matchingActivity[4] : item.id; // Assuming activityData contains newId
  
      return {
        id: name,
        EVright: EVright,
        blurb: item.blurb,
      };
    });
}

function createTable(gptOutput, ourSheetData) {
    gptOutput = transformData(gptOutput, ourSheetData);
    console.log(gptOutput);

    // Group every three items for each day
    const days = [];
    for (let i = 0; i < gptOutput.length; i += 3) {
      days.push(gptOutput.slice(i, i + 3));
    }
  
    return (
        <table>
          <thead>
            <tr>
              <th className="day-column">Day</th>
              <th>Activity 1</th>
              <th>Activity 2</th>
              <th>Activity 3</th>
            </tr>
          </thead>
          <tbody>
            {days.map((dayActivities, index) => (
              <tr key={index}>
                <td className="day-column">{`${index + 1}`}</td>
                {dayActivities.map((activity, activityIndex) => (
                  <td key={activityIndex}>
                    <div className="id">{activity.id}</div>
                    <div className="ev">EV(← , →): {activity.EVright}  ,  {10-activity.EVright}</div>
                    <div className="blurb">{activity.blurb}</div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
  }

export default Itinerary;