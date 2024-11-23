import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Layout, Menu, Button, Drawer, Space, Avatar, Badge,  Modal, List, notification ,Spin } from 'antd';
import {
  BookOutlined,
  FormOutlined,
  FileTextOutlined,
  CodeOutlined,
  ShoppingCartOutlined,
  ApiOutlined,
  SettingOutlined,
  LogoutOutlined,
  PlusOutlined,
  SmileOutlined,
  CommentOutlined,
  CheckSquareOutlined,
  BellOutlined,
  UserOutlined,
  VideoCameraFilled
} from '@ant-design/icons';
import "./Dashboard.css";
import Swal from 'sweetalert2';
import Course from '../Courses/CoursesOverview';
import UserProfileCard from '../Profile/Profile';
import Notes from '../Notes/Notes';
import PostUpload from './PostUpload';
import ApiCards from '../ApiCards/ApiCards';
import McqCards from '../McqComponent/McqCards';
import Ai from '../GPT-vetting/Ai';
import Landing from '../CodeEditor_components/components/Landing';
import CodeStore from '../Savedcode/CodeStore';
import ResponsiveDatePickers from '../GPT-vetting/Calender';
import Tidio from '../Tidio';
import Settings from '../Settings';
import TaskTable from '../Task_system/Tasksystem';
import { messaging } from './notification/firebase';
import { getToken } from 'firebase/messaging';
import axios from 'axios';
import MainContainerChat from '../MainContainerChat';
import CongratulationsModal from './BombConfettiEffect';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addNotification, getNotifications, deleteNotification } from '../indexDb/Db'; // import your indexedDB helpers

const { Header, Sider, Content } = Layout;

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [view, setView] = useState('Courses'); 
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false); 
  const [openDrawer, setOpenDrawer] = useState(false); // For mobile Drawer
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isProfileModal, setIsProfileModal] = useState(false);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);


  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const dbRequest = window.indexedDB.open("keyval-store", 1); // Use versioning for upgrades

      dbRequest.onupgradeneeded = (event) => {
        const db = event.target.result;
        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains("keyval")) {
          db.createObjectStore("keyval");
        }
      };

      dbRequest.onsuccess = (event) => {
        const database = event.target.result;

        // Transaction and object store
        const transaction = database.transaction("keyval", "readonly");
        const store = transaction.objectStore("keyval");

        // Fetch notificationCount
        const notificationCountRequest = store.get("notificationCount");
        notificationCountRequest.onsuccess = () => {
          setNotificationCount(notificationCountRequest.result || 0);
        };

        // Fetch notifications array
        const notificationsRequest = store.get("notifications");
        notificationsRequest.onsuccess = () => {
          console.log(notificationsRequest.result, "res");
          setNotifications(notificationsRequest.result || []);
        };

        // Handle errors for transactions
        transaction.onerror = (error) => {
          console.error("Transaction error:", error);
        };
      };

      dbRequest.onerror = (error) => {
        console.error("Error opening database:", error);
      };
    } catch (error) {
      console.error("Error fetching notifications from keyval-store:", error);
    }
  };

  const handleNotificationClick = async (index) => {
    console.log("Notification clicked:", notifications[index]); //
    const updatedNotifications = [...notifications];
    updatedNotifications.splice(index, 1); // Remove the clicked notification

    // Update IndexedDB
    const dbRequest = window.indexedDB.open("keyval-store", 1);
    
    dbRequest.onsuccess = (event) => {
      const database = event.target.result;
      const transaction = database.transaction("keyval", "readwrite");
      const store = transaction.objectStore("keyval");

      // Update notifications array in IndexedDB
      store.put(updatedNotifications, "notifications");

      // Update notification count
      store.put(updatedNotifications.length, "notificationCount");

      // Update state
      setNotifications(updatedNotifications);
      setNotificationCount(updatedNotifications.length);
    };

    dbRequest.onerror = (error) => {
      console.error("Error opening database for updating notifications:", error);
    };
  };

  const handleIconClick = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleTaskCompletion = () => {
    setOpenCongratulationsModal(true); 
  };

  const handleCloseCongratulationsModal = () => {
    setOpenCongratulationsModal(false); 
  };

  const handleProfileModalClose = () => setIsProfileModalVisible(false);

  const handleViewChange = (newView) => {
    if (newView === 'ApiCards') {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setView(newView);
      }, 2000); 
    } else if (newView === 'Code Editor') {
      setShowCodeEditor(true);
      setView(newView);
    } else {
      setView(newView);
    }
  };

  const confirmLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Logged out!",
          text: "You have been logged out.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });
        setTimeout(() => {
          logout();
        }, 1500);
      }
    });
  };

  console.log(user, 'users dash')

  const renderView = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <Spin size="large" /> {/* You can adjust the size */}
        </div>
      );
    }

    switch(view) {
      case 'Courses':
        return <Course />;
      case 'Profile':
        return <UserProfileCard user={user} />;
      case 'Notes':
        return <Notes />;
      case 'Post_upload':
        return <PostUpload />;
      case 'ApiCards':
        return <ApiCards />;
      case 'McqCards':
        return <McqCards />;
      case 'Ai_interview':
        return <ResponsiveDatePickers />;
      case 'Code Editor':
        return <Landing />;
      case 'Code Store':
        return <CodeStore />;
      case 'Settings':
        return <Settings />;
      case 'Chat':
        return <MainContainerChat />;
      case 'Task_System':
        return <TaskTable />;
      case 'meet':
        return <>
        <iframe
          allow="camera; microphone; display-capture; fullscreen; clipboard-read; clipboard-write; web-share; autoplay"
          src="https://sfu.mirotalk.com/newroom"
          style={{width:'100%', height:'97%', border:'none'}}
      ></iframe>
        </>;
      default:
        return <Course />;
    }
  };

  useEffect(() => {
    const retrieveAndSaveToken = async () => {
      if (!user) return; 

      try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.log('Notification permission denied.');
          toast.error('Notification permission denied.');
          return;
        }

        const fcmToken = await getToken(messaging, { vapidKey: process.env.REACT_APP_VAPID_KEY });
        if (fcmToken) {
          const tokenData = {
            userId: user._id,
            token: fcmToken,
          };

          try {
            const response = await axios.post(`https://eworkspacems2-loszcsdz.b4a.run/api/fcm/save-token`, tokenData);
            toast.success(response.data.message);
          } catch (error) {
            toast.error(error.response?.data?.message || "Error saving token.");
          }
        } else {
          toast.error('Failed to retrieve FCM token.');
        }
      } catch (error) {
        toast.error('Error retrieving FCM token.');
      }
    };

    retrieveAndSaveToken();
  }, [user]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <CongratulationsModal />
      
      {/* Sidebar with fixed position */}
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} style={{ position: 'fixed', height: '100vh', left: 0, top: 0, overflow: 'auto' }}>
        <div className="logo" style={{ padding: '16px', color: '#fff', textAlign: 'center' }}></div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<BookOutlined />} onClick={() => handleViewChange('Courses')}>Courses</Menu.Item>
          <Menu.Item key="2" icon={<FormOutlined />} onClick={() => handleViewChange('McqCards')}>MCQ</Menu.Item>
          <Menu.Item key="3" icon={<FileTextOutlined />} onClick={() => handleViewChange('Notes')}>Notes</Menu.Item>
          <Menu.Item key="4" icon={<CodeOutlined />} onClick={() => handleViewChange('Code Editor')}>Code Editor</Menu.Item>
          <Menu.Item key="5" icon={<ShoppingCartOutlined />} onClick={() => handleViewChange('Code Store')}>Code Store</Menu.Item>
          <Menu.Item key="6" icon={<PlusOutlined />} onClick={() => handleViewChange('Post_upload')}>Create Web Page</Menu.Item>
          <Menu.Item key="7" icon={<ApiOutlined />} onClick={() => handleViewChange('ApiCards')}>APIs</Menu.Item>
          <Menu.Item key="8" icon={<SmileOutlined />} onClick={() => handleViewChange('Ai_interview')}>AI Interview</Menu.Item>
          <Menu.Item key="9" icon={<CommentOutlined />} onClick={() => handleViewChange('Chat')}>Chat</Menu.Item>
          <Menu.Item key="10" icon={<CheckSquareOutlined />} onClick={() => handleViewChange('Task_System')}>Task Management</Menu.Item>

          <Menu.Item key="13" icon={<VideoCameraFilled />} onClick={() => handleViewChange('meet')}>Meet</Menu.Item>
          <Menu.Item key="11" icon={<SettingOutlined />} onClick={() => handleViewChange('Settings')}>Settings</Menu.Item>
          <Menu.Item key="12" icon={<LogoutOutlined />} onClick={confirmLogout}>Logout</Menu.Item>
        </Menu>
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
        {/* Header section with profile and notification icons */}
        <Header style={{ background: '#fff', padding: '0 16px', display: 'flex', alignItems: 'center' }}>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
          <Space size={20} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginTop: '10px' }}>
              <Badge count={notificationCount} size="small">
                <BellOutlined 
                  style={{ fontSize: '28px', color: '#000', cursor: 'pointer' }} 
                  onClick={() => setIsModalVisible(true)} // Open modal on icon click
                />
              </Badge>
  
              <Modal
                title="Notifications"
                visible={isModalVisible}
                onCancel={handleModalClose}
                footer={null}
              >
                <List
                  dataSource={notifications}
                  renderItem={(item) => (
                    <List.Item onClick={() => handleNotificationClick(item)} style={{ cursor: 'pointer', }}>{/* borderBottom: '0.2px solid black' */}
                      <List.Item.Meta
                        title={item.title}
                        description={item.body}
                      />
                    </List.Item>
                  )}
                />
                {notifications.length === 0 && <div>No notifications available.</div>}
              </Modal>
  
            </div>
            <Avatar
            src={user.profileImage || null} // Show profile image if available
            icon={!user.profileImage ? <UserOutlined /> : null} // Show icon if no profile image
            style={{ backgroundColor: '#87d068', cursor: 'pointer' }}
            onClick={() => setIsProfileModalVisible(true)} // Open profile modal
          />
             {/* Profile Modal */}
           <Modal
          title="Profile Details"
          visible={isProfileModalVisible}
          onCancel={handleProfileModalClose}
          footer={null}
          width={700}
        >
        <List style={{ fontFamily: 'Play, sans-serif', padding: '5px' }}>
        <List.Item style={{ marginBottom: '10px' }}>
          <strong style={{ marginRight: '5px' }}>Username:</strong>
          <span style={{ marginLeft: '5px' }}>{user.username}</span>
        </List.Item>
        <List.Item style={{ marginBottom: '5px' }}>
          <strong style={{ marginRight: '5px' }}>Email:</strong>
          <span style={{ marginLeft: '5px' }}>{user.email}</span>
        </List.Item>
        <List.Item style={{ marginBottom: '10px' }}>
          <strong style={{ marginRight: '5px' }}>Role:</strong>
          <span style={{ marginLeft: '5px' }}>{user.role}</span>
        </List.Item>
        <List.Item style={{ marginBottom: '10px' }}>
          <strong style={{ marginRight: '5px' }}>Location:</strong>
          <span style={{ marginLeft: '5px' }}>{user.selectedDistrict || 'Not specified'}</span>
        </List.Item>
        <List.Item style={{ marginBottom: '10px' }}>
          <strong style={{ marginRight: '5px' }}>Batch:</strong>
          <span style={{ marginLeft: '5px' }}>{user.batch || 'Not specified'}</span>
        </List.Item>
        <List.Item style={{ marginBottom: '10px' }}>
          <strong style={{ marginRight: '5px' }}>Phone no:</strong>
          <span style={{ marginLeft: '5px' }}>{user.phoneNumber || 'No details provided.'}</span>
        </List.Item>
        <List.Item style={{ marginBottom: '10px' }}>
          <strong style={{ marginRight: '5px' }}>Your API Key:</strong>
          <span style={{ marginLeft: '5px' }}>{user.apikey || 'No details provided.'}</span>
        </List.Item>
        <List.Item>
          <button onClick={logout} style={{ color: '#007bff', cursor: 'pointer' }}>Logout</button>
        </List.Item>
      </List>
      
        </Modal>

            
          </Space>
        </div>
      </Header>

        {/* Content section with only the inner content scrollable */}
        <Content style={{ margin: '16px', overflowY: 'auto', height: 'calc(100vh - 64px)' }}>
          <Drawer
            title="Mobile Menu"
            placement="left"
            onClose={() => setOpenDrawer(false)}
            visible={openDrawer}
            bodyStyle={{ height: '100%', overflow: 'auto' }}
            className="mobile-drawer"
          >
            <Menu theme="dark" mode="inline" onClick={({ key }) => handleViewChange(key)}>
              <Menu.Item key="Courses" icon={<BookOutlined />}>Courses</Menu.Item>
              <Menu.Item key="McqCards" icon={<FormOutlined />}>MCQ</Menu.Item>
              <Menu.Item key="Notes" icon={<FileTextOutlined />}>Notes</Menu.Item>
              <Menu.Item key="Code Editor" icon={<CodeOutlined />}>Code Editor</Menu.Item>
              <Menu.Item key="Code Store" icon={<ShoppingCartOutlined />}>Code Store</Menu.Item>
              <Menu.Item key="Post_upload" icon={<PlusOutlined />}>Create Web Page</Menu.Item>
              <Menu.Item key="ApiCards" icon={<ApiOutlined />}>APIs</Menu.Item>
              <Menu.Item key="Ai_interview" icon={<SmileOutlined />}>AI Interview</Menu.Item>
              <Menu.Item key="meet" icon={<VideoCameraFilled />}>Meet</Menu.Item>
              <Menu.Item key="Chat" icon={<CommentOutlined />}>Chat</Menu.Item>
              <Menu.Item key="Task_System" icon={<CheckSquareOutlined />}>Task Management</Menu.Item>
              <Menu.Item key="Settings" icon={<SettingOutlined />}>Settings</Menu.Item>
              <Menu.Item key="Logout" icon={<LogoutOutlined />} onClick={confirmLogout}>Logout</Menu.Item>
            </Menu>
          </Drawer>

          {/* Displaying the content based on the selected view */}
          {renderView()}
        </Content>
      </Layout>
    </Layout>
  );
}
