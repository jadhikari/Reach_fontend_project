import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import * as XLSX from "xlsx";
import { usePlantList } from "../index";

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

// Define function to post data
const postMonthlyRevenues = async (plant_id, used_electricity_kw, used_amount_jpy, tax_jpy, apiEndPoint) => {
    const MonthlyRevenuesUrl = `${BASE_URL}/core/${apiEndPoint}/`;

    const MonthlyRevenuesData = {
        plant_id: plant_id,
        used_electricity_kwh: used_electricity_kw,
        used_amount_jpy: used_amount_jpy,
        tax_jpy: tax_jpy, 
        rd: getPreviousMonth(),
    };

    try {
        await axios.post(MonthlyRevenuesUrl, MonthlyRevenuesData, { headers: HEADERS });
        return { plant_id, success: true };
    } catch (error) {
        if (error.response) {
            console.error(`Server responded with status ${error.response.status}: ${error.response.data}`);
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error in setting up the request:', error.message);
        }
        return { plant_id, success: false, error: error.message };
    }
};

// Hook for handling the Excel data
export const useAddMonthlyExpenses = (apiEndPoint) => {
    const [excelData, setExcelData] = useState([]);
    const [missingPlants, setMissingPlants] = useState([]);
    const [nonMissingPlants, setNonMissingPlants] = useState([]);
    const [postResults, setPostResults] = useState([]);
    const { plantsData } = usePlantList();

    const readExcelFile = (file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const binaryStr = event.target.result;
            const workbook = XLSX.read(binaryStr, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(worksheet);
            setExcelData(data);
        };
        reader.readAsBinaryString(file);
    };

    const validatePlants = useCallback(() => {
        if (excelData.length === 0 || plantsData.length === 0) {
            console.warn("No data to validate. Please ensure both excelData and plantsData are loaded.");
            return;
        }

        // Extract plant_id values from plantsData
        const plantIds = plantsData.map((plant) => plant.plant_id);

        const missingPlantsList = [];
        const nonMissingPlantsList = [];

        excelData.forEach((row) => {
            if (plantIds.includes(row.plant_id)) {
                nonMissingPlantsList.push(row);
            } else {
                missingPlantsList.push(row);
            }
        });

        setMissingPlants(missingPlantsList);
        setNonMissingPlants(nonMissingPlantsList);
    }, [excelData, plantsData]);

    const postNonMissingData = useCallback(async () => {
        if (nonMissingPlants.length === 0) {
            console.warn("No non-missing Plants to post.");
            return;
        }

        const results = [];

        for (const plant of nonMissingPlants) {
            const result = await postMonthlyRevenues(
                plant.plant_id,
                plant.used_electricity_kw,
                plant.used_amount_jpy,
                plant.tax_jpy,
                apiEndPoint 
            );
            results.push(result);
        }

        setPostResults(results);
    }, [nonMissingPlants, apiEndPoint]); 

    useEffect(() => {
        if (excelData.length > 0 && plantsData.length > 0) {
            validatePlants();
        }
    }, [excelData, plantsData, validatePlants]);

    useEffect(() => {
        if (nonMissingPlants.length > 0) {
            postNonMissingData();
        }
    }, [nonMissingPlants, postNonMissingData]);

    const successfulPosts = postResults.filter(result => result.success);
    const unsuccessfulPosts = postResults.filter(result => !result.success);

    return {
        excelData, 
        readExcelFile, 
        validatePlants, 
        missingPlants, 
        nonMissingPlants, 
        successfulPosts, 
        unsuccessfulPosts
    };
};
