import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddData, useLoggersPlantsGroup } from '../../../hooks';

export function AddLoggerCategory({ apiEndPoint }) {
    const { loggerPlantsGroup } = useLoggersPlantsGroup();
    const navigate = useNavigate();
    const { savePlantData, loading, error } = useAddData(apiEndPoint);

    const [formData, setFormData] = useState({
        logger_name: '',
        alter_plant_id: '',
        group: '',
        status: true, // Default status to true
    });

    const [fieldErrors, setFieldErrors] = useState({
        logger_name: '',
        group: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setFieldErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '', // Clear specific field error on change
        }));
    };

    const handleToggleStatus = () => {
        setFormData((prevData) => ({
            ...prevData,
            status: !prevData.status,
        }));
    };

    const handleSave = async () => {
        // Validate required fields before making the API call
        const errors = {};
        if (!formData.logger_name.trim()) errors.logger_name = 'Logger name is required.';
        if (!formData.group) errors.group = 'Group selection is required.';

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        const success = await savePlantData(formData);
        if (success) {
          navigate('/list-add', { state: { selectedComponent: 'ListLoggerCategory' } });
        } else {
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                form: error || 'Error saving data',
            }));
        }
    };

    const handleCancel = () => {
      navigate('/list-add', { state: { selectedComponent: 'ListLoggerCategory' } });
    };

    return (
      <div className="second-content">
        <div className="sticky-part">
          <h5 className="text-center">Add New Logger Category For Solar Data</h5>
        </div>
        
        <div className="mt-2 p-1 border shadow-sm rounded bg-light">
          <div className="mt-3" style={{ maxWidth: '600px', width: '100%', marginLeft: '25%' }}>
            <div className="form-group row mt-2">
                <label className="col-md-4 col-form-label">Logger Name <span style={{ color: 'red' }}>*</span></label>
                <div className="col-md-8">
                  <input
                      type="text"
                      name="logger_name"
                      value={formData.logger_name}
                      onChange={handleChange}
                      className="form-control"
                      required
                  />
                  {fieldErrors.logger_name && (
                    <small className="text-danger">
                      {fieldErrors.logger_name}
                    </small>
                  )}
                </div>
            </div>

            <div className="form-group row mt-2">
                <label className="col-md-4 col-form-label">Alternative Name</label>
                <div className="col-md-8">
                  <input
                      type="text"
                      name="alter_plant_id"
                      value={formData.alter_plant_id}
                      onChange={handleChange}
                      className="form-control"
                  />
                </div>
            </div>

            {/* Group Dropdown */}
            <div className="form-group row mt-2">
                <label className="col-md-4 col-form-label">Group <span style={{ color: 'red' }}>*</span></label>
                <div className="col-md-8">
                  <select
                      name="group"
                      value={formData.group}
                      onChange={handleChange}
                      className="form-control"
                      required
                  >
                      <option value="">Select Group</option>
                      {loggerPlantsGroup && loggerPlantsGroup.map((group) => (
                          <option key={group.id} value={group.id}>
                              {group.group_name}
                          </option>
                      ))}
                  </select>
                  {fieldErrors.group && (
                    <small className="text-danger">
                      {fieldErrors.group}
                    </small>
                  )}
                </div>
            </div>

            {/* Status Toggle */}
            <div className="form-group row mt-2">
                <label className="col-md-4 col-form-label">Status</label>
                <div className="form-check form-switch col-md-8">
                    <input
                        type="checkbox"
                        name="status"
                        checked={formData.status}
                        onChange={handleToggleStatus}
                        className="form-check-input"
                        style={{ transform: 'scale(1.5)', marginLeft: '-12px', marginTop: '12px' }}
                    />
                </div>
            </div>

            {/* Save and Cancel buttons */}
            <div className="text-center mt-3">
              <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </button>&nbsp;&nbsp;
              <button className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
              {fieldErrors.form && (
                <p className="text-danger mt-2">{fieldErrors.form}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
}
