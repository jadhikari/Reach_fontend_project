import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useLocation } from 'react-router-dom';

import { FaHome, FaBars } from 'react-icons/fa';
import { PiSolarPanelFill } from "react-icons/pi";
import { MdBrowserUpdated } from "react-icons/md";
import { LuUtilityPole } from "react-icons/lu";
import { RiScissorsCutFill } from "react-icons/ri";
import { GiSolarSystem } from "react-icons/gi";
import { TiWeatherPartlySunny } from "react-icons/ti";




export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation(); // Get the current location
  const activeKey = location.pathname; // Get the current path

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        <FaBars />
      </div>
      <Nav className="flex-column">
        
        <LinkContainer to="/home">
          <Nav.Link eventKey="/home" className={`nav-item ${activeKey === '/home' ? 'active' : ''}`}>
            <FaHome className="nav-icon" />
            {!collapsed && <span>Home</span>}
          </Nav.Link>
        </LinkContainer>

        <LinkContainer to="/list-add">
          <Nav.Link eventKey="/list-add" className={`nav-item ${activeKey === '/list-add' ? 'active' : ''}`}>
            <GiSolarSystem className="nav-icon" />
            {!collapsed && <span>System list</span>}
          </Nav.Link>
        </LinkContainer>

        <LinkContainer to="/solar-data">
          <Nav.Link eventKey="/solar-data" className={`nav-item ${activeKey === '/solar-data' ? 'active' : ''}`}>
            <PiSolarPanelFill className="nav-icon" />
            {!collapsed && <span>Solar Data</span>}
          </Nav.Link>
        </LinkContainer>

        <LinkContainer to="/utility-data">
          <Nav.Link eventKey="/utility-data" className={`nav-item ${activeKey === '/utility-data' ? 'active' : ''}`}>
            <LuUtilityPole className="nav-icon" />
            {!collapsed && <span>Utility</span>}
          </Nav.Link>
        </LinkContainer>

        <LinkContainer to="/weather-data">
          <Nav.Link eventKey="/weather-data" className={`nav-item ${activeKey === '/weather-data' ? 'active' : ''}`}>
            <TiWeatherPartlySunny className="nav-icon" />
            {!collapsed && <span>Weather Data</span>}
          </Nav.Link>
        </LinkContainer>

        <LinkContainer to="/add-update">
          <Nav.Link eventKey="/add-update" className={`nav-item ${activeKey === '/add-update' ? 'active' : ''}`}>
            <MdBrowserUpdated className="nav-icon" />
            {!collapsed && <span>Add/Update</span>}
          </Nav.Link>
        </LinkContainer>

        <LinkContainer to="/curtailment-data">
          <Nav.Link eventKey="/curtailment-data" className={`nav-item ${activeKey === '/curtailment-data' ? 'active' : ''}`}>
            <RiScissorsCutFill className="nav-icon" />
            {!collapsed && <span>Curtailment</span>}
          </Nav.Link>
        </LinkContainer>

      </Nav>
    </div>
  );
};