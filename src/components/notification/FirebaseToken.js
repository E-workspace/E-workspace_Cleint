import React, { useEffect, useState } from 'react';
import { messaging } from './firebase'; // Import messaging instance from your firebase config
import { getToken, onMessage } from 'firebase/messaging';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FirebaseToken = () => {
    const [fcmToken, setFcmToken] = useState('');

    useEffect(() => {
        const requestPermission = async () => {
            try {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    console.log('Notification permission granted.');
                    const token = await getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY' });
                    if (token) {
                        console.log('FCM Token:', token);
                        setFcmToken(token);
                    } else {
                        console.log('Failed to get the FCM token.');
                    }
                } else {
                    console.log('Unable to get permission to notify.');
                }
            } catch (error) {
                console.error('Error getting permission or token:', error);
            }
        };

        requestPermission();

        // Listen for foreground messages
        const unsubscribe = onMessage(messaging, (payload) => {
            console.log('Foreground message received:', payload);
            toast.info(`${payload.notification.title}: ${payload.notification.body}`, {
                icon: payload.notification.icon
            });
        });

        return () => unsubscribe(); // Cleanup on unmount
    }, []);

    return (
        <div>
            <h1>React App with Firebase FCM</h1>
            {fcmToken && <h2>Your FCM Token: {fcmToken}</h2>}
            <ToastContainer /> {/* For displaying notifications */}
        </div>
    );
};

export default FirebaseToken;
