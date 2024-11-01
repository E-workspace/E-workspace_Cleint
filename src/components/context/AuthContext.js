// src/components/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios'; // Ensure axios is imported
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Function to fetch the CSRF token
    const getCsrfToken = async () => {
        try {
            const csrfTokenResponse = await fetch(`${process.env.REACT_APP_API_URL_MS1}/csrf-token`, {
                method: 'GET',
                credentials: 'include',
            });
            const { csrfToken } = await csrfTokenResponse.json();
            return csrfToken; // Return the csrfToken
        } catch (error) {
            toast.error('CSRF Token Fetch Error: ' + error.message);
            throw error; // Throw error to handle it in the calling function
        }
    };

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL_MS1}/protected/profile`, {
                    method: 'GET',
                    credentials: 'include',
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log(data, "data from profile")
                    setUser(data);
                    console.log(data, "user profiles");
                }
            } catch (error) {
                toast.error('Session Check Error: ' + error.message);
            } finally {
                setLoading(false);
            }
        };
        checkSession();
    }, []);

    
    const login = async (email, password) => {
        console.log(email, password, "UI"); // Log email and password for debugging
    
        try {
            const csrfToken = await getCsrfToken(); // Fetch CSRF token
            console.log(csrfToken, "token"); // Log CSRF token to verify it is received correctly
    
            const response = await fetch(`https://e-workspace-server-v1-ms-1.onrender.com/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'csrf-token': csrfToken, // Ensure the header name matches backend configuration
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include', // Corrected to 'include' to send cookies with the request
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log(data.user, "data from login");
                setUser(data.user || data); // Update user state
                toast.success('Login successful');
            } else {
                const data = await response.json();
                cosnole.log(data.message, "message")
                throw new Error(data.message || 'Login failed');
            }
        } catch (error) {
            toast.error('Login Error: ' + error.message);
            throw error;
        }
    };
    

    const handleLogin = async (email, password) => {
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_KEY}/user/login`, {
                name: email.trimEnd(),
                password: password,
            });

            // Save the token to localStorage upon successful login
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userId", response.data._id);
            localStorage.setItem("userName", response.data.name);
            localStorage.setItem("email", response.data.email);
            localStorage.setItem("userImage", response.data.image);

            if (response.data.token) {
                console.log(response.data, "data");
                toast.success('Login successful');
                setLoading(false);
                navigate("/app/welcome");
            } else {
                toast.error('Login failed: Invalid token');
                setLoading(false);
            }
        } catch (error) {
            console.error("Login failed:", error.message);

            if (error.response && error.response.status === 401) {
                console.log("Invalid credentials provided");
                toast.error('Invalid credentials provided');
            } else {
                toast.error('Login failed: ' + error.message);
            }

            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            const csrfToken = await getCsrfToken(); // Fetch CSRF token

            const response = await fetch(`${process.env.REACT_APP_API_URL_MS1}/auth/logout`, {
                method: 'POST',
                headers: { 'csrf-token': csrfToken },
                credentials: 'include',
            });
            if (response.ok) {
                setUser(null);
                toast.success('Logout successful');
            } else {
                throw new Error('Logout failed');
            }
        } catch (error) {
            toast.error('Logout Error: ' + error.message);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, handleLogin, loading }}>
            {children}
            <ToastContainer /> {/* Add ToastContainer here to render toasts */}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
