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
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md text-center">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                    Enter OTP sent to {email}
                </h2>
                <input
                    type="text"
                    placeholder="OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring focus:ring-blue-200"
                />
                <button
                    onClick={handleVerifyOTP}
                    className="w-full px-4 py-3 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default OTPModal;
