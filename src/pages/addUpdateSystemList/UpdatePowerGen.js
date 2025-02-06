import React, { useCallback, useState, useEffect } from 'react';
import axios from 'axios';
import { SearchBox } from './index';
import { useTitle, useIndivisualPowerGen, useNotification } from "../../hooks";

import { FaRegCircleXmark } from "react-icons/fa6";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { RiEdit2Fill } from "react-icons/ri";
import { GrUpdate } from "react-icons/gr";

export const UpdatePowerGen = () => {
  const title = "Update Power Gen";
  useTitle(title);

  const apiEndPoint = "logger-power-gen";
  const token = localStorage.getItem('token');
  const baseUrl = process.env.REACT_APP_BASE_URL;

  // Search parameters state
  const [searchParams, setSearchParams] = useState({ formattedDate: '', selectedLoggers: [] });

  // Fetch data using custom hook
  const { data, error, loading, refetch } = useIndivisualPowerGen(apiEndPoint, searchParams);
  
  // Get logger names for search box
  const { loggerNames } = useNotification(apiEndPoint);

  // State to manage editing
  const [editState, setEditState] = useState({ editingIndex: null, originalValue: '', currentItem: null });

  // State for local data
  const [localData, setLocalData] = useState([]);

  // Sync localData with fetched data, only when not editing
  useEffect(() => {
    if (editState.editingIndex === null) {
      setLocalData(data);
    }
  }, [data]);

  // Handle search updates
  const handleSearch = useCallback((params) => {
    setSearchParams(params);
  }, []);

  // Handle edit button click
  const handleEdit = (index, currentItem) => {
    setEditState({ editingIndex: index, originalValue: currentItem.power_gen, currentItem });
  };

  // Handle update button click
  const handleUpdate = async (index, id) => {
    try {
      const updatedValue = editState.originalValue;
      const updateUrl = `${baseUrl}/core/${apiEndPoint}/${id}/`;

      const response = await axios.patch(updateUrl, { power_gen: updatedValue }, {
        headers: { Authorization: `Token ${token}` },
      });

      const updatedItem = response.data; // This should contain full updated object from the server

      // **Replace the updated item in localData, including updated_at, user, and status**
      setLocalData((prevData) =>
        prevData.map((item) =>
          item.id === id ? updatedItem : item
        )
      );

      setEditState({ editingIndex: null, originalValue: '', currentItem: null });

      //console.log('Update successful:', updatedItem);

      // **Force Re-fetch (Optional)**
      if (typeof refetch === 'function') {
        setTimeout(() => refetch(), 500);
      }

    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  // Handle input change in edit mode
  const handleInputChange = (value) => {
    setEditState((prev) => ({ ...prev, originalValue: value }));
  };

  return (
    <div>
      <h6>Power generation list for update.</h6>
      <SearchBox 
        loggerNames={loggerNames} 
        onSearch={handleSearch} 
        searchParams={searchParams} 
      />

      {loading && <p>Loading data...</p>}
      {error && <p style={{ color: 'red' }}>Error fetching data: {error.message}</p>}

      {localData.length > 0 ? (
        <div className="data-section">
          <table className="table th-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Logger Name</th>
                <th>Power Generation (kWh)</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>User</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[...localData]
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Sort in descending order
                .map((item, index) => (
                  <tr key={item.id}>
                    <td>{item.date}</td>
                    <td>{item.logger_name}</td>
                    <td>
                      {editState.editingIndex === index ? (
                        <input
                          type="number"
                          value={editState.originalValue}
                          onChange={(e) => handleInputChange(e.target.value)}
                        />
                      ) : (
                        item.power_gen
                      )}
                    </td>
                    <td>
                      {item.status ? (
                        <IoIosCheckmarkCircleOutline style={{ color: 'green' }} />
                      ) : (
                        <FaRegCircleXmark style={{ color: 'red' }} />
                      )}
                    </td>
                    <td>{new Date(item.created_at).toLocaleString()}</td>
                    <td>{new Date(item.updated_at).toLocaleString()}</td>
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
};
