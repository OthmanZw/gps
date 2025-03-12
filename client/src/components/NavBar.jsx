import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import NotificationBell from './NotificationBell';

const NavBar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    GPS Tracker
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <NotificationBell />
                    <Button color="inherit" onClick={() => navigate('/dashboard')}>
                        Tableau de bord
                    </Button>
                    <Button color="inherit" onClick={handleLogout}>
                        Déconnexion
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar; 