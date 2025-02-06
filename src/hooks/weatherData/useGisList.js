import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

// Custom hook for fetching the list of plants
export const useGisList = (apiEndPoint, selectedData) => {
  const selectedDate = selectedData?.selectedDate; // Safely access properties
  const selectedSystem = selectedData?.selectedSystem; // Safely access properties
  const [gisData, setGisData] = useState(null); // Start with `null` if no data
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // No loading by default

  const token = localStorage.getItem('token');

  // Construct the URL dynamically using useMemo to optimize performance
  const url = useMemo(() => {
    if (!selectedDate || !selectedSystem) return null; // Return null if conditions are not met
    const baseUrl = process.env.REACT_APP_BASE_URL;
    return `${baseUrl}/core/${apiEndPoint}?year_month=${selectedDate}&power_plant=${selectedSystem}`;
  }, [apiEndPoint, selectedDate, selectedSystem]);

  // Fetch data from the API using useEffect
  useEffect(() => {
    if (!url) {
      // Reset state if URL is not valid
      setGisData(null);
      setError(null);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const fetchedData = response.data.results || response.data || [];
        setGisData(fetchedData); // Update the state with fetched data
      } catch (error) {
        setError(error); // Set error state if the request fails
        setGisData(null); // Ensure data is reset on failure
      } finally {
        setLoading(false); // Stop loading after the request completes
      }
    };

    fetchData();
  }, [url, token]); // Dependency array includes URL and token

  // console.log(gisData);

  // Return the state data, error, and loading status
  return { gisData, error, loading };
};
