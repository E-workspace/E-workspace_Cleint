// src/components/UserProfileCard.js
import React from 'react';


const UserProfileCard = ({ user }) => {
  return (
    <div className="wrapper">
      <div className="user-card">
        <div className="user-card-img">
          <img src={user.profileImage || "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjxivAs4UknzmDfLBXGMxQkayiZDhR2ftB4jcIV7LEnIEStiUyMygioZnbLXCAND-I_xWQpVp0jv-dv9NVNbuKn4sNpXYtLIJk2-IOdWQNpC2Ldapnljifu0pnQqAWU848Ja4lT9ugQex-nwECEh3a96GXwiRXlnGEE6FFF_tKm66IGe3fzmLaVIoNL/s1600/img_avatar.png"} alt="Profile" />
        </div>
        <div className="user-card-info">
          <h2>{user.username}</h2>
          <p><span>Email:</span> {user.email}</p>
          <p><span>Role:</span> {user.role}</p>
          <p><span>Location:</span> {user.location || 'Not specified'}</p>
          <p><span>Occupation:</span> {user.occupation || 'Not specified'}</p>
          <p><span>About me:</span> {user.about || 'No details provided.'}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
