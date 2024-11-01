import React, { useContext, useState, useEffect } from "react";
import "./myStyle.css";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "../../../App";
import Avatar from "@mui/material/Avatar";
import { RefreshContext } from "../../../App";
import Badge from "@mui/material/Badge";
import { useSelector } from "react-redux";

function ConversationsItem({ props }) {
  const [entryCount, setEntryCount] = useState(0);
  const lightTheme = useSelector((state) => state.themeKey);
  const navigate = useNavigate();
  const { setChatInfo, onlineUsers } = useContext(ChatContext);
  const { notifications, setNotifications } = useContext(RefreshContext);
  const iconName = props.name ? props.name[0] : "";
  const title = props.name || "";
  const lastMessage = props.lastMessage || "start a new chat";
  const otherUserImage = props.otherUserImage;

  // Log props and otherUserImage to ensure proper data is received
  console.log("Props:", props);
  console.log("Other User Image:", otherUserImage);

  useEffect(() => {
    let count = 0;

    // Log notifications and check its structure
    console.log("Notifications at useEffect:", notifications);

    for (const key in notifications) {
      console.log("Notification Key:", key, notifications[key]); // Log each notification
      if (notifications[key].ChatId === props._id) {
        count++;
      }
    }

    console.log("Entry Count for chat", props._id, ":", count); // Log entry count
    setEntryCount(count);
  }, [notifications, props._id]);

  const removeNotification = (chatId) => {
    const updatedNotifications = notifications.filter(
      (notification) => notification.ChatId !== chatId
    );
    // Log notifications being removed
    console.log("Removing notifications for ChatId:", chatId);
    console.log(updatedNotifications, "upadted noti")
    setNotifications(updatedNotifications);
  };
  function getContentById(id) {
    let latestEntry = null;
  
    // Log the id being checked (ChatId)
    console.log("Checking latest entry for ChatId:", id);
    console.log(notifications, "noti")
  
    for (const key in notifications) {
      const notification = notifications[key];
      
      // Log both the ChatId of the notification and the id we're comparing it to
      console.log("Notification ChatId:", notification.ChatId, "Comparing with id:", id);
  
      if (notification.ChatId === id) {
        console.log("Matching notification found:", notification); // Log the matching notification
  
        if (!latestEntry || notification.timeStamp > latestEntry.timeStamp) {
          latestEntry = notification; // Update latestEntry if it's the most recent
        }
      }
    }
  
    // Log the final latestEntry found for this chat ID
    console.log("Final latest entry for ChatId", id, ":", latestEntry);
  
    return latestEntry
      ? latestEntry.isGroupChat
        ? latestEntry.sender + ": " + latestEntry.content
        : latestEntry.content
      : null;
  }
  

  return (
    <div
      className={"conversation-container"}
      onClick={() => {
        console.log("Clicked conversation:", props._id); // Log click event

        localStorage.setItem("conversations", JSON.stringify(props));
        setChatInfo(JSON.parse(localStorage.getItem("conversations")) || []);
        removeNotification(props._id);
        navigate("/dashboard");
      }}
    >
      {otherUserImage && !props.isGroup ? (
        <Avatar
          className="con-icon"
          sx={{
            width: 52,
            height: 52,
            borderRadius: 15,
            border: onlineUsers.has(props.otherUser) ? "2px solid green" : null,
          }}
          src={otherUserImage}
        />
      ) : (
        <p className="con-icon">{iconName} </p>
      )}

      <p
        className="con-title"
        style={{ color: lightTheme ? "black" : "white" }}
      >
        {title}{""}
      </p>
      <p
        className="con-lastMessage"
        style={{ color: lightTheme ? "black" : "white" }}
      >
        {getContentById(props._id) ? getContentById(props._id) : lastMessage}
      </p>
      <p
        className="con-timeStamp"
        style={{ color: lightTheme ? "black" : "white" }}
      >
        <Badge badgeContent={entryCount} color="success" />
      </p>
    </div>
  );
}

export default ConversationsItem;
