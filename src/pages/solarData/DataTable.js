import React from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const DataTable = ({ currentMonthsData = [] }) => {
    // console.log('DataTable received data:', currentMonthsData);
    // console.log('Type of currentMonthsData:', typeof currentMonthsData);

    // Validate if currentMonthsData is an array
    if (typeof currentMonthsData === 'object' && !Array.isArray(currentMonthsData)) {
        // Transform object into array of objects
        currentMonthsData = Object.keys(currentMonthsData).map(key => ({
            loggerName: key,
            data: currentMonthsData[key],
        }));
        // console.log('Transformed currentMonthsData:', currentMonthsData);
    }

    const hasCurrentMonthsData = currentMonthsData.length > 0;

    // Extract all unique dates from the data
    const allDates = new Set();
    currentMonthsData.forEach(logger => {
        logger.data.forEach(entry => allDates.add(entry.date));
    });
    const dates = Array.from(allDates).sort(); // Convert Set to sorted array

    // Extract logger names
    const loggerNames = currentMonthsData.map(logger => logger.loggerName);

    // Prepare data for Excel export
    const prepareDataForExcel = () => {
        const headers = ['Logger Name', ...dates];
        const rows = loggerNames.map(loggerName => {
            return [
                loggerName,
                ...dates.map(date => {
                    const logger = currentMonthsData.find(logger => logger.loggerName === loggerName);
                    const dateData = logger?.data.find(entry => entry.date === date);
                    return dateData ? `${dateData.power_gen}` : '—';
                }),
            ];
        });
        return [headers, ...rows];
    };

    const handleExportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Power Generation Data');

        const preparedData = prepareDataForExcel();

        // Add header row
        worksheet.addRow(preparedData[0]);

        // Add data rows
        preparedData.slice(1).forEach(row => worksheet.addRow(row));

        // Save Excel file
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), 'power_generation_data.xlsx');
    };

    return (
        <>
            <button onClick={handleExportToExcel} className="btn btn-sm btn-primary">
                <i className="bi bi-file-earmark-spreadsheet"></i> Download
            </button>
            <div
                className="shadow border pb-3 rounded"
                style={{
                    width: '100%',
                    maxWidth: '90vw',
                    height: '550px',
                    overflow: 'auto',
                    position: 'relative',
                    zIndex: 0,
                }}
            >
                {hasCurrentMonthsData ? (
                    <table className="table table-bordered" style={{ borderCollapse: 'collapse', fontSize: '12px' }}>
                        <thead>
                            <tr>
                                <th style={{ position: 'sticky', backgroundColor: '#afd1f3', textAlign: 'center', padding: 5, minWidth: '150px' }}>
                                    Logger Name
                                </th>
                                {dates.map((date, idx) => (
                                    <th
                                        key={idx}
                                        style={{
                                            position: 'sticky',
                                            top: 0,
                                            backgroundColor: '#afd1f3',
                                            textAlign: 'center',
                                            zIndex: 1,
                                            minWidth: '120px',
                                        }}
                                    >
                                        {date}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loggerNames.map((loggerName, index) => (
                                <tr key={index}>
                                    <td
                                        style={{
                                            position: 'sticky',
                                            left: 0,
                                            backgroundColor: '#afd1f3',
                                            zIndex: 1,
                                            textAlign: 'center',
                                            padding: 3,
                                            minWidth: '150px',
                                        }}
                                    >
                                        {loggerName}
                                    </td>
                                    {dates.map((date, idx) => {
                                        const logger = currentMonthsData.find(logger => logger.loggerName === loggerName);
                                        const dateData = logger?.data.find(entry => entry.date === date);
                                        const renderValue =
                                            dateData && (dateData.power_gen === '' || dateData.power_gen === null)
                                                ? '—'
                                                : dateData && parseFloat(dateData.power_gen) >= 0
                                                ? `${dateData.power_gen} kWh`
                                                : '—';
                                        return (
                                            <td
                                                key={idx}
                                                className="text-center"
                                                style={{
                                                    backgroundColor: renderValue === '—' || renderValue === '0.0000 kWh' ? 'lightcoral' : 'transparent',
                                                    textAlign: 'center',
                                                    minWidth: '120px',
                                                }}
                                            >
                                                {renderValue}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No data available</p>
                )}
            </div>
        </>
    );
};

export default DataTable;
