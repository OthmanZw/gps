import React, { useState, useEffect } from 'react';
import { Badge, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BatteryAlertIcon from '@mui/icons-material/BatteryAlert';
import axios from 'axios';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/notifications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Rafraîchir les notifications toutes les minutes
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    return (
        <>
            <IconButton
                color="inherit"
                onClick={handleClick}
                aria-label={`${notifications.length} notifications`}
            >
                <Badge badgeContent={notifications.length} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: '300px',
                        width: '300px',
                    },
                }}
            >
                {notifications.length === 0 ? (
                    <MenuItem>
                        <Typography>Aucune notification</Typography>
                    </MenuItem>
                ) : (
                    notifications.map((notification, index) => (
                        <MenuItem key={index} onClick={handleClose}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {notification.type === 'low_battery' && <BatteryAlertIcon color="error" />}
                                <div>
                                    <Typography variant="subtitle2">
                                        {notification.deviceName} - Batterie faible ({notification.batteryLevel}%)
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        {formatTimestamp(notification.timestamp)}
                                    </Typography>
                                </div>
                            </div>
                        </MenuItem>
                    ))
                )}
            </Menu>
        </>
    );
};

export default NotificationBell; 