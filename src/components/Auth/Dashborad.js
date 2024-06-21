// components/Auth/Dashboard.js
import React from 'react';
import { useAuth } from '../context/AuthContext';
import LogoutButton from './LogoutButton';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div>
            <h1>Welcome, {user?.username}!</h1>
            <p>Email: {user?.email}</p>
            <LogoutButton />
        </div>
    );
};

export default Dashboard;
