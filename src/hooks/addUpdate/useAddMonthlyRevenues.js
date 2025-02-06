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

//Function to Calculate the Previous Month

const getPreviousMonth = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1); // Set to last month
    return date.toISOString().split("T")[0].slice(0, 7); // Format as YYYY-MM
};

// Define function to post data
const postMonthlyRevenues = async (plant_id, start_date, end_date, sales_electricity_kwh, sales_amount_jpy, tax_jpy, apiEndPoint) => {
//   console.log(`Preparing to post data:`, { plant_id, start_date, end_date, sales_electricity_kwh, sales_amount_jpy, tax_jpy, apiEndPoint });
    const MonthlyRevenuesUrl = `${BASE_URL}/core/${apiEndPoint}/`;

    const MonthlyRevenuesData = {
        plant_id: plant_id,
        contract_id:'',
        start_date: start_date,
        end_date: end_date, 
        sales_electricity_kwh: sales_electricity_kwh,
        sales_amount_jpy: sales_amount_jpy,
        tax_jpy: tax_jpy, 
        average_daily_sales_kwh:'',
        rd: getPreviousMonth(),

    };

    try {
        await axios.post(MonthlyRevenuesUrl, MonthlyRevenuesData, { headers: HEADERS });
        //console.log('Logger Power Generation Response:', response.data);
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
export const useAddMonthlyRevenues = (apiEndPoint) => {
    
    const [excelData, setExcelData] = useState([]);
    const [missingPlants, setMissingPlants] = useState([]);
    const [nonMissingPlants, setNonMissingPlants] = useState([]);
    const [postResults, setPostResults] = useState([]);

    const { plantsData } = usePlantList();
    

    const convertExcelDate = (excelDate) => {
        const date = new Date((excelDate - 25569) * 86400 * 1000);
        return date.toISOString().split("T")[0];
    };


    const readExcelFile = (file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const binaryStr = event.target.result;
            const workbook = XLSX.read(binaryStr, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            let data = XLSX.utils.sheet_to_json(worksheet);

            data = data.map((row) => {
                if (row.start_date && !isNaN(row.start_date)) {
                    row.start_date = convertExcelDate(row.start_date);
                }
                if (row.end_date && !isNaN(row.end_date)) {
                    row.end_date = convertExcelDate(row.end_date);
                }
                row.status = false; // Manually set status to false
                return row;
            });
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
                plant.start_date,
                plant.end_date,
                plant.sales_electricity_kwh,
                plant.sales_amount_jpy,
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
