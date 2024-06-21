// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Dashboard from './components/Auth/Dashborad';
import OTPModal from './components/Auth/OTPModal';
import { AuthProvider, useAuth } from './components/context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PublicRoute from './components/PublicRoute';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <ToastContainer />
                    <Routes>
                        <Route path="/register" element={<PublicRoute element={<Register />} />} />
                        <Route path="/login" element={<PublicRoute element={<Login />} />} />
                        <Route path="/verify-otp" element={<VerifyOTPRoute />} />
                        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
                        <Route path="/" element={<Navigate to="/register" />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
};

const PrivateRoute = ({ element }) => {
    const { user, loading } = useAuth();
    if (loading) {
        return <div>Loading...</div>;
    }
    return user ? element : <Navigate to="/register" />;
};

const VerifyOTPRoute = () => {
    const { state } = useLocation();
    return state && state.email ? (
        <OTPModal email={state.email} />
    ) : (
        <Navigate to="/register" />
    );
};

export default App;
