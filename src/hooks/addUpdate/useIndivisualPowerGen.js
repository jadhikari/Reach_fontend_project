import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

export const useIndivisualPowerGen = (apiEndPoint, searchParams) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { formattedDate, selectedLoggers } = searchParams;
    const token = localStorage.getItem('token');

    // Build the URL based on search parameters
    const url = useMemo(() => {
        if (!formattedDate || selectedLoggers.length === 0) return null;  // Ensure both params are present
        const baseUrl = process.env.REACT_APP_BASE_URL;
        const loggersQuery = selectedLoggers.length ? `&logger_name=${selectedLoggers.join(',')}` : '';
        return `${baseUrl}/core/${apiEndPoint}?year_month=${formattedDate}${loggersQuery}`;
    }, [apiEndPoint, formattedDate, selectedLoggers]);

    useEffect(() => {
        if (!url) return;  // Skip fetching if no URL (meaning no valid search parameters)
        
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                //console.log(response)
                setData(response.data);  // Update data state
            } catch (error) {
                setError(error);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();  // Call the function to fetch data
    }, [url, token]);  // Only re-run if `url` or `token` changes

    return { data, error, loading };
};
