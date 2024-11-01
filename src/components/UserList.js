import React, { useEffect, useState } from 'react';
import { getUsers } from './api';

const UserList = ({ onUserSelect }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUsers();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  return (
    <div className="user-list">
      {users.map((user) => (
        <div key={user._id} onClick={() => onUserSelect(user)}>
          {user.username}
        </div>
      ))}
    </div>
  );
};

export default UserList;
