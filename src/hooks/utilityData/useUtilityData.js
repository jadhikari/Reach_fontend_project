import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

// Helper function to get the last year and month
const getLastYearMonth = () => {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth(); // Month is 0-indexed, so 0 is January, 11 is December

  // If it's January, go to December of the previous year
  if (month === 0) {
    month = 12; // Set to December
    year -= 1;  // Go to the previous year
  }

  // Zero-pad the month (e.g., 1 -> '01', 2 -> '02')
  const lastMonth = (`0${month}`).slice(-2);
  
  return `${year}-${lastMonth}`;
};

// Custom hook for fetching data
export const useUtilityData = (apiEndPoint, searchParams) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const yearMonth = getLastYearMonth();

  // Extract search parameters (updated names)
  const { formattedDate, selectedPlants, selectedGroup } = searchParams; 
  //console.log(formattedDate, selectedPlants, selectedGroup); 
  
  const dateParam = formattedDate || yearMonth; // Use formattedDate from searchParams or default to yearMonth
  const plantParam = selectedPlants?.length > 0 ? selectedPlants.join(',') : ''; // Handle selected plants
  const groupParam = selectedGroup || ''; // Handle selected group

  // Build the URL based on search parameters
  const url = useMemo(() => {
    const baseUrl = process.env.REACT_APP_BASE_URL;
    return `${baseUrl}/core/${apiEndPoint}?rd=${dateParam}${plantParam ? `&plant_id=${plantParam}` : ''}${groupParam ? `&group_name=${groupParam}` : ''}`;
  }, [apiEndPoint, dateParam, plantParam, groupParam]);

  // Debugging logs
  //console.log('Fetching data with URL:', url);
  // console.log('Search params:', { dateParam, plantParam, groupParam });

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const fetchedData = response.data.results || response.data || [];
        setData(fetchedData); // Update data state

      } catch (error) {
        setError(error);
        setData([]); // Clear data on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, token]); // Trigger useEffect on URL and token change
  
  return { data, error, loading };
};
