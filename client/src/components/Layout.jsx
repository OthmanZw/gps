import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import NotificationBell from './NotificationBell';

const Layout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          ml: { sm: `240px` },
          mt: 8,
        }}
      >
        <Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 1200 }}>
          <NotificationBell />
        </Box>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout; 