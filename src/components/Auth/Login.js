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
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="w-full max-w-md p-8 space-y-8">
                <h2 className="text-3xl font-bold text-center">Welcome back</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full px-4 py-3 text-lg text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full px-4 py-3 text-lg text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                        required
                    />
                    <div className="text-right">
                        <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-3 font-bold text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-200"
                    >
                        Log In
                    </button>
                    <div className="relative flex items-center justify-center my-4">
                        <span className="absolute px-4 bg-white text-gray-500">or</span>
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <button
                        type="button"
                        className="w-full px-4 py-3 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200"
                    >
                        Log in with Facebook
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
