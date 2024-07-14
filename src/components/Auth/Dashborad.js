// src/components/Dashboard.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import BookIcon from '@mui/icons-material/Book';
import QuizIcon from '@mui/icons-material/Quiz';
import NotesIcon from '@mui/icons-material/Notes';
import CodeIcon from '@mui/icons-material/Code';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ApiIcon from '@mui/icons-material/Api';
import AiIcon from '@mui/icons-material/Psychology';
import SocialIcon from '@mui/icons-material/People';
import ProfileIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import Swal from 'sweetalert2';
import Course from '../Courses/CoursesOverview';
import UserProfileCard from '../Profile/Profile';
import Notes from '../Notes/Notes';
import PostUpload from './PostUpload';
import ApiCards from '../ApiCards';
import SkelotenCourseCardLoader from '../Skeloten_course_card_loader';
import McqCards from '../McqComponent/McqCards';
import Ai from '../GPT-vetting/Ai';
import Landing from '../CodeEditor_components/components/Landing'
import CodeStore from '../Savedcode/CodeStore'
import ResponsiveDatePickers from '../GPT-vetting/Calender';
import Tidio from '../Tidio';
import Settings from '../Settings';




const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function Dashboard() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState('Courses'); // State to track the current view
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false); // State to show the Code Editor iframe

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleViewChange = (newView) => {
    if (newView === 'ApiCards') {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setView(newView);
      }, 2000); // Show the loader for 2 seconds
    } else if (newView === 'Code Editor') {
      // Display the Code Editor iframe
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

  const renderView = () => {
    if (loading) {
      return <SkelotenCourseCardLoader />;
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
        return <ResponsiveDatePickers/>;
      case 'Code Editor':
        return <Landing/>
      case 'Code Store':
        return <CodeStore/>
      case 'Settings':
        return <Settings/>
      default:
        return <Course />;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {[
            { text: 'Courses', icon: <BookIcon />, action: () => handleViewChange('Courses') },
            { text: 'MCQ', icon: <QuizIcon />, action: () => handleViewChange('McqCards')  },
            { text: 'Notes', icon: <NotesIcon />, action: () => handleViewChange('Notes') },
            { text: 'Code Editor', icon: <CodeIcon />, action: () => handleViewChange('Code Editor') },
            { text: 'Code Store', icon: <ShoppingCartIcon />, action : ()=> handleViewChange('Code Store') },
            { text: 'Post Upload', icon: <CloudUploadIcon />, action : ()=> handleViewChange('Post_upload') },
          ].map((item, index) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton onClick={item.action || (() => console.log('Button clicked!'))}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {[
            { text: `API's`, icon: <ApiIcon />, action: () => handleViewChange('ApiCards') },
            { text: 'AI Interview', icon: <AiIcon /> , action : () => handleViewChange('Ai_interview') },
            { text: 'Social Network', icon: <SocialIcon /> },
            // { text: 'Profile', icon: <ProfileIcon />, action: () => handleViewChange('Profile') },
            { text: 'Settings', icon: <SettingsIcon />, action : () => handleViewChange('Settings') },
            { text: 'Logout', icon: <LogoutIcon />, action: confirmLogout },
          ].map((item, index) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton onClick={item.action || (() => console.log('Button clicked!'))}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {renderView()}
      </Main>

      <Tidio/>
    </Box>

  );
}
