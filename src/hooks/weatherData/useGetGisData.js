import { useState, useEffect } from 'react';
import axios from 'axios';


// Custom hook for fetching the list of plants
export const useGetGisData = () => {
  const [gisList, setGisList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);


  const token = localStorage.getItem('token');

  // Construct the URL dynamically using useMemo to optimize performance
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const url = `${baseUrl}/core/power-plant-detail`;

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
        setGisList(fetchedData); // Update the state with fetched data

      } catch (error) {
        setError(error); // Set error state if the request fails
        setGisList([]); // Ensure data is reset on failure
      } finally {
        setLoading(false); // Stop loading after the request completes
      }
    };

    fetchData();
  }, [url, token]); // Dependency array includes URL and token
  

  // Return the state data, error, and loading status
  return { gisList, error, loading };
};
