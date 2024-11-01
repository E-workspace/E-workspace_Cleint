import React from 'react';

const Message = ({ message }) => {
  return (
    <div>
      <strong>{message.senderId}: </strong>
      {message.message}
    </div>
  );
};

export default Message;
