import React, { useState, useEffect, useCallback } from 'react';
import { SearchBox } from './';
import { usePlantList, useLoggersPlantsGroup, useUtilityData } from '../../hooks';

export function DailyProductions({ apiEndPoint }) {
  const [searchParams, setSearchParams] = useState({ formattedDate: '', plantIds: [], groupNames: '' });
  const [plantIds, setPlantIds] = useState([]);
  const [groupNames, setGroupNames] = useState([]);

  // Fetch data from hooks
  const { data, error: utilityError, loading: utilityLoading } = useUtilityData(apiEndPoint, searchParams);
  const { plantsData, error: plantError, loading: plantLoading } = usePlantList();
  const { loggerPlantsGroup, error: groupError, loading: groupLoading } = useLoggersPlantsGroup();

  // Extract group names after the data has been fetched
  useEffect(() => {
    if (loggerPlantsGroup && loggerPlantsGroup.length > 0) {
      const fetchedGroupNames = loggerPlantsGroup.map(group => group.group_name);
      setGroupNames(fetchedGroupNames); // Update the groupNames state
    }
  }, [loggerPlantsGroup]);

  // Extract plant IDs after the data has been fetched
  useEffect(() => {
    if (plantsData && plantsData.length > 0) {
      const fetchedPlantIds = plantsData.map(plant => plant.plant_id);
      setPlantIds(fetchedPlantIds); // Update the plantIds state
    }
  }, [plantsData]);

  // Handle search parameters update
  const handleSearch = useCallback((params) => {
    //console.log('Search params before update:', searchParams); // Log current state
    //console.log('New search params:', params); // Log new params
    setSearchParams(params); // Update the state
  }, []);

  //Handel the download csv file
  const handleDownload = () => {
    // Fetch unique system IDs
    const uniqueSystemIds = [...new Set(data.map(item => item.plant_id))];
    
    // Fetch all unique dates and sort them
    const uniqueDates = [...new Set(data.map(item => new Date(item.production_date).toLocaleDateString()))].sort((a, b) => new Date(a) - new Date(b));

    // Prepare CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add header row
    const headerRow = ["Date", ...uniqueSystemIds].join(",") + "\n";
    csvContent += headerRow;

    // Create rows for each date
    uniqueDates.forEach(date => {
        // Filter data for the current date
        const row = [date];
        uniqueSystemIds.forEach(systemId => {
            const productionData = data.find(item => item.plant_id === systemId && new Date(item.production_date).toLocaleDateString() === date);
            row.push(productionData ? productionData.power_production_kwh : ""); // Add the power production or leave blank
        });
        csvContent += row.join(",") + "\n"; // Append the row to CSV content
    });

    // Encode URI and create a download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "power_production_data.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link); // Clean up
};


  // Handle loading and error states
  if (plantLoading || groupLoading || utilityLoading) return <p>Loading...</p>;
  if (plantError || groupError || utilityError) return <p>Error loading data: {plantError?.message || groupError?.message || utilityError?.message}</p>;


  return (
    <>
      <div className="sticky-sub-part">
        <SearchBox plantIds={plantIds} groupNames={groupNames} onSearch={handleSearch} searchParams={searchParams}/> {/* Pass plantIds and groupNames to SearchBox */}
      </div>
      <div className={"mt-2 border shadow-sm rounded bg-light"} style={{width: '100%'}}>

        <div className="d-flex justify-content-between align-items-center mt-2 mb-1 p-1">
          <h3 className="text-center flex-grow-1 mb-0">Power Production Data</h3>
          <button className="btn btn-sm btn-primary" onClick={handleDownload}>
            <i className="bi bi-file-earmark-spreadsheet"></i> Download
          </button>
        </div>
      
        <table className="table table-striped table-bordered p-2 list-table" style={{textAlign: 'center'}}>
          <thead className="thead-dark">
            <tr>
              <th>ID</th>
              <th>Plant ID</th>
              <th>Power Production (kWh)</th>
              <th>Production Date</th>
              <th>RD</th>
              <th>User</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.plant_id}</td>
                  <td>{item.power_production_kwh}</td>
                  <td>{item.production_date}</td>
                  <td>{item.rd}</td>
                  <td>{item.user}</td>
                  <td>{new Date(item.updated_at).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
    </>
  );
}
