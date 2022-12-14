import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import Notification from '../components/Notification';
import {Typography, UseTheme, ColorButton} from '../styles/material';
import { useLocation } from "react-router-dom";

interface NotificationProps {
  notif: {
    commentId: number;
    created_at: string;
    id: number;
    read: boolean;
    type: string;
    userId: string;
  }[],
  getNotifications: () => void;
}

const NotificationsFeed: React.FC<NotificationProps> = ({notif, getNotifications}) => {
  const userContext = useContext(UserContext);
  const {currentUserInfo} = userContext;
  const theme = UseTheme();
  const [notifications, setNotifications] = useState<Array<{id: number; userId: string; commentId: number; type: string; read: boolean; created_at: string;}>>([]);
  const location = useLocation();

  useEffect(() => {
      setNotifications([...notif]);
  }, []);

  useEffect(() => {
    axios.put('/api/notifications', {
      userId: currentUserInfo?.id,
    });

  }, [notifications]);


  const clearNotifications = (): void => {
    axios.delete('/api/notifications/all', {
      data: {
        userId: currentUserInfo?.id,
      }
    });
    setNotifications([]);
  };



  return (
    <div className="page-body">
      <Typography
    variant="h2">Notifications</Typography>
      <ColorButton onClick={clearNotifications}>Clear Notifications</ColorButton>
      <div >
        {notifications.map((notif, i) => {
          return (
            <div key={i}>

              <Notification key={location.key} getNotifications= {getNotifications} notif={notif}/>
            </div>
          );
        })}
      </div>
    </div>

  );
};

export default NotificationsFeed;
