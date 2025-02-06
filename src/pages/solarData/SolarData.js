import React, { Suspense, lazy, useState, useCallback } from 'react';
import { useTitle, useMonthlyData, useNotification, useLoggersPlantsGroup } from "../../hooks";
import { Notification, SearchBox } from './';
import Loading from '../../assets/loading.gif';
import styles from './TableStyles.module.css'; // Import the CSS Module

const ChartTable = lazy(() => import('./ChartTable'));
const DataTable = lazy(() => import('./DataTable'));

export const SolarData = ({ apiEndPoint, title }) => {
    const [searchParams, setSearchParams] = useState({ formattedDate: '', selectedLoggers: [] });

    const {
        currentMonthsData,
        previousYearSameMonthData,
        sameYearLastMonthData,
        error,
        loading,
    } = useMonthlyData(apiEndPoint, searchParams);

    const { loggerNames, missingLoggers, zeroPowerGen, yearMonthDate } = useNotification(apiEndPoint);
    const { loggerPlantsGroup } = useLoggersPlantsGroup();

    const [currentView, setCurrentView] = useState('graph');

    useTitle(title);

    const handleSearch = useCallback((params) => {
        setSearchParams(params);
    }, []);
    // console.log(currentMonthsData)
    return (
        <div className="second-content">
            {loading && (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh',
                    }}
                >
                    <img src={Loading} alt="Loading" />
                </div>
            )}

            {error && <p>Error: {error.message}</p>}

            {!loading && !error && (
                <>
                    <div className="sticky-part">
                        <Notification
                            missingLoggers={missingLoggers}
                            yearMonthDate={yearMonthDate}
                            zeroPowerGen={zeroPowerGen}
                        />

                        <div>
                            <SearchBox
                                loggerNames={loggerNames || []}
                                loggerPlantsGroup={loggerPlantsGroup || []}
                                onSearch={handleSearch}
                                searchParams={searchParams}
                            />
                        </div>

                        <div className={styles.toggleContainer}>
                            <button
                                className={`${styles.toggleButton} ${currentView === 'graph' ? styles.active : ''}`}
                                onClick={() => setCurrentView('graph')}
                            >
                                Graph
                            </button>
                            <button
                                className={`${styles.toggleButton} ${currentView === 'table' ? styles.active : ''}`}
                                onClick={() => setCurrentView('table')}
                            >
                                Table
                            </button>
                        </div>
                    </div>

                    {currentView === 'table' && (
                        <Suspense fallback={<div>Loading table...</div>}>
                            <DataTable currentMonthsData={currentMonthsData} />
                        </Suspense>
                    )}

                    {currentView === 'graph' && (
                        <Suspense fallback={<div>Loading graph...</div>}>
                            <ChartTable
                                currentMonthsData={currentMonthsData}
                                previousYearSameMonthData={previousYearSameMonthData}
                                sameYearLastMonthData={sameYearLastMonthData}
                            />
                        </Suspense>
                    )}
                </>
            )}
        </div>
    );
};
