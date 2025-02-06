import React, { useState } from 'react';
import {DailyProductions, MonthlyExpenses, MonthlyRevenues } from './index';

import { useTitle } from  "../../hooks";

export function UtilityHome({  title }) {

  //Pass the page title
  useTitle(title);

  const [selectedComponent, setSelectedComponent] = useState('');

  const handleSelectChange = (event) => {
    setSelectedComponent(event.target.value);
  };

  return (
    <div className="second-content">
      <div className="sticky-part">
      <h5 className='text-center'>Utility Billing Page</h5>
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
            <option value="dailyProductions">Daily Productions Data</option>
            <option value="monthlyRevenues">Monthly Revenues Data</option>
            <option value="monthlyExpenses">Monthly Expenses Data</option>
          </select>
        </div>
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
        {selectedComponent === 'dailyProductions' && <DailyProductions apiEndPoint="utility-daily-production" />}
        {selectedComponent === 'monthlyRevenues' && <MonthlyRevenues apiEndPoint="utility-monthly-revenue"/>}
        {selectedComponent === 'monthlyExpenses' && <MonthlyExpenses apiEndPoint="utility-monthly-expense"/>}
      </div>

    </div>
  )
}

