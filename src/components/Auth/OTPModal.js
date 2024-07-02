import React, { useState } from 'react';
import { verifyOtp } from '../../services/api'; // Correct import
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

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
        <div
            style={{
                width: '300px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                padding: '20px',
                textAlign: 'center',
                margin: '0 auto'
            }}
        >
            <h2
                style={{
                    fontSize: '1.2rem',
                    marginBottom: '15px',
                    color: '#333'
                }}
            >
                Enter OTP sent to {email}
            </h2>
            <input
                type="text"
                placeholder="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '15px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '1rem'
                }}
            />
            <button
                onClick={handleVerifyOTP}
                style={{
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    transition: 'background-color 0.3s ease'
                }}
            >
                Submit
            </button>
        </div>
    );
};

export default OTPModal;
