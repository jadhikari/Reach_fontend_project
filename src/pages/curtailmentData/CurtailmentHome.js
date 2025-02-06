import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './CurtailmentHome.css';
import { SearchBox } from '../utilityData/SearchBox';
import { useTitle } from "../../hooks";
import { usePlantList, useLoggersPlantsGroup, useMonthlyCutalData } from '../../hooks';

import { FcAddDatabase } from "react-icons/fc";


export const CurtailmentHome = ({ title, apiEndPoint }) => {
  const navigate = useNavigate();
  useTitle(title);

  const [searchParams, setSearchParams] = useState({ formattedDate: '', plantIds: [], groupNames: '' });
  const [plantIds, setPlantIds] = useState([]);
  const [groupNames, setGroupNames] = useState([]);

  // Fetch data from hooks
  const { data, error: curtailmenError, loading: curtailmenLoading } = useMonthlyCutalData(apiEndPoint, searchParams);
  const { plantsData, error: plantError, loading: plantLoading } = usePlantList();
  const { loggerPlantsGroup, error: groupError, loading: groupLoading } = useLoggersPlantsGroup();

  // Extract group names after the data has been fetched
  useEffect(() => {
    if (loggerPlantsGroup && loggerPlantsGroup.length > 0) {
      const fetchedGroupNames = loggerPlantsGroup.map(group => group.group_name);
      setGroupNames(fetchedGroupNames);
    }
  }, [loggerPlantsGroup]);

  // Extract plant IDs after the data has been fetched
  useEffect(() => {
    if (plantsData && plantsData.length > 0) {
      const fetchedPlantIds = plantsData.map(plant => plant.plant_id);
      setPlantIds(fetchedPlantIds);
    }
  }, [plantsData]);

  // Handle search parameters update
  const handleSearch = useCallback((params) => {
    setSearchParams(params);
  }, []);

  const handleCuttleAddButtonClick = () => {
    navigate('/curtailment-add'); // Navigate to the Curtailmentadd page
  };


  // Extract unique dates and plant IDs for dynamic table columns
  const uniqueDates = [...new Set(data.map(item => item.date))].sort();
  const uniquePlantIds = [...new Set(data.map(item => item.plant_id))];

  // Transform data into a nested structure for easier rendering
  const tableData = uniquePlantIds.map(plantId => {
    const plantData = { plant_id: plantId };
    uniqueDates.forEach(date => {
      const entry = data.find(item => item.plant_id === plantId && item.date === date);
      plantData[date] = entry ? { start_time: entry.start_time, end_time: entry.end_time, user: entry.user, created_at: entry.created_at, updated_at: entry.updated_at } : {};
    });
    return plantData;
  });

  // Handle loading and error states
  if (plantLoading || groupLoading || curtailmenLoading) return <p>Loading...</p>;
  if (plantError || groupError || curtailmenError) return <p>Error loading data: {plantError?.message || groupError?.message || curtailmenError?.message}</p>;


  // Function to convert table data to CSV
  const downloadCSV = () => {
    // Create headers with 'start time' and 'end time' for each date
    const headers = ['Plant ID', ...uniqueDates.flatMap(date => [
      `${date} start time`, `${date} end time`
    ])];

    // Create rows with plant data
    const rows = tableData.map(row => [
      row.plant_id,
      ...uniqueDates.flatMap(date => [
        row[date]?.start_time || '-',
        row[date]?.end_time || '-'
      ])
    ]);

    // Add the end time for the last date
    rows.forEach(row => {
      row.push(row[uniqueDates[uniqueDates.length - 1]]?.end_time || '-');
    });

    // Create CSV content with headers and rows
    let csvContent = headers.join(",") + "\n";
    rows.forEach(row => {
      csvContent += row.join(",") + "\n";
    });

    // Create a downloadable Blob from CSV data
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "curtailment_data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="second-content container-xxl">

      
      
      <div className={"mt-2 ms-3 search-box-wrapper sticky-part"}>
          <h5 className='text-center'>Cutailment Event Data</h5>
          <SearchBox plantIds={plantIds} groupNames={groupNames} onSearch={handleSearch} searchParams={searchParams} />
      </div>

      {/* Add and the download button */}
      <div className="d-flex justify-content-between align-items-center" style={{width: '100%',marginBottom:'-12px'}}>
        <button className="btn btn-sm" style={{ fontSize: '1.5rem', color: 'green', marginLeft: '5px'}} onClick={handleCuttleAddButtonClick}>
          <FcAddDatabase />
        </button>
        <button className="btn btn-sm btn-primary "style={{ marginRight: '2px'}} onClick={downloadCSV}>
          <i className="bi bi-file-earmark-spreadsheet"></i> Download
        </button>
      </div>

      <div className={"table-container mt-2 border shadow-sm rounded bg-light"} style={{width: '100%', height:'100%'}}>
        {data && data.length > 0 ? (
          <table className='table table-sm table-bordered table-striped text-center'>
            <thead>
              <tr>
                <th className="sticky-column" >Plant ID</th>
                {uniqueDates.map(date => (
                  <th key={date} colSpan="2" className="date-header">{date}</th>
                ))}
              </tr>
              <tr>
                <th className="sticky-column"></th>
                {uniqueDates.map(date => (
                  <React.Fragment key={date}>
                    <th>Start Time</th>
                    <th>End Time</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td className="sticky-column">{row.plant_id}</td>
                  {uniqueDates.map(date => (
                    <React.Fragment key={date}>
                      <td>{row[date]?.start_time || '-'}</td>
                      <td>{row[date]?.end_time || '-'}</td>
                    </React.Fragment>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No data available</p>
        )}
      </div>
    </div>
  );
};
