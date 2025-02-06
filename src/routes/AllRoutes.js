import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Header, Sidebar } from '../components';
import LoginPage from '../pages/loginPage/LoginPage';
import {
  Home,
  SolarData,
  ModifyDataPage,
  UtilityHome,
  CurtailmentHome,
  CurtailmentAdd,
  ListAddHome,
  WeatherHome,
} from '../pages';
import {
  AddPowerPlantDetails,
  AddLoggerPlantGroup,
  AddLoggerCategory,
  AddUtilityPlantId,
} from '../pages/systemList';

import './MainLayout.css';

const AllRoutes = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    checkAuth(); // Run on mount

    window.addEventListener('storage', checkAuth); // Listen for changes in another tab

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const isAuthenticated = useMemo(() => isLoggedIn, [isLoggedIn]);

  if (isLoggedIn === null) {
    return <div>Loading...</div>; // Prevent rendering if login status is unknown
  }

  return (
    <Router>
      <div className="main-layout">
        <Header />
        <div className="content">
          {isAuthenticated && <Sidebar />}
          <main className={`main-content ${!isAuthenticated ? 'full-width' : ''}`}>
            <Routes>
              {/* Redirect to home if already logged in */}
              <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <LoginPage />} />

              {/* Protected Routes */}
              {isAuthenticated ? (
                <>
                  <Route path="/home" element={<Home title="Power Guard - Home" />} />
                  <Route path="/solar-data" element={<SolarData apiEndPoint="logger-power-gen" title="Solar-Data-Graph" />} />
                  <Route path="/add-update" element={<ModifyDataPage />} />
                  <Route path="/utility-data" element={<UtilityHome title="Utility-billing-Data" />} />
                  <Route path="/curtailment-data" element={<CurtailmentHome apiEndPoint="curtailment-event" title="Curtailment-Data" />} />
                  <Route path="/curtailment-add" element={<CurtailmentAdd apiEndPoint="curtailment-event" title="Curtailment-Data-Add" />} />
                  <Route path="/list-add" element={<ListAddHome title="List-Add-data" />} />
                  <Route path="/add-plant-details" element={<AddPowerPlantDetails apiEndPoint="power-plant-detail" />} />
                  <Route path="/add-plant-logger-group" element={<AddLoggerPlantGroup apiEndPoint="loggers-plants-group" />} />
                  <Route path="/add-logger-category" element={<AddLoggerCategory apiEndPoint="loggercategories" />} />
                  <Route path="/add-utility-plant" element={<AddUtilityPlantId apiEndPoint="utility-plants-list" />} />
                  <Route path="/weather-data" element={<WeatherHome title="Weather Data" />} />
                  <Route path="*" element={<Navigate to="/home" />} />
                </>
              ) : (
                <Route path="*" element={<Navigate to="/login" />} />
              )}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default AllRoutes;
