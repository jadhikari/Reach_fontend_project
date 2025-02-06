import axios from "axios";
import { useCallback } from "react";

// Define your constants
const BASE_URL = process.env.REACT_APP_BASE_URL;
const TOKEN = localStorage.getItem('token');
const HEADERS = {
  Authorization: `Token ${TOKEN}`,
  'Content-Type': 'application/json',
};

// Function to calculate the previous month
const getPreviousMonth = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 1); // Set to last month
  return date.toISOString().split("T")[0].slice(0, 7); // Format as YYYY-MM
};

// Define the hook
export const useCurtailmentAddData = () => {
  // Define the function to add curtailment data
  const addCurtailmentData = useCallback(
    async ({ date, start_time, end_time, apiEndPoint, selectedPlant }) => {
      // console.log("Add Curtailment Data:");
      // console.log("Date:", date);
      // console.log("Start Time:", start_time);
      // console.log("End Time:", end_time);
      // console.log("API Endpoint:", apiEndPoint);
      // console.log("Selected Plant:", selectedPlant);

      const CurtailmentAddUrl = `${BASE_URL}/core/${apiEndPoint}/`;
      const CurtailmentAddData = {
        plant_id: selectedPlant,
        date: date,
        start_time: start_time,
        end_time: end_time,
        rd: getPreviousMonth(),
      };

      try {
        await axios.post(CurtailmentAddUrl, CurtailmentAddData, { headers: HEADERS });
        //console.log("Curtailment data successfully added");
        return { selectedPlant, success: true };
      } catch (error) {
        if (error.response) {
          console.error(`Server responded with status ${error.response.status}: ${error.response.data}`);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error in setting up the request:", error.message);
        }
        return { selectedPlant, success: false, error: error.message };
      }
    },
    []
  );

  return { addCurtailmentData };
};
