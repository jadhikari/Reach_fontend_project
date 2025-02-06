import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

export const useIndivisualUtilityData = (apiEndPoint, searchParams) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { formattedDate, selectedLoggers } = searchParams || {};
  const token = localStorage.getItem('token');
  // console.log('API Endpoint:', apiEndPoint);
  // Use useMemo to create a stable URL only if formattedDate and selectedLoggers are defined
  const url = useMemo(() => {
    if (!formattedDate || !selectedLoggers || selectedLoggers.length === 0) return null;
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const loggersQuery = `&plant_id=${selectedLoggers.join(',')}`;
    return `${baseUrl}/core/${apiEndPoint}?rd=${formattedDate}${loggersQuery}`;
  }, [apiEndPoint, formattedDate, selectedLoggers]);
  // console.log('url:', url);

  useEffect(() => {
    if (!url) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setData(response.data);
      } catch (fetchError) {
        setError(fetchError);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, token]);

  return { data, error, loading };
};
