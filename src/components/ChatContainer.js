import { Routes, Route } from 'react-router-dom';
import MainContainer from './Chatpage/Components/MainContainer';  // Your MainContainer component
import Welcome from '/Chatpage/Components/Welcome';  // Your Welcome component
import ChatArea from './Chatpage/Components/ChatArea';  // Your ChatArea component
import Users from './Chatpage/Components/Users_groups';  // Your Users component
import CreateGroups from './Chatpage/Components/CreateGroups';  // Your CreateGroups component
import MediumDevice from './Chatpage/Components/MediumDevice';  // Your MediumDevice component

function AppRoutes() {
  return (
    
    <Routes>
      <Route path="/app" element={<MainContainer />}>
        {/* Nested routes under MainContainer */}
        <Route path="welcome" element={<Welcome />} />
        <Route path="chat" element={<ChatArea />} />
        <Route path="users" element={<Users />} />
        <Route path="create-groups" element={<CreateGroups />} />
        <Route path="start-chats" element={<MediumDevice />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
