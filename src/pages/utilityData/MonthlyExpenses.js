import React, { useState, useEffect, useCallback } from 'react';
import { SearchBox } from './';
import { usePlantList, useLoggersPlantsGroup, useUtilityData } from '../../hooks';


export function MonthlyExpenses({ apiEndPoint }) {

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

  const downloadCSV = () => {
    if (!data || data.length === 0) {
      alert("No data available to download.");
      return;
    }

    // Define headers and map the data
    const headers = ["ID", "Plant ID", "Used Electricity(kwh)", "Used Amount(jpy)", "Tax(jpy)"];
    const rows = data.map(item => [
      item.id,
      item.plant_id,
      item.used_electricity_kwh,
      item.used_amount_jpy,
      item.tax_jpy,
    ]);

    // Convert rows into CSV format
    let csvContent = headers.join(",") + "\n" + rows.map(row => row.join(",")).join("\n");

    // Create a Blob from the CSV and trigger the download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Monthly_Expenses_Data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <h3 className="text-center flex-grow-1 mb-0">Electricity Expenses Data</h3>
        <button className="btn btn-sm btn-primary "  onClick={downloadCSV}>
          <i className="bi bi-file-earmark-spreadsheet"></i> Download
        </button>
      </div>
      
      <table className="table table-striped table-bordered p-2 list-table" style={{textAlign: 'center'}}>
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Plant ID</th>
            <th>Used Electricity (kWh)</th>
            <th>Used Amount (JPY)</th>
            <th>Tax (JPY)</th>
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
                <td>{item.used_electricity_kwh}</td>
                <td>{item.used_amount_jpy}</td>
                <td>{item.tax_jpy}</td>
                <td>{item.rd}</td>
                <td>{item.user}</td>
                <td>{new Date(item.updated_at).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="text-center">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    
  </>
  )
}
