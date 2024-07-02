// src/components/Auth/Register.js
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
        <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="file"
                    onChange={(e) => setProfileImage(e.target.files[0])}
                    required
                />
                <select value={role} onChange={(e) => setRole(e.target.value)} required>
                    <option value="" disabled>Select Role</option>
                    <option value="Full Stack Developer">Full Stack Developer</option>
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="Backend Developer">Backend Developer</option>
                    <option value="Cyber Security">Cyber Security</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Test Engineer">Test Engineer</option>
                    {/* Add more roles as needed */}
                </select>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
