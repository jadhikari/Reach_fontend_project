// Function (postDailyPowerGeneration):
// Purpose: Sends POST requests to upload daily power generation data.
// Parameters: loggerName, powerGen, date.
// Behavior: Constructs data payload and handles API response (success or error).
// Hook (useAddPowerGen):

// State Variables:
// excelData: Stores parsed data from an Excel file.
// missingLoggers and nonMissingLoggers: Lists of loggers categorized as missing or present.
// postResults: Results from data posting attempts.

// Dependencies:
// loggerNames: List of valid logger names from a useNotification hook.

// Helper Functions:
// convertExcelDate: Converts Excel date to ISO format.
// readExcelFile: Reads and parses Excel data.
// validateLoggers: Compares Excel data with valid logger names.
// postNonMissingData: Posts data for present loggers.

// Effects:
// First Effect: Validates loggers when excelData or loggerNames change.
// Second Effect: Posts data for non-missing loggers when nonMissingLoggers changes.
// Return Values:
// Provides parsed data, functions to read and validate Excel data, and results of the posting process.

import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import * as XLSX from "xlsx";
import { useNotification } from "../index";

// Define your constants
const BASE_URL = process.env.REACT_APP_BASE_URL;
const TOKEN = localStorage.getItem('token');
const HEADERS = {
  Authorization: `Token ${TOKEN}`,
  'Content-Type': 'application/json',
};

// Define function to post data
const postDailyPowerGeneration = async (loggerName, powerGen, date, status) => {
  //console.log(`Preparing to post data:`, { loggerName, powerGen, date });
  const loggerPowerGenUrl = `${BASE_URL}/core/logger-power-gen/`;

  const loggerPowerGenData = {
    logger_name: loggerName,
    power_gen: powerGen,
    date: date, 
    status: status
  };

  try {
    await axios.post(loggerPowerGenUrl, loggerPowerGenData, { headers: HEADERS });
    //console.log('Logger Power Generation Response:', response.data);
    return { loggerName, success: true };
  } catch (error) {
    if (error.response) {
      console.error(`Server responded with status ${error.response.status}: ${error.response.data}`);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error in setting up the request:', error.message);
    }
    return { loggerName, success: false, error: error.message };
  }
};

// Hook for handling the Excel data
export const useAddPowerGen = () => {
    const apiEndPoint = "logger-power-gen";
    
    const [excelData, setExcelData] = useState([]);
    const [missingLoggers, setMissingLoggers] = useState([]);
    const [nonMissingLoggers, setNonMissingLoggers] = useState([]);
    const [postResults, setPostResults] = useState([]);

    const { loggerNames } = useNotification(apiEndPoint);

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
                if (row.date && !isNaN(row.date)) {
                    row.date = convertExcelDate(row.date);
                }
                row.status = false; // Manually set status to false
                return row;
            });
            setExcelData(data);
        };
        reader.readAsBinaryString(file);
    };

    const validateLoggers = useCallback(() => {
        if (excelData.length === 0 || loggerNames.length === 0) {
            console.warn("No data to validate. Please ensure both excelData and loggerNames are loaded.");
            return;
        }

        const missingLoggersList = [];
        const nonMissingLoggersList = [];

        excelData.forEach((row) => {
            if (loggerNames.includes(row.logger_name)) {
                nonMissingLoggersList.push(row);
            } else {
                missingLoggersList.push(row);
            }
        });

        setMissingLoggers(missingLoggersList);
        setNonMissingLoggers(nonMissingLoggersList);
    }, [excelData, loggerNames]);

    const postNonMissingData = useCallback(async () => {
        if (nonMissingLoggers.length === 0) {
            console.warn("No non-missing loggers to post.");
            return;
        }

        const results = [];

        for (const logger of nonMissingLoggers) {
            const result = await postDailyPowerGeneration(logger.logger_name, logger.power_gen, logger.date, logger.status);
            results.push(result);
        }

        // for (const logger of nonMissingLoggers) {
        //     const result = await postDailyPowerGeneration({
        //         logger_name: logger.logger_name.id, // Assuming you are getting an ID from logger
        //         power_gen: logger.power_gen,
        //         date: logger.date,
        //         status: false // Manually setting status to false
        //     });
        //     results.push(result);
        // }

        setPostResults(results);
    }, [nonMissingLoggers]);

    useEffect(() => {
        if (excelData.length > 0 && loggerNames.length > 0) {
            validateLoggers();
        }
    }, [excelData, loggerNames, validateLoggers]);

    useEffect(() => {
        if (nonMissingLoggers.length > 0) {
            postNonMissingData();
        }
    }, [nonMissingLoggers, postNonMissingData]);

    const successfulPosts = postResults.filter(result => result.success);
    const unsuccessfulPosts = postResults.filter(result => !result.success);

    return {
        excelData, 
        readExcelFile, 
        validateLoggers, 
        missingLoggers, 
        nonMissingLoggers, 
        successfulPosts, 
        unsuccessfulPosts
    };
};
