import React, { useState } from 'react';
import { useTitle } from "../../hooks";

import { AddMonthlyRevenues, AddMonthlyExpenses } from './updateUtilityDataList';


export const AddUtilityData = () => {

  const title = "Add Utility data"
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
            <h6 className="mb-0">Add utility data for:</h6>
          </label>
          <select
            id="componentSelect"
            value={selectedComponent}
            onChange={handleSelectChange}
            className="form-select w-auto"
          >
            <option value="">Select an option</option>
            <option value="AddMonthlyRevenues">Monthly Revenues </option>
            <option value="AddMonthlyExpenses">Monthly Expenses </option>
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
        {selectedComponent === 'AddMonthlyRevenues' && <AddMonthlyRevenues apiEndPoint="utility-monthly-revenue" />}
        {selectedComponent === 'AddMonthlyExpenses' && <AddMonthlyExpenses apiEndPoint="utility-monthly-expense"/>}
        
      </div>

    </div>
  );
};
