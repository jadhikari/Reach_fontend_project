import React, { useState } from "react";
import { useTitle, useAddMonthlyExpenses } from "../../../hooks";
import { FaFileExcel } from "react-icons/fa";

export const AddMonthlyExpenses = ({ apiEndPoint }) => {

    const title = "Add Monthly Expenses"
    useTitle(title);

    const [selectedFile, setSelectedFile] = useState(null);
    const { missingPlants, readExcelFile, successfulPosts, unsuccessfulPosts } = useAddMonthlyExpenses(apiEndPoint);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleFileUpload = () => {
        if (!selectedFile) {
            alert("Please select an Excel file to upload.");
            return;
        }
        
        readExcelFile(selectedFile);
    };

    const handleFileReset = () => {
        // Clear the selected file and reset the input
        setSelectedFile(null);
        document.getElementById("fileInput").value = null; // Reset the file input field
    };

    return (
        <div>
            <div>
                <h5 className="mb-4">Add Monthly Expenses</h5>

                {/* Browse input, Add / Upload, and Reset button on the same line  */}
                <div className="d-flex align-items-center mb-3">
                    <label className="form-label me-2 mb-0">
                        <h6 className="mb-0">Browse:</h6>
                    </label>
                    <input
                        id="fileInput"
                        type="file"
                        accept=".xlsx"
                        onChange={handleFileChange}
                        className="form-control w-auto me-2"
                    />
                    <button type="button" onClick={handleFileUpload} className="btn btn-sm btn-primary me-2">
                        Add / Upload
                    </button>
                    <button type="button" onClick={handleFileReset} className="btn btn-sm btn-secondary">
                        Reset
                    </button>
                </div>

                {/* Download sample button with text */}
                <div className="d-flex align-items-center">
                    <span className="me-2">Download sample:</span>
                    <a
                        href="/files/add_monthly_expenses.xlsx"
                        download="add_monthly_expenses.xlsx"
                    >
                        <button type="button" className="btn btn-sm btn-success">
                            <FaFileExcel />
                        </button>
                    </a>
                </div>
                <div className="d-flex flex-column align-items-start">
                  <span className="mb-2 text-danger">
                    Note:- *The system id must match the exact name listed in the system.*
                  </span>
                  <span className="text-danger" style={{ marginLeft: '6ch' }}>
                  *Do not include the start and end data on the excel file.*
                  </span>
                </div>
            </div>
            <br />
            {missingPlants.length > 0 && (
                <div>
                    <h6>Non-valid Logger Name In Database:</h6>
                    <pre>{JSON.stringify(missingPlants, null, 2)}</pre>
                </div>
            )}

            {successfulPosts.length > 0 && (
                <div>
                    <h6>Successful Added:</h6>
                    <pre>{JSON.stringify(successfulPosts, null, 2)}</pre>
                </div>
            )}

            {unsuccessfulPosts.length > 0 && (
                <div>
                    <h6>Unsuccessful To Add:</h6>
                    <pre>{JSON.stringify(unsuccessfulPosts, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};
