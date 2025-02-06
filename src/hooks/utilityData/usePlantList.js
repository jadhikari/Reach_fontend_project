import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

// Custom hook for fetching the list of plants
export const usePlantList = () => {
  const [plantsData, setPlantsData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const apiEndPoint = 'utility-plants-list'; // Corrected spelling from "utlity"

  // Construct the URL dynamically using useMemo to optimize performance
  const url = useMemo(() => {
    const baseUrl = process.env.REACT_APP_BASE_URL;
    return `${baseUrl}/core/${apiEndPoint}`;
  }, [apiEndPoint]);

  // Fetch data from the API using useEffect
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
        setPlantsData(fetchedData); // Update the state with fetched data

      } catch (error) {
        setError(error); // Set error state if the request fails
        setPlantsData([]); // Ensure data is reset on failure
      } finally {
        setLoading(false); // Stop loading after the request completes
      }
    };

    fetchData();
  }, [url, token]); // Dependency array includes URL and token

  // Return the state data, error, and loading status
  return { plantsData, error, loading };
};
