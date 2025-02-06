import React, { useState } from "react";
import { useTitle, useAddPowerGen } from "../../hooks";
import { FaFileExcel } from "react-icons/fa";

export const AddPowerGen = () => {

    const title = "Add Power Gen"
    useTitle(title);

    const [selectedFile, setSelectedFile] = useState(null);
    const { missingLoggers, readExcelFile, successfulPosts, unsuccessfulPosts } = useAddPowerGen();

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
                <h5 className="mb-4">Add Power Generation Of Logger Via File.</h5>

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
                        href="/files/power_gen_manually_add.xlsx"
                        download="power_gen_manually_add.xlsx"
                    >
                        <button type="button" className="btn btn-sm btn-success">
                            <FaFileExcel />
                        </button>
                    </a>
                </div>
                <div className="d-flex align-items-center">
                    <span className="me-2 text-danger">*Note:- The logger_name must match the exact name listed in the system, and the date format in the Excel file should be set to the default format of MM/DD/YYYY.</span>
                </div>
            </div>
            <br />
            {missingLoggers.length > 0 && (
                <div>
                    <h6>Non-valid Logger Name In Database:</h6>
                    <pre>{JSON.stringify(missingLoggers, null, 2)}</pre>
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
