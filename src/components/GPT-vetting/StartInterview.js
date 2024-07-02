import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MyComponent = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        console.log('User in useEffect:', user);
    }, [user]);

    const users = {
        username: user?.username,
        email: user?.email,
        role: user?.role
    };
    
    console.log(users, "users"); // Ensure this logs

    const getData = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/startinterview/getQuestions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(users)
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
            } else {
                console.error('Error submitting data');
            }
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    useEffect(() => {
        if (user) {
            getData();
        }
    }, [user]);

    return <div>My Component</div>;
};

export default MyComponent;
