import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddData, useLoggersPlantsGroup } from '../../../hooks';

export function AddPowerPlantDetails({ apiEndPoint }) {
  const { loggerPlantsGroup } = useLoggersPlantsGroup();
  const [resourceChoices, setResourceChoices] = useState([]);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loadingResources, setLoadingResources] = useState(true);

  const token = localStorage.getItem('token');
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const { savePlantData, loading, error } = useAddData(apiEndPoint);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    system_id: '',
    system_name: '',
    customer_name: '',
    country_name: '',
    resource: '',
    group: '',
    capacity_ac: '',
    capacity_dc: '',
    latitude: '',
    longitude: '',
    altitude: '',
    azimuth: '',
    tilt: '',
    location: ''
  });

  useEffect(() => {
    const fetchResourceChoices = async () => {
      setLoadingResources(true);
      try {
        const response = await fetch(`${baseUrl}/core/power-plant-resource-choices/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });

        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

        const data = await response.json();
        if (data.resource_choices) {
          setResourceChoices(Object.entries(data.resource_choices));
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching resource choices:', error.message);
        setGeneralError('Failed to load resource choices. Please try again.');
      } finally {
        setLoadingResources(false);
      }
    };

    fetchResourceChoices();
  }, [baseUrl, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: ['latitude', 'longitude', 'altitude', 'azimuth', 'tilt', 'capacity_dc', 'capacity_ac'].includes(name)
        ? value === '' ? '' : parseFloat(value) || '' // Ensure numeric fields are parsed correctly
        : value
    }));

    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    setGeneralError('');
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['system_id', 'system_name', 'customer_name', 'country_name', 'resource', 'group', 'capacity_dc', 'latitude', 'longitude', 'altitude', 'azimuth', 'tilt'];

    requiredFields.forEach(field => {
      if (!formData[field]) newErrors[field] = 'This field is required';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const success = await savePlantData(formData);
      if (success) navigate('/list-add', { state: { selectedComponent: 'ListPowerPlantDetails' } });
      else setGeneralError('An error occurred while saving. Please try again.');
    } catch (error) {
      setGeneralError('Unexpected error. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/list-add', { state: { selectedComponent: 'ListPowerPlantDetails' } });
  };

  if (error) {
    console.error("API Error:", error);
  }

  return (
    <div className="container mt-4">
      <div className="sticky-part">
            <h5 className='text-center'>Add New Utility Plants id</h5>
        </div>
      <div className="card shadow-sm">
        <div className="card-body">
          <form>
            <div className="row">
              {[
                { label: 'System ID', name: 'system_id' },
                { label: 'System Name', name: 'system_name' },
                { label: 'Customer Name', name: 'customer_name' },
                { label: 'Country Name', name: 'country_name' },
                { label: 'Location', name: 'location', required: false }
              ].map(({ label, name, required = true }) => (
                <div className="col-md-6 mb-3" key={name}>
                  <label className="form-label">{label} {required && <span className="text-danger">*</span>}</label>
                  <input
                    type="text"
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="form-control"
                  />
                  {errors[name] && <small className="text-danger">{errors[name]}</small>}
                </div>
              ))}

              {/* Group Selection */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Group <span className="text-danger">*</span></label>
                <select name="group" value={formData.group} onChange={handleChange} className="form-control">
                  <option value="">Select Group</option>
                  {loggerPlantsGroup && loggerPlantsGroup.map(group => (
                    <option key={group.id} value={group.id}>{group.group_name}</option>
                  ))}
                </select>
                {errors.group && <small className="text-danger">{errors.group}</small>}
              </div>

              {/* Resource Selection */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Resource <span className="text-danger">*</span></label>
                <select name="resource" value={formData.resource} onChange={handleChange} className="form-control">
                  <option value="">Select Resource</option>
                  {loadingResources ? <option disabled>Loading...</option> : (
                    resourceChoices.map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))
                  )}
                </select>
                {errors.resource && <small className="text-danger">{errors.resource}</small>}
              </div>

              {/* Numeric Fields */}
              {[
                { label: 'Capacity AC (kW)', name: 'capacity_ac', required: false },
                { label: 'Capacity DC (kW)', name: 'capacity_dc' },
                { label: 'Latitude', name: 'latitude' },
                { label: 'Longitude', name: 'longitude' },
                { label: 'Altitude (m)', name: 'altitude' },
                { label: 'Azimuth (°)', name: 'azimuth' },
                { label: 'Tilt (°)', name: 'tilt' }
              ].map(({ label, name, required = true }) => (
                <div className="col-md-6 mb-3" key={name}>
                  <label className="form-label">{label} {required && <span className="text-danger">*</span>}</label>
                  <input type="number" step="0.000001" name={name} value={formData[name]} onChange={handleChange} className="form-control" />
                  {errors[name] && <small className="text-danger">{errors[name]}</small>}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="text-center">
              <button type="button" className="btn btn-primary me-2" onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>

            {generalError && <div className="text-danger text-center mt-3">{generalError}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
