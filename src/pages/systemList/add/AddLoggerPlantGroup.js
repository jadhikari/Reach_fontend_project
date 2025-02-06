import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddData } from '../../../hooks';

export function AddLoggerPlantGroup({ apiEndPoint }) {
  const navigate = useNavigate();
  const { savePlantData, loading, error } = useAddData(apiEndPoint);

  const [formData, setFormData] = useState({
    group_name: '',
  });
  const [fieldError, setFieldError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setFieldError(''); // Clear field error on change
  };

  const handleSave = async () => {
    // Validate input before making the API call
    if (!formData.group_name.trim()) {
      setFieldError('Group name is required.');
      return;
    }
    
    const success = await savePlantData(formData);
    if (success) {
      navigate('/list-add', { state: { selectedComponent: 'ListLoggerPlantGroup' } });
    } else {
      setFieldError(error || 'Error saving data'); // Show error if save failed
    }
  };

  const handleCancel = () => {
    navigate('/list-add', { state: { selectedComponent: 'ListLoggerPlantGroup' } });
  };

  return (
    <div className="second-content">
      <div className="sticky-part">
        <h5 className="text-center">Add New Groups For Logers and Utility Plants ID</h5>
      </div>
      
      <div className="mt-2 p-1 border shadow-sm rounded bg-light">
        <div className="mt-3" style={{ maxWidth: '600px', width: '100%', marginLeft: '25%' }}>
          <div className="form-group row mt-2">
            <label className="col-md-4 col-form-label">
              Group Name<span style={{ color: 'red' }}>*</span>
            </label>
            <div className="col-md-8">
              <input
                type="text"
                name="group_name"
                value={formData.group_name}
                onChange={handleChange}
                className="form-control"
                required
              />
              {fieldError && (
                <small className="text-danger">
                  {fieldError}
                </small>
              )}
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
          </div>
        </div>
      </div>
    </div>
  );
}
