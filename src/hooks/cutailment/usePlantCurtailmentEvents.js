import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

// Helper function to get the last year and month in "YYYY-MM" format
const getLastYearMonth = () => {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth(); // Month is 0-indexed, so 0 is January, 11 is December

  if (month === 0) {
    month = 12; // Set to December
    year -= 1;  // Go to the previous year
  }

  // Zero-pad the month (e.g., 1 -> '01', 2 -> '02')
  const lastMonth = (`0${month}`).slice(-2);
  return `${year}-${lastMonth}`;
};

// Custom hook for fetching plant curtailment events
export const usePlantCurtailmentEvents = (apiEndPoint, plantId, rd) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const yearMonth = rd || getLastYearMonth(); // Use provided `rd` or fallback to last month

  // Build the URL based on `plantId` and `yearMonth`
  const url = useMemo(() => {
    return `${baseUrl}/core/${apiEndPoint}?rd=${yearMonth}${plantId ? `&plant_id=${plantId}` : ''}`;
  }, [baseUrl, apiEndPoint, yearMonth, plantId]);

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
        setData(fetchedData);
      } catch (error) {
        setError(error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    if (plantId) {
      fetchData(); // Only fetch data if `plantId` is provided
    }
  }, [url, token, plantId]); // Trigger fetch on URL or token or plantId change
  
  return { data, loading, error };
};
