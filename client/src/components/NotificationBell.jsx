import React, { useState, useEffect } from 'react';
import { Badge, IconButton, Menu, MenuItem, Typography, Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BatteryAlertIcon from '@mui/icons-material/BatteryAlert';
import SpeedIcon from '@mui/icons-material/Speed';
import LocationOffIcon from '@mui/icons-material/LocationOff';
import WarningIcon from '@mui/icons-material/Warning';
import axios from 'axios';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/alerts/history', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // On garde toutes les alertes, pas seulement les non lues
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Rafraîchir les notifications toutes les 30 secondes
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const getAlertIcon = (type) => {
        switch (type) {
            case 'battery':
                return <BatteryAlertIcon color="error" />;
            case 'speed':
                return <SpeedIcon color="error" />;
            case 'geofence':
                return <LocationOffIcon color="warning" />;
            case 'offline':
                return <WarningIcon color="warning" />;
            default:
                return <NotificationsIcon />;
        }
    };

    // Calculer le nombre de notifications non lues
    const unreadCount = notifications.filter(notif => notif.status === 'unread').length;

    return (
        <>
            <IconButton
                color="inherit"
                onClick={handleClick}
                aria-label={`${unreadCount} notifications`}
            >
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: '400px',
                        width: '350px',
                    },
                }}
            >
                {notifications.length === 0 ? (
                    <MenuItem disabled>
                        <Typography>Aucune notification</Typography>
                    </MenuItem>
                ) : (
                    notifications.map((notification) => (
                        <MenuItem 
                            key={notification._id}
                            sx={{
                                backgroundColor: notification.status === 'unread' ? 'action.hover' : 'transparent',
                                '&:hover': {
                                    backgroundColor: notification.status === 'unread' ? 'action.selected' : 'action.hover',
                                },
                                padding: '12px'
                            }}
                        >
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'flex-start', 
                                gap: '8px', 
                                width: '100%'
                            }}>
                                {getAlertIcon(notification.type)}
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography 
                                        variant="subtitle2" 
                                        sx={{ 
                                            fontWeight: notification.status === 'unread' ? 'bold' : 'medium',
                                            color: notification.status === 'unread' ? 'text.primary' : 'text.secondary'
                                        }}
                                    >
                                        {notification.message}
                                    </Typography>
                                    <Typography 
                                        variant="caption" 
                                        color="textSecondary"
                                        sx={{ display: 'block', mt: 0.5 }}
                                    >
                                        {notification.deviceId} - {new Date(notification.createdAt).toLocaleString()}
                                    </Typography>
                                </Box>
                            </Box>
                        </MenuItem>
                    ))
                )}
            </Menu>
        </>
    );
};

export default NotificationBell; 