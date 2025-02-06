import React, { useState, useEffect, useCallback } from 'react';
import { SearchBox } from '../index';
import axios from 'axios'; 
import { useIndivisualUtilityData, usePlantList } from '../../../hooks';

import { FaRegCircleXmark } from "react-icons/fa6";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { RiEdit2Fill } from "react-icons/ri";
import { GrUpdate } from "react-icons/gr";


export function UpdateMonthlyExpenses({ apiEndPoint }) {  
  const token = localStorage.getItem('token');
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const [searchParams, setSearchParams] = useState({ formattedDate: '', selectedLoggers: [] });
  const [plantIds, setPlantIds] = useState([]);
  const { plantsData, error: plantError, loading: plantLoading } = usePlantList();
  const { data, error, loading } = useIndivisualUtilityData(apiEndPoint, searchParams);

  const [editState, setEditState] = useState({ editingIndex: null, originalValues: { used_electricity_kwh: '', used_amount_jpy: '', tax_jpy: '' }, currentItem: null });
  const [localData, setLocalData] = useState([]);

  useEffect(() => {
    if (plantsData && plantsData.length > 0) {
      const fetchedPlantIds = plantsData.map(plant => plant.plant_id);
      setPlantIds(fetchedPlantIds);
    }
  }, [plantsData]);

  useEffect(() => {
    if (data) {
      setLocalData(data);
    }
  }, [data]);

  const handleSearch = useCallback((params) => {
    setSearchParams(params);
  }, []);

  if (plantLoading) return <p>Loading...</p>;
  if (plantError) return <p>Error loading data: {plantError?.message}</p>;

  // Start to write the function for Update 

  const handleEdit = (index, currentItem) => {
    setEditState({ 
      editingIndex: index, 
      originalValues: { 
        used_electricity_kwh: currentItem.used_electricity_kwh, 
        used_amount_jpy: currentItem.used_amount_jpy, 
        tax_jpy: currentItem.tax_jpy 
      }, 
      currentItem 
    });
  };

  const handleUpdate = async (index, id) => {
    const updatedValues = editState.originalValues;
  
    try {
      const updateUrl = `${baseUrl}/core/${apiEndPoint}/${id}/`;

      const response = await axios.patch(updateUrl, updatedValues, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      const updatedItem = response.data;

      const updatedData = localData.map((item, idx) =>
        idx === index ? { ...item, ...updatedItem } : item
      );

      setEditState({ editingIndex: null, originalValues: { used_electricity_kwh: '', used_amount_jpy: '', tax_jpy: '' }, currentItem: null });
      setLocalData(updatedData);

      //console.log('Update successful:', updatedItem);

    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setEditState((prev) => ({
      ...prev, 
      originalValues: { 
        ...prev.originalValues, 
        [field]: value 
      }
    }));
  };

  return (
    <div>
      <h6>Update Monthly Expenses</h6>
      <SearchBox 
        loggerNames={plantIds} 
        onSearch={handleSearch} 
        searchParams={searchParams} 
      />
      {loading && <p>Loading data...</p>}
      {error && <p style={{ color: 'red' }}>Error fetching data: {error.message}</p>}
    
      {localData.length > 0 ? (
        <div className="data-section">
          <table className="table text-center th-table">
            <thead>
              <tr>
                <th>Plant id</th>
                <th>Used Electricity(kwh)</th>
                <th>Amount(jpy)</th>
                <th>Tax(jpy)</th>
                <th>Status</th>
                <th>Updated at</th>
                <th>User</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[...localData]
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Sort in descending order
                .map((item, index) => (  
                <tr key={item.id}>
                  <td>{item.plant_id}</td>

                  <td>
                    {editState.editingIndex === index ? (
                      <input
                        type="number"
                        value={editState.originalValues.used_electricity_kwh || item.used_electricity_kwh}
                        onChange={(e) => handleInputChange('used_electricity_kwh', e.target.value)}
                      />
                    ) : (
                      item.used_electricity_kwh
                    )}
                  </td>

                  <td>
                    {editState.editingIndex === index ? (
                      <input
                        type="number"
                        value={editState.originalValues.used_amount_jpy || item.used_amount_jpy}
                        onChange={(e) => handleInputChange('used_amount_jpy', e.target.value)}
                      />
                    ) : (
                      item.used_amount_jpy
                    )}
                  </td>

                  <td>
                    {editState.editingIndex === index ? (
                      <input
                        type="number"
                        value={editState.originalValues.tax_jpy || item.tax_jpy}
                        onChange={(e) => handleInputChange('tax_jpy', e.target.value)}
                      />
                    ) : (
                      item.tax_jpy
                    )}
                  </td>

                  <td>
                    {item.status ? (
                      <IoIosCheckmarkCircleOutline style={{ color: 'green' }} />
                    ) : (
                      <FaRegCircleXmark style={{ color: 'red' }} />
                    )}
                  </td>
                  <td>{new Date(item.updated_at).toLocaleString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric',
                    hour: 'numeric', minute: 'numeric', second: 'numeric',
                    hour12: true
                  })}</td>
                  <td>{item.user}</td>

                  <td>
                    {editState.editingIndex === index ? (
                      <GrUpdate
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleUpdate(index, item.id)}
                      />
                    ) : (
                      <RiEdit2Fill
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleEdit(index, item)}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No data available or loading...</p>
      )}
    </div>
  );
}
