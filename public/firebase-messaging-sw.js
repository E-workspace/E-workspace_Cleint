importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');
importScripts('https://cdn.jsdelivr.net/npm/idb-keyval@6/dist/umd.js');

const firebaseConfig = {
    apiKey: "AIzaSyA25wMHR1XBWjMYlvNFKbosgJEtsvNPPUc",
    authDomain: "testridy-6db7c.firebaseapp.com",
    projectId: "testridy-6db7c",
    storageBucket: "testridy-6db7c.appspot.com",
    messagingSenderId: "102995745912",
    appId: "1:102995745912:web:0ca85808c77adc73c1618d",
    measurementId: "G-W320M921WQ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Function to update the notification count and data in IndexedDB
async function updateNotificationData(notificationData) {
    try {
        // Retrieve the current notification count
        let currentCount = await idbKeyval.get('notificationCount') || 0;
        currentCount += 1; // Increment the count

        // Update count in IndexedDB
        await idbKeyval.set('notificationCount', currentCount);

        // Retrieve current notifications array
        let notifications = await idbKeyval.get('notifications') || [];
        notifications.push(notificationData);

        // Save the updated array back to IndexedDB
        await idbKeyval.set('notifications', notifications);

        console.log('Notification data and count updated in IndexedDB');
    } catch (error) {
        console.error('Error updating notification data:', error);
    }
}

// Handle background messages
messaging.onBackgroundMessage(async (payload) => {
    console.log('Background Message received:', payload);

   

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon || 'https://img.freepik.com/free-vector/flat-linear-online-learning-landing-page-template_23-2148914928.jpg?size=626&ext=jpg',
        image: payload.notification.image,
        data: {
            url: payload.data.url // Include the URL to open
        }
    };
    console.log(notificationTitle)

    // Show the notification
    self.registration.showNotification(notificationTitle, notificationOptions);

    // Store notification data and update count
    const notificationData = {
        title: payload.notification.title,
        body: payload.notification.body,
        url: payload.data.url,
        timestamp: new Date().toISOString()
    };
    await updateNotificationData(notificationData);
    
    // Send a message to the client to update the UI
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            console.log("Sending message to client:", client);
            client.postMessage({ type: 'NEW_NOTIFICATION', data: notificationData });
        });
    });
});

// Handle notification click
self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            for (let client of clientList) {
                if (client.url === event.notification.data.url && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(event.notification.data.url);
            } else {
                console.error('clients.openWindow is not supported in this environment');
            }
        })
    );
});
