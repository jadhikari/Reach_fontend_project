import React, { useState } from 'react';
import { UpdatePowerGen, AddPowerGen, AddUtilityData, UpdateUtilityData } from './index';

export const ModifyDataPage = () => {
  const [selectedComponent, setSelectedComponent] = useState('');

  const handleSelectChange = (event) => {
    setSelectedComponent(event.target.value);
  };

  return (
    <div className="second-content">
      <div className="sticky-part">
        <h5 className='text-center'>Update Page</h5>
        <div className="mt-2 p-1 border shadow-sm rounded bg-light" style={{  width: '99%', height: "50px" }}>
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
              <option value="updatePowerGen">Update Power Generation Data</option>
              <option value="addPowerGen">Add Power Generation Data</option>
              <option value="updateUtilityData">Update Utility Data</option>
              <option value="addUtilityData">Add Utility Data</option>
            </select>
          </div>
        </div>
      </div>
      

      {/* Conditionally apply className */}
      <div
        className={
          selectedComponent
            ? "mt-2 border shadow-sm rounded bg-light ms-3 p-3"
            : ""
        }
        style={{width: '96%'}}
      >
        {selectedComponent === 'updatePowerGen' && <UpdatePowerGen />}
        {selectedComponent === 'addPowerGen' && <AddPowerGen />}
        {selectedComponent === 'updateUtilityData' && <UpdateUtilityData />}
        {selectedComponent === 'addUtilityData' && <AddUtilityData />}
      </div>
    </div>
  );
};
