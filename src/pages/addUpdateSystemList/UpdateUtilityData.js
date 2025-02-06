import React, { useState } from 'react';
import { useTitle } from "../../hooks";

import { UpdateDailyProductions, UpdateMonthlyExpenses, UpdateMonthlyRevenues } from './updateUtilityDataList';


export const UpdateUtilityData = () => {

  const title = "Update Utility data"
  useTitle(title);

  
  const [selectedComponent, setSelectedComponent] = useState('');

  const handleSelectChange = (event) => {
    setSelectedComponent(event.target.value);
  };


  return (
    <div>
      <div className=" p-1 border shadow-sm rounded bg-light" style={{ width: '99%', height: "50px" }}>
        <div className="d-flex align-items-center">
          <label htmlFor="componentSelect" className="form-label me-2 mb-0">
            <h6 className="mb-0">Update utility data for:</h6>
          </label>
          <select
            id="componentSelect"
            value={selectedComponent}
            onChange={handleSelectChange}
            className="form-select w-auto"
          >
            <option value="">Select an option</option>
            <option value="UpdateDailyProductions">Daily Productions </option>
            <option value="UpdateMonthlyRevenues">Monthly Revenues </option>
            <option value="UpdateMonthlyExpenses">Monthly Expenses </option>
          </select>
        </div>
      </div>

      {/* Conditionally apply className */}
      <div
        className={
          selectedComponent
            ? "mt-2 border shadow-sm rounded bg-light ms-3 p-2"
            : ""
        }
        style={{width: '98%'}}
      >
        {selectedComponent === 'UpdateDailyProductions' && <UpdateDailyProductions apiEndPoint="utility-daily-production" />}
        {selectedComponent === 'UpdateMonthlyRevenues' && <UpdateMonthlyRevenues apiEndPoint="utility-monthly-revenue"/>}
        {selectedComponent === 'UpdateMonthlyExpenses' && <UpdateMonthlyExpenses apiEndPoint="utility-monthly-expense"/>}
      </div>

    </div>
  );
};
