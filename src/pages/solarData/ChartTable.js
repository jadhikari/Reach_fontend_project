import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    BarController,
    LineController,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { format } from 'date-fns';

// Register required controllers and elements
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    BarController,
    LineController
);

const MixedChartForLogger = ({ loggerName, loggerData }) => {
    const chartData = {
        labels: loggerData.map((item) => format(new Date(item.date), 'MM/dd')),
        datasets: [
            {
                type: 'bar',
                label: 'Current',
                data: loggerData.map((item) => item.currentPower || 0),
                backgroundColor: 'rgba(75, 192, 192, 0.8)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
            {
                type: 'line',
                label: 'Last Month',
                data: loggerData.map((item) => item.lastMonthPower || 0),
                backgroundColor: 'rgba(153, 102, 255, 1)',
                borderColor: 'rgba(153, 102, 255, 1)',
                tension: 0.4,
            },
            {
                type: 'line',
                label: 'Year-Ago Month',
                data: loggerData.map((item) => item.prevYearPower || 0),
                backgroundColor: 'rgba(255, 159, 64, 1)',
                borderColor: 'rgba(255, 159, 64, 1)',
                tension: 0.4,
            },
            {
                type: 'line',
                label: 'Year-Ago Month Average',
                data: loggerData.map((item) => item.averagePowerGen || 0),
                backgroundColor: 'rgb(2, 250, 35)',
                borderColor: 'rgb(2, 250, 35)',
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Power Generation (kW)',
                },
            },
        },
    };

    return (
        <div style={{ width: '100%', maxWidth: '600px', height: '300px', margin: '0 auto' }}>
            <Chart type="bar" data={chartData} options={options} />
        </div>
    );
};

const ChartTable = ({
    currentMonthsData = {},
    previousYearSameMonthData = {},
    sameYearLastMonthData = {},
}) => {
    const loggerNames = Object.keys(currentMonthsData);

    const mergedDataByLogger = loggerNames.reduce((acc, loggerName) => {
        const currentData = currentMonthsData[loggerName] || [];
        const previousYearData = previousYearSameMonthData[loggerName] || [];
        const lastMonthData = sameYearLastMonthData[loggerName] || [];

        const totalPowerGen = previousYearData.reduce(
            (sum, row) => sum + parseFloat(row.power_gen),
            0
        );
        const numberOfRows = previousYearData.length;
        const averagePowerGen = numberOfRows > 0 ? totalPowerGen / numberOfRows : 0;

        const previousYearMap = new Map(
            previousYearData.map((d) => [new Date(d.date).getDate(), parseFloat(d.power_gen)])
        );
        const lastMonthMap = new Map(
            lastMonthData.map((d) => [new Date(d.date).getDate(), parseFloat(d.power_gen)])
        );

        const mergedData = currentData.map((item) => {
            const currentDate = new Date(item.date);
            const dayOfMonth = currentDate.getDate();

            return {
                date: `${currentDate.getMonth() + 1}/${dayOfMonth}/${currentDate.getFullYear()}`,
                loggerName,
                currentPower: parseFloat(item.power_gen),
                lastMonthPower: lastMonthMap.get(dayOfMonth) || null,
                prevYearPower: previousYearMap.get(dayOfMonth) || null,
                averagePowerGen: averagePowerGen.toFixed(2) || null,
            };
        });

        acc[loggerName] = mergedData;
        return acc;
    }, {});

    const styles = {
        tableContainer: {
            borderRadius: '8px',
            backgroundColor: '#f9f9f9',
            margin: '20px auto',
            padding: '10px',
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
        },
        th: {
            border: '1px solid #ddd',
            backgroundColor: '#afd1f3',
            padding: '10px',
            textAlign: 'center',
        },
        td: {
            border: '1px solid #ddd',
            padding: '10px',
            textAlign: 'center',
            verticalAlign: 'middle',
        },
    };

    return (
        <div style={styles.tableContainer} className='table-bordered'>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>SN</th>
                        <th style={styles.th}>Logger Name</th>
                        <th style={styles.th}>Graph</th>
                        <th style={{ ...styles.th, width: '300px' }} colSpan="2">
                            Summary
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(mergedDataByLogger).map((loggerName, index) => (
                        <tr key={loggerName}>
                            <td style={styles.td}>{index + 1}</td>
                            <td style={styles.td}>{loggerName}</td>
                            <td style={styles.td}>
                                <MixedChartForLogger
                                    loggerName={loggerName}
                                    loggerData={mergedDataByLogger[loggerName]}
                                />
                            </td>
                            <td style={{ ...styles.td, width: '300px' }} colSpan="2"></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ChartTable;
