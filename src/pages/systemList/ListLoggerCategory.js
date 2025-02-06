import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTitle, useLoggersPlantsGroup, useEditData } from '../../hooks';
import { FaStar } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";
import { MdEdit } from 'react-icons/md';
import { GrUpdate } from 'react-icons/gr';

export function ListLoggerCategory({ apiEndPoint, title }) {
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
    navigate('/add-logger-category'); // Navigate to the add plant page
  };

  return (
    <div className="container">
      <h5 className="text-center">List Of Loggers</h5>
      <div className="d-flex justify-content-end mb-1">
        <span className="btn btn-sm btn-outline-primary" onClick={handleAddClick}>
          <IoMdAdd />
        </span>
      </div>
      <div className="border shadow-sm rounded bg-light " style={{ height: "500px", marginBottom: "20px", overflowY: 'auto' }}>
        {loggerPlantsListGroup && loggerPlantsListGroup.length > 0 ? (
          <table className="table  table-bordered table-striped text-center list-table">
            <thead>
              <tr>
                <th>SN</th>
                <th>Logger Name</th>
                <th>Alter Plant ID</th>
                <th>Group</th>
                <th>Status</th>
                <th>User</th>
                <th>Updated At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loggerPlantsListGroup.map((logger, index) => (
                <tr key={logger.id}>
                  <td>{index + 1}</td>
                  <td>
                    {editState.editingIndex === index ? (
                      <input
                        type="text"
                        name="logger_name"
                        value={editState.originalValues.logger_name}
                        onChange={(e) => handleInputChange('logger_name', e.target.value)}
                      />
                    ) : (
                      logger.logger_name
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
                      logger.alter_plant_id || 'N/A'
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
                      loggerPlantsGroup.find(group => group.id === logger.group)?.group_name || 'N/A'
                    )}
                  </td>
                  <td>
                    {editState.editingIndex === index ? (
                      <select
                        name="status"
                        value={editState.originalValues.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                      >
                        <option value={true}>Active</option>
                        <option value={false}>Inactive</option>
                      </select>
                    ) : (
                      <FaStar style={{ color: logger.status ? 'green' : 'red' }} />
                    )}
                  </td>
                  <td>{logger.user}</td>
                  <td>{new Date(logger.updated_at).toLocaleString()}</td>
                  <td>
                    {editState.editingIndex === index ? (
                      <GrUpdate onClick={() => handleSave(index, logger.id)} />
                    ) : (
                      <MdEdit onClick={() => handleEdit(index, logger)} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No logger data available</p>
        )}
      </div>
    </div>
  );
}
