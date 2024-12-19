import { useLocation } from 'react-router-dom';
import AppRoutes from "./AppRoutes";
import SideBar from './Sidebar/Sidebar.js';
import LoginPage from "../Auth/LoginPage.js";
import RegisterPage from "../Auth/RegisterPage.js";
import { PATH_LOGIN, PATH_REGISTER } from "./constants/RouteConstants";

export default function AppLayout() {
  const location = useLocation();

  // Check if the current route is the login or register page
  const isLoginPage = location.pathname === PATH_LOGIN;
  const isRegisterPage = location.pathname === PATH_REGISTER;

  const renderBody = () => {
    return (
      <div style={{ padding: '24px', height: '90vh' }}>
        <AppRoutes />
      </div>
    );
  };

  return (
    <div className="d-flex flex-column vh-100">
      {isLoginPage ? (
        <LoginPage />
      ) : isRegisterPage ? (
        <RegisterPage />
      ) : (
        <>
          <div className="d-flex flex-grow-1">
            <div id="sidebar" className="text-white">
              <SideBar />
            </div>
            <main className="flex-fill overflow-auto" style={{ padding: '24px' }}>
              {renderBody()}
            </main>
          </div>
        </>
      )}
    </div>
  );
}