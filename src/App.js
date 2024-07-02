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
import Box from '@mui/material/Box';
import Media from './components/Skeloten_course_card_loader'; // Import Media component for skeleton loader
import '../src/components/assets/otp.css'
import '../src/components/assets/iosTheme.css'
import MicCheck from './components/GPT-vetting/Miccheck';
import MyComponent from './components/GPT-vetting/StartInterview';

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
                        <Route path="/mic-check" element={<MicCheck />} />
                        <Route path="/start-interview" element={<MyComponent />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
};

const PrivateRoute = ({ element }) => {
    const { user, loading } = useAuth();
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'start', height: '200vh' }}>
                <Media loading /> {/* Use the skeleton loader */}
            </Box>
        );
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
