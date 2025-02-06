import React, { useState } from 'react';
import * as XLSX from 'xlsx'; 
import { GisSearchForm } from './GisSearchForm';
import { useGisList, useGetGisData } from '../../hooks';

import { PiMicrosoftExcelLogoFill } from "react-icons/pi";


export function GisData({ apiEndPoint }) {
  const [selectedData, setSelectedData] = useState(null); // Holds the submitted date and system
  const { gisData, error, loading } = useGisList(apiEndPoint, selectedData); // Destructure hook results
  const gisList = useGetGisData(); // Fetch GIS data list

  const handleSearchSubmit = (data) => {
    setSelectedData(data); // Update the state with the submitted form data
  };

  const exportToExcel = () => {
    // Prepare data for export (selecting necessary columns)
    const exportData = gisData.map(item => ({
      'Power Plant Name': item.power_plant_name,
      'Date': item.date,
      'GHI': item.ghi,
      'GTI': item.gti,
      'PV Output': item.pvout,
    }));

    // Get the Power Plant Name from the first entry or a default value
    const powerPlantName = gisData[0]?.power_plant_name || 'gis_data';

    // Create a new workbook
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'GIS Data');

    // Export the Excel file with the Power Plant Name as the filename
    XLSX.writeFile(wb, `${powerPlantName}_gis_data.xlsx`);
  };


  return (
    <div>
      {/* Pass gisListData and handleSearchSubmit as props */}
      <GisSearchForm onSearchSubmit={handleSearchSubmit} gisSystemList={gisList} />

      {/* Show loading state */}
      {loading && <p>Loading data...</p>}

      {/* Show error message */}
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}

      {/* Render GIS data */}
      {gisData && gisData.length > 0 ? (
        <div>
          <h5 className='text-center'>GIS Data</h5>
            
          <div className="d-flex" >
            <PiMicrosoftExcelLogoFill onClick={exportToExcel} style={{ fontSize: '26px' }} class="bi bi-house ms-auto"/>
          </div>
 
            
          
          <table className="table table-bordered text-center th-table">
            <thead>
              <tr>
                <th>Power Plant Name</th>
                <th>Date</th>
                <th>GHI</th>
                <th>GTI</th>
                <th>PV Output</th>
                <th>User</th>
              </tr>
            </thead>
            <tbody>
              {gisData.map((item, index) => (
                <tr key={index}>
                  <td>{item.power_plant_name}</td>
                  <td>{item.date}</td>
                  <td>{item.ghi}</td>
                  <td>{item.gti}</td>
                  <td>{item.pvout}</td>
                  <td>{item.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && <p>No data available.</p> // Show this if not loading and no data
      )}
    </div>
  );
}
