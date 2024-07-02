// src/components/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/protected/profile', {
                    method: 'GET',
                    credentials: 'include',
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                    console.log(data, "user profiles")
                }
            } catch (error) {
                console.error('Session Check Error:', error);
            } finally {
                setLoading(false);
            }
        };
        checkSession();
    }, []);

    const login = async (email, password) => {
        console.log(email, password, "UI"); // Ensure email and password are logged correctly
    
        try {
            const csrfTokenResponse = await fetch('http://localhost:5000/api/csrf-token', {
                method: 'GET',
                credentials: 'include',
            });
            const { csrfToken } = await csrfTokenResponse.json();
    
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'csrf-token': csrfToken },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                const data = await response.json();
                throw new Error(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login Error:', error);
            throw error;
        }
    };
    
    const logout = async () => {
        try {
            const csrfTokenResponse = await fetch('http://localhost:5000/api/csrf-token', {
                method: 'GET',
                credentials: 'include',
            });
            const { csrfToken } = await csrfTokenResponse.json();

            const response = await fetch('http://localhost:5000/api/auth/logout', {
                method: 'POST',
                headers: { 'csrf-token': csrfToken },
                credentials: 'include',
            });
            if (response.ok) {
                setUser(null);
            } else {
                throw new Error('Logout failed');
            }
        } catch (error) {
            console.error('Logout Error:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
