import { useState, useEffect } from 'react';
import axios from 'axios';

const getYesterdayDate = () => {
    const now = new Date();
    // Subtract one day
    now.setDate(now.getDate() - 1);

    const year = now.getFullYear();
    const month = (`0${now.getMonth() + 1}`).slice(-2); // Zero-pad the month
    const date = (`0${now.getDate()}`).slice(-2); // Zero-pad the date

    return `${year}-${month}-${date}`; // Return date in YYYY-MM-DD format
};

export const useNotification = (apiEndPoint) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loggerNames, setLoggerNames] = useState([]); // State to store logger names
    const [missingLoggers, setMissingLoggers] = useState([]); // State to store missing logger names
    const [zeroPowerGen, setZeroPowerGen] = useState([]); // State to store zero logger power gen

    const token = localStorage.getItem('token');
    const yearMonthDate = getYesterdayDate();
    const url = `${process.env.REACT_APP_BASE_URL}/core/${apiEndPoint}?year_month_date=${yearMonthDate}`;
    const loggerCategoriesUrl = `${process.env.REACT_APP_BASE_URL}/core/loggercategories`;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch logger names from the main API endpoint
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });

                // Extract logger names from the initial API response and trim whitespace
                const fetchedLoggerNames = response.data.map(item => item.logger_name.trim());
                //console.log('Fetched logger names:', fetchedLoggerNames);
                

                // Extract loggers with zero power generation and trim whitespace
                const NotPowerGen = response.data
                .filter(item => item.power_gen === "0.0000") // Filter loggers with zero power generation
                .map(item => ({
                ...item,
                logger_name: item.logger_name.trim() // Trim whitespace from logger_name if needed
                }));
                // console.log('Fetched zero power gen loggers:', NotPowerGen);

                // Extract logger names from the initial API response and trim whitespace
                const fetchedZeroPowerGen = NotPowerGen.map(item => item.logger_name.trim());
                // console.log('Fetched zero power gen loggers:', fetchedZeroPowerGen);
                setZeroPowerGen(fetchedZeroPowerGen);


                


                // Fetch logger names from the logger categories endpoint
                const categoriesResponse = await axios.get(loggerCategoriesUrl, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });

                // Filter the categoriesResponse data to include only items with status true
                const activeCategories = categoriesResponse.data.filter(item => item.status === true);
                // Extract logger names from the logger categories endpoint and trim whitespace
                const allLoggerNames = activeCategories.map(item => item.logger_name.trim());
                // console.log('All logger names:', allLoggerNames);
                setLoggerNames(allLoggerNames);

                // Find missing logger names
                const missing = allLoggerNames.filter(name => !fetchedLoggerNames.includes(name));
                setMissingLoggers(missing);

                // Log missing logger names
                // console.log('Missing logger names:', missing);
                
            } catch (error) {
                console.error('Error fetching data:', error.message || error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url, loggerCategoriesUrl, token]);

    return { loading, error, loggerNames, missingLoggers, zeroPowerGen, yearMonthDate }; // Return missingLoggers
};
