import React, { useState, useEffect } from 'react';
import { register } from '../../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [role, setRole] = useState('');
    const navigate = useNavigate();
    const { token } = useAuth();

    useEffect(() => {
        if (token) {
            navigate('/dashboard');
        }
    }, [token, navigate]);

    const handleRegister = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('profileImage', profileImage);
        formData.append('role', role);

        try {
            await register(formData);
            toast.success('OTP sent to your email');
            navigate('/verify-otp', { state: { email } });
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed';
            toast.error(errorMessage);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="w-full max-w-md p-8 space-y-8">
                <h2 className="text-3xl font-bold text-center">Register</h2>
                <form onSubmit={handleRegister} className="space-y-6">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-3 text-lg text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 text-lg text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 text-lg text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                        required
                    />
                    <input
                        type="file"
                        onChange={(e) => setProfileImage(e.target.files[0])}
                        className="w-full px-4 py-3 text-lg text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                        required
                    />
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-4 py-3 text-lg text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                        required
                    >
                        <option value="" disabled>Select Role</option>
                        <option value="Full Stack Developer">Full Stack Developer</option>
                        <option value="Frontend Developer">Frontend Developer</option>
                        <option value="Backend Developer">Backend Developer</option>
                        <option value="Cyber Security">Cyber Security</option>
                        <option value="DevOps">DevOps</option>
                        <option value="Test Engineer">Test Engineer</option>
                        {/* Add more roles as needed */}
                    </select>
                    <button
                        type="submit"
                        className="w-full px-4 py-3 font-bold text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-200"
                    >
                        Register
                    </button>
                </form>
                <div className="text-center">
                <p className="text-sm text-gray-700">
                    Already registered?{' '}
                    <a href="/login" className="text-blue-600 hover:underline">Log in</a>
                </p>
            </div>
            </div>
        </div>
    );
};

export default Register;
