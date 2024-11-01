import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyA25wMHR1XBWjMYlvNFKbosgJEtsvNPPUc",
    authDomain: "testridy-6db7c.firebaseapp.com",
    projectId: "testridy-6db7c",
    storageBucket: "testridy-6db7c.appspot.com",
    messagingSenderId: "102995745912",
    appId: "1:102995745912:web:0ca85808c77adc73c1618d",
    measurementId: "G-W320M921WQ"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken };