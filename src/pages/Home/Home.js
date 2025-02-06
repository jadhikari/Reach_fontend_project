import React from "react";
import MapComponent from "./MapComponent"; // Import your MapComponent here
import { useTitle, usePlantDetails } from "../../hooks";

export const Home = ({ title }) => {
  useTitle(title);

  const { data, error, loading } = usePlantDetails();

  return (
    <div className="second-content">
      {/* Loading and error handling */}
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}

      {/* Only render content when data is available and there is no loading or error */}
      {!loading && !error && (
        <>
          
          {/* Header with Plants details and Add button aligned */}
            <div className="d-flex justify-content-between align-items-center sticky-part" style={{ width: '98%', marginBottom:"-30px"  }}>
              <h6>Plants details:</h6>
            </div>
          {/* Table container */}
          <div className="mt-4 p-2 border shadow-sm rounded bg-light " style={{ width: '98%', height: "200px", marginBottom: "20px", overflowY: 'auto' }}>
            {data && data.length > 0 ? (
              <table className="table table-sm table-bordered table-striped text-center">
                <thead style={{ position: 'sticky', top: -10}}>
                  <tr >
                    <th style={{backgroundColor: "#afd1f3"}}>Plant Name</th>
                    <th style={{backgroundColor: "#afd1f3"}}>Plant ID</th>
                    <th style={{backgroundColor: "#afd1f3"}}>Group</th>
                    <th style={{backgroundColor: "#afd1f3"}}>Customer Name</th>
                    <th style={{backgroundColor: "#afd1f3"}}>Location</th>
                    <th style={{backgroundColor: "#afd1f3"}}>Capacity</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((plant, index) => (
                    <tr key={index}>
                      <td>{plant.system_name}</td>
                      <td>{plant.system_id}</td>
                      <td>{plant.group_name}</td>
                      <td>{plant.customer_name}</td>
                      <td>{plant.country_name}</td>
                      <td>{plant.capacity_dc} kW</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No plant data available</p>
            )}
          </div>

          {/* Locations section */}
          <h6>Locations:</h6>
          {data && data.length > 0 ? (
            <MapComponent plants={data} />
          ) : (
            <p>No plant data available</p>
          )}
        </>
      )}
      <br />
    </div>
  );
};
