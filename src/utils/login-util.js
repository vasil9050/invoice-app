import React, { createContext, useState, useContext } from 'react';

// Create context for authentication
const AuthContext = createContext();

// Create a custom hook to use authentication context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem('token') ? true : false
    );

    const login = (token) => {
        localStorage.setItem('token', token); // Save token in localStorage
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token'); // Remove token from localStorage
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
