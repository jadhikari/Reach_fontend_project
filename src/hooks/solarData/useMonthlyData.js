import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';

const getCurrentYearMonth = (date = new Date()) => {
  const year = date.getFullYear();
  const month = (`0${date.getMonth() + 1}`).slice(-2);
  return `${year}-${month}`;
};

const getPreviousYearSameMonth = (date = new Date()) => {
  const year = date.getFullYear() - 1;
  const month = (`0${date.getMonth() + 1}`).slice(-2);
  return `${year}-${month}`;
};

const getSameYearLastMonth = (date = new Date()) => {
  const year = date.getMonth() === 0 ? date.getFullYear() - 1 : date.getFullYear();
  const month = date.getMonth() === 0 ? '12' : (`0${date.getMonth()}`).slice(-2);
  return `${year}-${month}`;
};

const cache = new Map(); // Simple cache for storing API responses

export const useMonthlyData = (apiEndPoint, searchParams) => {
  const [currentMonthsData, setCurrentMonthsData] = useState([]);
  const [previousYearSameMonthData, setPreviousYearSameMonthData] = useState([]);
  const [sameYearLastMonthData, setSameYearLastMonthData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const { formattedDate, selectedLoggers, selectedGroup } = searchParams;
  const currentDate = formattedDate ? new Date(formattedDate) : new Date();
  const currentYearMonth = getCurrentYearMonth(currentDate);
  const previousYearSameMonth = getPreviousYearSameMonth(currentDate);
  const sameYearLastMonth = getSameYearLastMonth(currentDate);

  const loggerParam = selectedLoggers?.length ? selectedLoggers.join(',') : '';
  const groupParam = selectedGroup || '';

  const buildUrl = useCallback((yearMonth) =>
    `${baseUrl}/core/${apiEndPoint}?year_month=${yearMonth}` +
    `${loggerParam ? `&logger_name=${loggerParam}` : ''}` +
    `${groupParam ? `&group_name=${groupParam}` : ''}`,
    [apiEndPoint, baseUrl, loggerParam, groupParam]
  );

  const urls = useMemo(
    () => ({
      current: buildUrl(currentYearMonth),
      previousYearSameMonth: buildUrl(previousYearSameMonth),
      sameYearLastMonth: buildUrl(sameYearLastMonth),
    }),
    [buildUrl, currentYearMonth, previousYearSameMonth, sameYearLastMonth]
  );

  const fetchData = useCallback(async (url) => {
    if (cache.has(url)) {
      return cache.get(url); // Return cached data if available
    }
    const response = await axios.get(url, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    const data = response.data.results || response.data || [];
    cache.set(url, data); // Cache the response
    return data;
  }, [token]);

  useEffect(() => {
    let isMounted = true; // To prevent state updates on unmounted component

    const fetchAllData = async () => {
      setLoading(true);
      try {
        const results = await Promise.allSettled([
          fetchData(urls.current),
          fetchData(urls.previousYearSameMonth),
          fetchData(urls.sameYearLastMonth),
        ]);

        if (!isMounted) return;

        const [currentData, prevYearData, sameYearData] = results.map((result) =>
          result.status === 'fulfilled' ? result.value : []
        );

        const formatData = (data) =>
          data.reduce((acc, entry) => {
            const { logger_name, date, power_gen, created_at, updated_at, status } = entry;
            acc[logger_name] = acc[logger_name] || [];
            acc[logger_name].push({ date, power_gen, created_at, updated_at, status });
            return acc;
          }, {});

        setCurrentMonthsData(formatData(currentData));
        setPreviousYearSameMonthData(formatData(prevYearData));
        setSameYearLastMonthData(formatData(sameYearData));
        setError(null);
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAllData();

    return () => {
      isMounted = false; // Cleanup to prevent state updates
    };
  }, [fetchData, urls]);
  // console.log(currentMonthsData)
  // console.log(previousYearSameMonthData)
  // console.log(sameYearLastMonthData)

  return {
    currentMonthsData,
    previousYearSameMonthData,
    sameYearLastMonthData,
    error,
    loading,
  };
};
