// src/components/Auth/OTPModal.js

import React, { useState } from 'react';
import { verifyOtp } from '../../services/api'; // Correct import
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const OTPModal = ({ email }) => {
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();

    const handleVerifyOTP = async () => {
        try {
            await verifyOtp({ email, otp }); // Correct function call
            toast.success('OTP verified successfully');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'OTP verification failed');
        }
    };

    return (
        <div className="modal">
            <h2>Enter OTP sent to {email}</h2>
            <input
                type="text"
                placeholder="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={handleVerifyOTP}>Submit</button>
        </div>
    );
};

export default OTPModal;
