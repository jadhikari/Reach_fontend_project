import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTitle, useEditData } from '../../hooks';
import { MdEdit } from "react-icons/md";
import { GrUpdate } from "react-icons/gr";
import { IoMdAdd } from "react-icons/io";

export function ListLoggerPlantGroup({ apiEndPoint, title }) {
  const navigate = useNavigate();
  useTitle(title);
  const {
    listData: loggerPlantsListGroup,
    loading,
    error,
    editState,
    handleEdit,
    handleInputChange,
    handleSave,
  } = useEditData(apiEndPoint);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error.message}</p>;
  // console.log(loggerPlantsListGroup)

  const handleAddClick = () => {
    navigate('/add-plant-logger-group'); // Navigate to the add plant page
  };


  return (
    <div className="container">
      <h5 className="text-center">Group List</h5>
      <div className="d-flex justify-content-end mb-1">
        <span className="btn btn-sm btn-outline-primary" onClick={handleAddClick}>
          <IoMdAdd />
        </span>
      </div>
      <div className="border shadow-sm rounded bg-light " style={{ height: "auto", marginBottom: "20px", overflowY: 'auto' }}>
        {loggerPlantsListGroup && loggerPlantsListGroup.length > 0 ? (
          <table className="table  table-bordered table-striped text-center list-table">
            <thead>
              <tr>
                <th>SN</th>
                <th>Group Name</th>
                <th>User</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loggerPlantsListGroup.map((group, index) => (
                <tr key={group.id}>
                  <td>{index + 1}</td>
                  <td>
                    {editState.editingIndex === index ? (
                      <input
                        type="text"
                        value={editState.originalValues.group_name || group.group_name}
                        onChange={(e) => handleInputChange('group_name', e.target.value)}
                      />
                    ) : (
                      group.group_name || 'N/A'
                    )}
                  </td>
                  <td>{group.user}</td>
                  <td>{new Date(group.created_at).toLocaleString()}</td>
                  <td>{new Date(group.updated_at).toLocaleString()}</td>
                  <td>
                    {editState.editingIndex === index ? (
                      <GrUpdate
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSave(index, group.id)}
                      />
                    ) : (
                      <MdEdit
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleEdit(index, group)}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No system group data available</p>
        )}
      </div>
    </div>
  );
}