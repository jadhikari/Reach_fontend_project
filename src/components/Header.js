import React, { useEffect, useState, useCallback } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../assets/logo.png';
import Logout from '../assets/logout.png';

export const Header = ({ refreshTrigger }) => {
  const [userName, setUserName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const checkTokenAndFetchDetails = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true);
        const response = await axios.get(`${baseUrl}/user/me/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setUserName(response.data.name);
      } else {
        setIsLoggedIn(false);
      }
    } catch (err) {
      console.error('Failed to fetch user details:', err);
      setIsLoggedIn(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    checkTokenAndFetchDetails();
  }, [checkTokenAndFetchDetails, refreshTrigger]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post(`${baseUrl}/user/logout/`, {}, {
          headers: { Authorization: `Token ${token}` },
        });
      }
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      navigate('/login');
      window.location.reload();
    } catch (err) {
      console.error('Logout failed:', err.response?.data || err.message);
    }
  };

  return (
    <Navbar className="header fixed-top d-flex justify-content-between">
      <Navbar.Brand>
        <img src={Logo} alt="Logo" />
      </Navbar.Brand>
      <Nav className="ml-auto d-flex align-items-center">
        {isLoggedIn && (
          <>
            <span style={{ marginRight: '10px' }}>{userName}</span>
            <img
              src={Logout}
              alt="Logout"
              style={{ height: '30px', marginRight: '5px', cursor: 'pointer' }}
              onClick={handleLogout}
            />
          </>
        )}
      </Nav>
    </Navbar>
  );
};
