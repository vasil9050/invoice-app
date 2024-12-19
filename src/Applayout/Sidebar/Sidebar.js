import React from 'react';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  // Logout functionality
  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'scroll initial' }}>
      <CDBSidebar textColor="#fff" backgroundColor="#333">
        <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
          <a href="/" className="text-decoration-none" style={{ color: 'inherit' }}>
            Admin
          </a>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'activeClicked' : 'menuItem')}
            >
              <CDBSidebarMenuItem icon="columns">Product</CDBSidebarMenuItem>
            </NavLink>
            <NavLink
              to="/invoice"
              className={({ isActive }) => (isActive ? 'activeClicked' : 'menuItem')}
            >
              <CDBSidebarMenuItem icon="table">Invoice</CDBSidebarMenuItem>
            </NavLink>
          </CDBSidebarMenu>
        </CDBSidebarContent>

        <CDBSidebarFooter style={{ textAlign: 'center' }}>
          <div
            style={{
              padding: '20px 5px',
            }}
          >
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </CDBSidebarFooter>
      </CDBSidebar>
    </div>
  );
};

export default Sidebar;