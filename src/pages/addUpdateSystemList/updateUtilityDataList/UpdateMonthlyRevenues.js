import React, { useState, useEffect, useCallback } from 'react';
import { SearchBox } from '../index';
import axios from 'axios'; 
import { useIndivisualUtilityData, usePlantList } from '../../../hooks';

import { FaRegCircleXmark } from "react-icons/fa6";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { RiEdit2Fill } from "react-icons/ri";
import { GrUpdate } from "react-icons/gr";


export function UpdateMonthlyRevenues({ apiEndPoint }) {  
  const token = localStorage.getItem('token');
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const [searchParams, setSearchParams] = useState({ formattedDate: '', selectedLoggers: [] });
  const [plantIds, setPlantIds] = useState([]);
  const { plantsData, error: plantError, loading: plantLoading } = usePlantList();
  const { data, error, loading } = useIndivisualUtilityData(apiEndPoint, searchParams);

  // State to track which row is being edited and the original values for multiple fields
  const [editState, setEditState] = useState({ editingIndex: null, fields: {} });

  // Local data state
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

  const handleEdit = (index, currentItem) => {
    setEditState({
      editingIndex: index,
      fields: {
        start_date: currentItem.start_date,
        end_date: currentItem.end_date,
        sales_days: currentItem.sales_days,
        sales_electricity_kwh: currentItem.sales_electricity_kwh,
        sales_amount_jpy: currentItem.sales_amount_jpy,
        tax_jpy: currentItem.tax_jpy,
        average_daily_sales_kwh: currentItem.average_daily_sales_kwh
      }
    });
  };

  const handleUpdate = async (index, id) => {
    try {
      const updateUrl = `${baseUrl}/core/${apiEndPoint}/${id}/`;
      const response = await axios.patch(updateUrl, editState.fields, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      const updatedItem = response.data;

      const updatedData = localData.map((item, idx) =>
        idx === index ? { ...item, ...updatedItem } : item
      );

      setEditState({ editingIndex: null, fields: {} });
      setLocalData(updatedData);

      //console.log('Update successful:', updatedItem);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setEditState((prev) => ({
      ...prev,
      fields: { ...prev.fields, [field]: value }
    }));
  };

  return (
    <div>
      <h6>Update Monthly Revenues</h6>
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
                <th>Start Date</th>
                <th>End Date</th>
                <th>Sales Days</th>
                <th>Sales Electricity(kwh)</th>
                <th>Amount(jpy)</th>
                <th>Tax(jpy)</th>
                <th>Average Daily Sales(kwh)</th>
                <th>Status</th>
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
                        type="date"
                        value={editState.fields.start_date}
                        onChange={(e) => handleInputChange("start_date", e.target.value)}
                      />
                    ) : (
                      item.start_date
                    )}
                  </td>
                  <td>
                    {editState.editingIndex === index ? (
                      <input
                        type="date"
                        value={editState.fields.end_date}
                        onChange={(e) => handleInputChange("end_date", e.target.value)}
                      />
                    ) : (
                      item.end_date
                    )}
                  </td>
                  <td>
                    {editState.editingIndex === index ? (
                      <input
                        type="number"
                        value={editState.fields.sales_days}
                        onChange={(e) => handleInputChange("sales_days", e.target.value)}
                      />
                    ) : (
                      item.sales_days
                    )}
                  </td>
                  <td>
                    {editState.editingIndex === index ? (
                      <input
                        type="number"
                        value={editState.fields.sales_electricity_kwh}
                        onChange={(e) => handleInputChange("sales_electricity_kwh", e.target.value)}
                      />
                    ) : (
                      item.sales_electricity_kwh
                    )}
                  </td>
                  <td>
                    {editState.editingIndex === index ? (
                      <input
                        type="number"
                        value={editState.fields.sales_amount_jpy}
                        onChange={(e) => handleInputChange("sales_amount_jpy", e.target.value)}
                      />
                    ) : (
                      item.sales_amount_jpy
                    )}
                  </td>
                  <td>
                    {editState.editingIndex === index ? (
                      <input
                        type="number"
                        value={editState.fields.tax_jpy}
                        onChange={(e) => handleInputChange("tax_jpy", e.target.value)}
                      />
                    ) : (
                      item.tax_jpy
                    )}
                  </td>
                  <td>
                    {editState.editingIndex === index ? (
                      <input
                        type="number"
                        value={editState.fields.average_daily_sales_kwh}
                        onChange={(e) => handleInputChange("average_daily_sales_kwh", e.target.value)}
                      />
                    ) : (
                      item.average_daily_sales_kwh
                    )}
                  </td>
                  <td>
                    {item.status ? (
                      <IoIosCheckmarkCircleOutline style={{ color: 'green' }} />
                    ) : (
                      <FaRegCircleXmark style={{ color: 'red' }} />
                    )}
                  </td>
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
