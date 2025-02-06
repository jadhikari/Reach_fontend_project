// src/hooks/useEditData.js
import { useState, useEffect } from 'react';
import axios from 'axios';

export function useEditData(apiEndPoint) {
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editState, setEditState] = useState({
    editingIndex: null,
    originalValues: {},
  });

  const token = localStorage.getItem('token');
  const baseUrl = process.env.REACT_APP_BASE_URL;

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/core/${apiEndPoint}`, {
          headers: { Authorization: `Token ${token}` },
        });
        setListData(response.data);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (apiEndPoint) fetchData();
  }, [apiEndPoint, baseUrl, token]);

  // Handle edit initiation
  const handleEdit = (index, item) => {
    setEditState({
      editingIndex: index,
      originalValues: { ...item },
    });
  };

  // Handle input changes for editable fields
  const handleInputChange = (field, value) => {
    setEditState((prev) => ({
      ...prev,
      originalValues: {
        ...prev.originalValues,
        [field]: value,
      },
    }));
  };

  // Handle save/update operation
  const handleSave = async (index, id) => {
    const updatedData = editState.originalValues;
    // console.log('Sending update with data:', updatedData);
    try {
      const response = await axios.patch(`${baseUrl}/core/${apiEndPoint}/${id}/`, updatedData, {
        headers: { Authorization: `Token ${token}` },
      });
      const updatedItem = response.data;

      // Update list data with the edited item
      setListData((prevData) =>
        prevData.map((item, idx) => (idx === index ? { ...item, ...updatedItem } : item))
      );

      // Reset edit state
      setEditState({ editingIndex: null, originalValues: {} });
    } catch (err) {
      console.error('Error updating data:', err);
    }
  };

  return {
    listData,
    loading,
    error,
    editState,
    handleEdit,
    handleInputChange,
    handleSave,
  };
}
