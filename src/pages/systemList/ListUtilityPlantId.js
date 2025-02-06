import React from 'react';
import { useTitle, useLoggersPlantsGroup, useEditData } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { IoMdAdd } from "react-icons/io";
import { MdEdit } from 'react-icons/md';
import { GrUpdate } from 'react-icons/gr';

export function ListUtilityPlantId({ apiEndPoint, title }) {
  const navigate = useNavigate();
  useTitle(title);
  const { loggerPlantsGroup } = useLoggersPlantsGroup();
  const {
    listData: loggerPlantsListGroup,
    loading,
    error,
    editState,
    handleEdit,
    handleInputChange,
    handleSave,
  } = useEditData(apiEndPoint);

  
  // Handle loading and error states
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error?.message}</p>;

  const handleAddClick = () => {
    navigate('/add-utility-plant'); // Navigate to the add plant page
  };
  
  return (
    <div className="container">
      <h5 className="text-center">List Of Utility System</h5>
      <div className="d-flex justify-content-end mb-1">
        <span className="btn btn-sm btn-outline-primary" onClick={handleAddClick}>
          <IoMdAdd />
        </span>
      </div>
      <div className="border shadow-sm rounded bg-light " style={{ height: "500px", marginBottom: "20px", overflowY: 'auto' }}>
        {loggerPlantsListGroup && loggerPlantsListGroup.length > 0 ? (
          <table  className="table  table-bordered table-striped text-center list-table">
            <thead>
              <tr>
                <th>SN</th>
                <th>Plant ID</th>
                <th>Alter Plant ID</th>
                <th>Group</th>
                <th>User</th>
                <th>Updated At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loggerPlantsListGroup.map((plant, index) => (
                <tr key={plant.id}>
                  <td>{index + 1}</td>
                  <td>
                    {editState.editingIndex === index ? (
                      <input
                        type="text"
                        name="plant_id"
                        value={editState.originalValues.plant_id}
                        onChange={(e) => handleInputChange('plant_id', e.target.value)}
                      />
                    ) : (
                      plant.plant_id
                    )}
                  </td>
                  <td>
                    {editState.editingIndex === index ? (
                      <input
                        type="text"
                        name="alter_plant_id"
                        value={editState.originalValues.alter_plant_id || ''}
                        onChange={(e) => handleInputChange('alter_plant_id', e.target.value)}
                      />
                    ) : (
                      plant.alter_plant_id || 'N/A'
                    )}
                  </td>
                  <td>
                    {editState.editingIndex === index ? (
                      <select
                        name="group"
                        value={editState.originalValues.group} // This will hold the group ID
                        onChange={(e) => handleInputChange('group', e.target.value)}
                      >
                        {loggerPlantsGroup.map((group) => (
                          <option key={group.id} value={group.id}>  {/* Pass the group ID */}
                            {group.group_name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      // Display group name based on group ID
                      loggerPlantsGroup.find(group => group.id === plant.group)?.group_name || 'N/A'
                    )}
                  </td>
                  <td>{plant.user}</td>
                  <td>{new Date(plant.updated_at).toLocaleString()}</td>
                  <td>
                  {editState.editingIndex === index ? (
                      <GrUpdate onClick={() => handleSave(index, plant.id)} />
                    ) : (
                      <MdEdit onClick={() => handleEdit(index, plant)} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No plant data available</p>
        )}
      </div>
    </div>
  );
}
