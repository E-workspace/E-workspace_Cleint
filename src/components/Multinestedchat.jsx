import React from 'react';
import "./Chatpage/Components/myStyle.css";
import Sidebar from './Chatpage/Components/Sidebar';
import {Outlet} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Button, Result } from 'antd';
import ChatArea from './Chatpage/Components/ChatArea';

export default function MainContainer() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // If token is not available, redirect to the login page
  if (!token) {
    
    // navigate('/');
    return (  <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={<Button type="primary" onClick={()=>navigate("/")}>Back Home</Button>}
    />); 
  }
  return (
    <div className='main-container'>
    <Sidebar/>
    <ChatArea/>
     <Outlet/>
    </div>
  )
}
