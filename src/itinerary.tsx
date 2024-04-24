import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './itinerary.css';
import {utils} from 'xlsx';
import axios from 'axios';

function Itinerary() {
    const [activityData, setActivityData] = useState(null);

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
        console.log(activityData);
    }, []);
    
    const location = useLocation();
    const { apiData } = location.state || {}; // Access apiData from the state

    console.log(apiData);

    // Use JSX to create the table instead of a template string
    const table = createTable(apiData);

    return (
        <div>
        {table}
        </div>
    );
}

function transformData(jsonData, activityData) {
    return jsonData.map(item => {
      const probability = Math.floor(parseFloat(item.probability) * 4);

      const matchingActivity = activityData.find(activity => activity.id === item.id);
      const name = matchingActivity ? matchingActivity.newId : item.id; // Assuming activityData contains newId
  
      return {
        name,
        probability: probability,
        destination: item.destination,
      };
    });
}

function createTable(jsonData) {
    // Group every three items for each day
    const days = [];
    for (let i = 0; i < jsonData.length; i += 3) {
      days.push(jsonData.slice(i, i + 3));
    }
  
    return (
      <table style={{width: '100%', marginTop: '20px'}}>
        <thead>
          <tr>
            <th>Day</th>
            <th>Activity 1</th>
            <th>Activity 2</th>
            <th>Activity 3</th>
          </tr>
        </thead>
        <tbody>
          {days.map((dayActivities, index) => (
            <tr key={index}>
              <td>{`${index + 1}`}</td>
              {dayActivities.map((activity, activityIndex) => (
                <td key={activityIndex}>
                  {`${activity.name}, ${activity.probability}, ${activity.description}`}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

export default Itinerary;