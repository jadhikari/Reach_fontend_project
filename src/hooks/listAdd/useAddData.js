import { useState } from 'react';

export function useAddData(apiEndPoint) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const savePlantData = async (formData) => {
    setLoading(true);
    try {
      //console.log('Data being sent:', formData); 
      const response = await fetch(`${baseUrl}/core/${apiEndPoint}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save the data');
      }

      setLoading(false);
      return true; // Indicate success
    } catch (err) {
      console.error('Error saving the data:', err);
      setError(err.message);
      setLoading(false);
      return false; // Indicate failure
    }
  };

  return { savePlantData, loading, error };
}
