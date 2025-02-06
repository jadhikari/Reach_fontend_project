import React, { useState, useEffect } from 'react';
import { useTitle, usePlantList, usePlantCurtailmentEvents } from '../../hooks';
import { CurtailmentPlantSearch } from './CurtailmentPlantSearch';
import { CurtailmentTable } from './CurtailmentTable';

export const CurtailmentAdd = ({ title, apiEndPoint }) => {
  useTitle(title);
  const [plantIds, setPlantIds] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);

  const { plantsData, error: plantError, loading: plantLoading } = usePlantList();
  // Use the custom hook to fetch date entries
  const { data, loading, error } = usePlantCurtailmentEvents(apiEndPoint, selectedPlant);
  //console.log(data)
  useEffect(() => {
    if (plantsData && plantsData.length > 0) {
      const fetchedPlantIds = plantsData.map(plant => plant.plant_id);
      setPlantIds(fetchedPlantIds);
    }
  }, [plantsData]);

  const handleSearch = (plantId) => {
    setSelectedPlant(plantId.selectedPlant || plantId);

    
  };

  

  if (plantLoading) return <p>Loading...</p>;
  if (plantError) return <p>Error loading data: {plantError?.message}</p>;

  return (
    <div className="second-content">
      {/* Curtailment Plant Search */}
      <div className="sticky-part">
        <h5 className="text-center">Add Curtailment Event Data</h5>
        <CurtailmentPlantSearch plantIds={plantIds} onSearch={handleSearch} />
      </div>

      {/* Display Curtailment Table only if data is loaded */}
      {selectedPlant && !loading && !error && (
        <div className="mt-3">
          <CurtailmentTable
            data={data}
            apiEndPoint= {apiEndPoint}
            selectedPlant= {selectedPlant}
          />
        </div>
      )}

      {/* Handle loading and error states */}
      {loading && <p>Loading curtailment events...</p>}
      {error && <p>Error loading curtailment events: {error}</p>}
    </div>
  );
};
