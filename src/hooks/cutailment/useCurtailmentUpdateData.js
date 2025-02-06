import axios from "axios";
import { useState, useCallback } from "react";

// Define your constants
const BASE_URL = process.env.REACT_APP_BASE_URL;
const TOKEN = localStorage.getItem('token');
const HEADERS = {
  Authorization: `Token ${TOKEN}`,
  'Content-Type': 'application/json',
};

// Define the hook
export const useCurtailmentUpdateData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to handle updating curtailment data
  const updateCurtailmentData = useCallback(
    async ({ id, date, start_time, end_time, apiEndPoint, selectedPlant, currentStartTime, currentEndTime }) => {
      // //console.log("Update Curtailment Data:");
      // //console.log("ID:", id);
      // //console.log("Date:", date);
      // //console.log("Start Time:", start_time);
      // //console.log("End Time:", end_time);
      // //console.log("API Endpoint:", apiEndPoint);
      // //console.log("Selected Plant:", selectedPlant);

      // Prepare data to update, only if changed
      const dataToUpdate = {};
      if (start_time && start_time !== currentStartTime) {
        dataToUpdate.start_time = start_time;
      }
      if (end_time && end_time !== currentEndTime) {
        dataToUpdate.end_time = end_time;
      }

      // If no changes to update, return early
      if (Object.keys(dataToUpdate).length === 0) {
        ////console.log("No changes to update.");
        return { success: true, message: "No changes to update." };
      }

      const CurtailmentUpdateUrl = `${BASE_URL}/core/${apiEndPoint}/${id}/`;

      setLoading(true);
      setError(null);

      try {
        // Send the update request only with changed fields
        const response = await axios.patch(CurtailmentUpdateUrl, dataToUpdate, { headers: HEADERS });
        //console.log("Curtailment data successfully updated", response.data);
        
        // Return updated data
        return { success: true, id, date, ...dataToUpdate };
      } catch (err) {
        // Handle various error scenarios
        if (err.response) {
          console.error(`Server responded with status ${err.response.status}:`, err.response.data);
        } else if (err.request) {
          console.error("No response received:", err.request);
        } else {
          console.error("Error in setting up the request:", err.message);
        }
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { updateCurtailmentData, loading, error };
};
