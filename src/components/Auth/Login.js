import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            toast.success('Login successful');
            navigate('/dashboard');
        } catch (error) {
            console.error('Login Error:', error);
            toast.error(error.message || 'Login failed');
        }
    };

    return (
        <div
            style={{
                width: '300px',
                margin: '100px auto',
                padding: '20px',
                backgroundColor: '#fff',
                border: '1px solid #ddd',
                borderRadius: '4px',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                textAlign: 'center'
            }}
        >
            <h2 style={{ textAlign: 'center' }}>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    style={{
                        marginBottom: '10px',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        width: '100%'
                    }}
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    style={{
                        marginBottom: '10px',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        width: '100%'
                    }}
                    required
                />
                <button
                    type="submit"
                    style={{
                        padding: '10px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        width: '100%'
                    }}
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
