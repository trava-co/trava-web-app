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




export default Itinerary;