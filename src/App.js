import React, { createContext, useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { AuthProvider, useAuth } from './components/context/AuthContext';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Dashboard from './components/Auth/Dashborad';
import OTPModal from './components/Auth/OTPModal';
import PublicRoute from './components/PublicRoute';
import MainContainer from "./components/Chatpage/Components/MainContainer";
import Welcome from "./components/Chatpage/Components/Welcome";
import ChatArea from "./components/Chatpage/Components/ChatArea";
import CreateGroups from "./components/Chatpage/Components/CreateGroups";
import Users from "./components/Chatpage/Components/Users_groups";
import MediumDevice from "./components/Chatpage/Components/MediumDevice";
import Media from './components/Skeloten_course_card_loader';
import { notification } from 'antd';
import MicCheck from './components/GPT-vetting/Miccheck';
import MyComponent from './components/GPT-vetting/StartInterview';

export const RefreshContext = createContext("");
export const ChatContext = createContext("");

const App = () => {
  const [MasterRefresh, setMasterRefresh] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [ChatInfo, setChatInfo] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const lightTheme = useSelector((state) => state.themeKey);

  const contextValue = {
    MasterRefresh,
    setMasterRefresh,
    notifications,
    setNotifications,
  };

  const chatContextValue = {
    ChatInfo,
    setChatInfo,
    onlineUsers,
    setOnlineUsers,
  };

  useEffect(() => {
    // Listener for messages from the service worker
    if (navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log("Message received from service worker:", event.data);

        // Destructure data from the event
        const { notification: notify, data } = event.data || {};
        if (notify && data) {
          const { title, body, image } = notify;

          // Show notification
          notification.open({
            message: title || 'Notification Title',
            description: body || 'You have a new message.',
            duration: 0, // Keep the notification open until manually closed
        
            onClick: () => {
              // Open the URL if it exists
              if (data.url) {
                window.open(data.url, '_blank'); // Open the URL in a new tab
              }
            },
          });

          // Update notifications state
          setNotifications((prevNotifications) => [
            ...prevNotifications,
            data
          ]);
        } else {
          console.warn("Notification data is missing or incorrect.");
        }
      });
    }
  }, []);

  return (
    <AuthProvider>
      <RefreshContext.Provider value={contextValue}>
        <ChatContext.Provider value={chatContextValue}>
          <div className="App">
            <Routes>
              {/* Authentication Routes */}
              <Route path="/register" element={<PublicRoute element={<Register />} />} />
              <Route path="/login" element={<PublicRoute element={<Login />} />} />
              <Route path="/verify-otp" element={<VerifyOTPRoute />} />
              <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
              <Route path="/mic-check" element={<MicCheck />} />
              <Route path="/start-interview" element={<MyComponent />} />
              <Route path="/" element={<Navigate to="/register" />} />


              {/* Main Application Routes */}
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/dashboard" element={<MainContainer />}>
                <Route path="welcome" element={<Welcome />} />
                <Route path="chat" element={<ChatArea />} />
                <Route path="users" element={<Users />} />
                <Route path="create-groups" element={<CreateGroups />} />
                <Route path="start-chats" element={<MediumDevice />} />
              </Route>
            </Routes>
          </div>
        </ChatContext.Provider>
      </RefreshContext.Provider>
    </AuthProvider>
  );
};

const PrivateRoute = ({ element }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'start', height: '200vh' }}>
        <Media loading />
      </div>
    );
  }
  return user ? element : <Navigate to="/login" />;
};

const VerifyOTPRoute = () => {
  const { state } = useLocation();
  return state && state.email ? (
    <OTPModal email={state.email} />
  ) : (
    <Navigate to="/login" />
  );
};

export default App;
