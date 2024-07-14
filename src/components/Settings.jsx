import React, { useState, useEffect } from 'react';
import { Button, TextField, Avatar, Box, Tabs, Tab, Card, CardContent, Typography, IconButton, InputAdornment, MenuItem } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import javascript from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import php from 'react-syntax-highlighter/dist/esm/languages/hljs/php';
import { useAuth } from './context/AuthContext';
import { Visibility, VisibilityOff, Edit } from '@mui/icons-material';
import '@fontsource/inter'; // Import Inter font

SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('php', php);

const theme = createTheme({
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
  },
});

const apiUrl = 'https://siraj-software.onrender.com';

const getPythonCode = (method, apiKey, userId) => `
import requests

url = '${apiUrl}/ecommerce'
headers = {
  'Authorization': 'Bearer ${apiKey}',
  'X-User-ID': '${userId}'
}
response = requests.${method.toLowerCase()}(url, headers=headers)
print(response.json())
`;

const getJsCode = (method, apiKey, userId) => `
fetch('${apiUrl}/ecommerce', {
  method: '${method}',
  headers: {
    'Authorization': 'Bearer ${apiKey}',
    'X-User-ID': '${userId}'
  },
})
  .then(response => response.json())
  .then(data => console.log(data));
`;

const getPhpCode = (method, apiKey, userId) => `
<?php
$method = '${method}';
$options = [
  'http' => [
    'method' => $method,
    'header' => 'Authorization: Bearer ${apiKey}\r\nX-User-ID: ${userId}'
  ]
];
$context = stream_context_create($options);
$response = file_get_contents('${apiUrl}/ecommerce', false, $context);
echo $response;
?>
`;

const Settings = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('Profile');
  const [codeTab, setCodeTab] = useState('Python');
  const [method, setMethod] = useState('GET');
  const [editMode, setEditMode] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: user.username,
    email: user.email,
    profileImage: user.profileImage,
    role: user.role,
    apikey: user.apikey,
  });

  useEffect(() => {
    if (!user.apikey) {
      setUserInfo((prevState) => ({
        ...prevState,
        apikey: 'No API key set',
      }));
    }
  }, [user.apikey]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleCodeTabChange = (event, newValue) => {
    setCodeTab(newValue);
  };

  const handleMethodChange = (event) => {
    setMethod(event.target.value);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const toggleShowApiKey = () => {
    setShowApiKey(!showApiKey);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  const renderCodeSnippet = (language) => {
    const apiKey = userInfo.apikey;
    const userId = user._id;

    switch (language) {
      case 'Python':
        return getPythonCode(method, apiKey, userId);
      case 'JavaScript':
        return getJsCode(method, apiKey, userId);
      case 'PHP':
        return getPhpCode(method, apiKey, userId);
      default:
        return '';
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="flex h-screen">
        <div className="w-1/4 p-5 bg-gray-100">
          <Button
            variant={activeTab === 'Profile' ? 'contained' : 'outlined'}
            color="primary"
            className="w-full mb-4"
            onClick={() => handleTabChange('Profile')}
          >
            Profile
          </Button>
          <Button
            variant={activeTab === 'API Key' ? 'contained' : 'outlined'}
            color="primary"
            className="w-full mb-4"
            onClick={() => handleTabChange('API Key')}
          >
            API Key
          </Button>
          <Button
            variant={activeTab === 'API Usage' ? 'contained' : 'outlined'}
            color="primary"
            className="w-full mb-4"
            onClick={() => handleTabChange('API Usage')}
          >
            API Usage
          </Button>
        </div>
        <div className="flex-grow p-10">
          {activeTab === 'Profile' && (
            <Box>
              <h2 className="text-2xl font-bold mb-6">Profile</h2>
              <div className="mb-6">
                <label className="block mb-2 font-bold">Avatar</label>
                <div className="flex items-center">
                  <Avatar src={userInfo.profileImage} className="mr-4" />
                  <Button variant="outlined" color="error">
                    Remove
                  </Button>
                </div>
              </div>
              <div className="mb-6">
                <label className="block mb-2 font-bold">Personal Details</label>
                <TextField
                  label="Username"
                  variant="outlined"
                  fullWidth
                  className="mb-4"
                  name="username"
                  value={userInfo.username}
                  onChange={handleInputChange}
                  InputProps={{
                    readOnly: !editMode,
                  }}
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  name="email"
                  value={userInfo.email}
                  onChange={handleInputChange}
                  InputProps={{
                    readOnly: !editMode,
                  }}
                />
              </div>
              <Button variant="contained" color="primary" onClick={toggleEditMode}>
                {editMode ? 'Save' : 'Edit'}
              </Button>
            </Box>
          )}
          {activeTab === 'API Key' && (
            <Box>
              <h2 className="text-2xl font-bold mb-6">API Key</h2>
              <TextField
                label="API Key"
                variant="outlined"
                fullWidth
                className="mb-4"
                type={showApiKey ? 'text' : 'password'}
                value={userInfo.apikey}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={toggleShowApiKey}>
                        {showApiKey ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="User ID"
                variant="outlined"
                fullWidth
                value={user._id}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>
          )}
          {activeTab === 'API Usage' && (
            <Box>
              <h2 className="text-2xl font-bold mb-6">API Usage</h2>
              <Tabs value={codeTab} onChange={handleCodeTabChange}>
                <Tab label="Python" value="Python" />
                <Tab label="JavaScript" value="JavaScript" />
                <Tab label="PHP" value="PHP" />
              </Tabs>
              <Box className="mt-6">
                <TextField
                  select
                  label="Method"
                  value={method}
                  onChange={handleMethodChange}
                  variant="outlined"
                  fullWidth
                  className="mb-4"
                >
                  <MenuItem value="GET">GET</MenuItem>
                  <MenuItem value="POST">POST</MenuItem>
                  <MenuItem value="PUT">PUT</MenuItem>
                  <MenuItem value="DELETE">DELETE</MenuItem>
                </TextField>
                <Card style={{ backgroundColor: '#2d2d2d', color: '#ffffff', marginBottom: '1rem' }}>
                  <CardContent>
                    <Typography variant="h5" component="div" gutterBottom style={{ color: '#fdd835' }}>
                      {codeTab}
                    </Typography>
                    <SyntaxHighlighter language={codeTab.toLowerCase()} style={atomOneDark}>
                      {renderCodeSnippet(codeTab)}
                    </SyntaxHighlighter>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Settings;
