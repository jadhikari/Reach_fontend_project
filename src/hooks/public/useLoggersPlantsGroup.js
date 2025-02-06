import { useState, useEffect } from 'react';
import axios from 'axios';

export const useLoggersPlantsGroup = () => {
    const [loggerPlantsGroup, setLoggerPlantsGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('token');
    const url = `${process.env.REACT_APP_BASE_URL}/core/loggers-plants-group`;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch data from loggers-plants-group endpoint
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setLoggerPlantsGroup(response.data); // Save the fetched data
            } catch (error) {
                console.error('Error fetching loggers-plants-group data:', error.message || error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [url, token]); // Dependencies: run effect when url or token changes

    return { loggerPlantsGroup, loading, error }; // Return fetched data, loading state, and error
};
