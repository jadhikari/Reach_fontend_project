import React, { useState } from 'react';
import { ListUtilityPlantId, ListLoggerCategory, ListPowerPlantDetails, ListLoggerPlantGroup } from './index';
import { useLocation } from 'react-router-dom';

export const ListAddHome = () => {
  const location = useLocation();
  const [selectedComponent, setSelectedComponent] = useState(location.state?.selectedComponent || '');
  
  const handleSelectChange = (event) => {
    setSelectedComponent(event.target.value);
  };

  return (
    <div className="second-content">
      <div className="sticky-part">
        <h5 className='text-center'>Update Page</h5>
        <div className="mt-2 p-1 border shadow-sm rounded bg-light" style={{ width: '99%', height: "50px" }}>
          <div className="d-flex align-items-center">
            <label htmlFor="componentSelect" className="form-label me-2 mb-0">
              <h6 className="mb-0">Select Your Requirement:</h6>
            </label>
            <select
              id="componentSelect"
              value={selectedComponent}
              onChange={handleSelectChange}
              className="form-select w-auto"
            >
              <option value="">Select an option</option>
              <option value="ListPowerPlantDetails">List system for Map and GIS data</option>
              <option value="ListLoggerPlantGroup">List the Group</option>
              <option value="ListUtilityPlantId">List System id for Utility</option>
              <option value="ListLoggerCategory">List of Logger</option>
            </select>
          </div>
        </div>
      </div>

      <div className={selectedComponent ? "mt-2 border shadow-sm rounded bg-light ms-3 p-3" : ""} style={{ width: '96%' }}>
        {selectedComponent === 'ListUtilityPlantId' && <ListUtilityPlantId apiEndPoint="utility-plants-list" title="utility-system" />}
        {selectedComponent === 'ListPowerPlantDetails' && <ListPowerPlantDetails apiEndPoint="power-plant-detail" title="plants-details" />}
        {selectedComponent === 'ListLoggerPlantGroup' && <ListLoggerPlantGroup apiEndPoint="loggers-plants-group" title="system-Group" />}
        {selectedComponent === 'ListLoggerCategory' && <ListLoggerCategory apiEndPoint="loggercategories" title="monitoring-system-list" />}
      </div>
    </div>
  );
};