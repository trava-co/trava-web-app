import * as React from 'react';
import { useLocation } from 'react-router-dom';

import axios from 'axios';


// establishes all the states, renders the actual table
function ItineraryDisplayComponent() {

    const createTable = (apiData, activityData) => {
        if (!apiData || !apiData.plan || !activityData) return null;
    
        const attractionIdToName = activityData.reduce((acc, item) => {
            acc[item[0]] = item[4]; // Assuming the first element is attractionId and fifth is the name
            return acc;
        }, {});
    
        // Find the maximum number of attractions in any day to set the table columns
        const maxAttractionsPerDay = apiData.plan.reduce((max, day) => Math.max(max, day.length), 0);
    
        return (
            <table style={{ border: "2px solid black", borderCollapse: "collapse", margin: "auto" }}>
                <tbody>
                    {apiData.plan.map((day, index) => (
                        <tr key={index}>
                            <td style={{ border: "1px solid black" }}><strong>Day {index + 1}</strong></td>
                            {Array.from({ length: maxAttractionsPerDay }).map((_, idx) => (
                                <td key={idx} style={{ border: "1px solid black", backgroundColor: day[idx] ? 'white' : 'grey' }}>
                                    {attractionIdToName[day[idx]?.attractionId] || 'TBA'}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    // ---------------------------------------------------------------------------------------------------
    // pulls in the activity-excel.xlsx as JSON
    const [activityData, setActivityData] = React.useState(null);
    const [table, setTable] = React.useState<React.ReactNode | null>(null);
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
    React.useEffect(() => {
        getSheetData();
    }, [])
    // ---------------------------------------------------------------------------------------------------

    const location = useLocation();
    const { itineraryData } = location.state || {};

    
    setTimeout(() => {
        console.log(itineraryData);
        console.log(activityData);
        setTable(createTable(itineraryData, activityData));
    }, 5000);

    return (
        <div>
            {table}
        </div>
    );
}




export default ItineraryDisplayComponent;