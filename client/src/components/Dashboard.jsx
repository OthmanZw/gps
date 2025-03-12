import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Map as MapIcon
} from '@mui/icons-material';
import axios from 'axios';
import NavBar from './NavBar';

const Dashboard = () => {
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchDevices = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/devices', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDevices(response.data);
      } catch (error) {
        console.error('Error fetching devices:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
        setError('Erreur lors de la récupération des appareils');
      }
    };

    fetchDevices();
  }, [navigate]);

  const handleDelete = async (deviceId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet appareil ?')) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/devices/${deviceId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDevices(devices.filter(device => device.deviceId !== deviceId));
    } catch (error) {
      console.error('Error deleting device:', error);
      setError('Erreur lors de la suppression de l\'appareil');
    }
  };

  return (
    <>
      <NavBar />
      <Container>
        <Box sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">
            Tableau de bord
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/devices/new')}
          >
            Ajouter un appareil
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <List>
          {devices.map((device) => (
            <ListItem
              key={device.deviceId}
              sx={{
                border: 1,
                borderColor: 'grey.300',
                borderRadius: 1,
                mb: 1,
                '&:hover': {
                  backgroundColor: 'grey.50'
                }
              }}
            >
              <ListItemText
                primary={device.name}
                secondary={`ID: ${device.deviceId} - ${device.description || 'Aucune description'}`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="map"
                  onClick={() => navigate(`/device/${device.deviceId}`)}
                  sx={{ mr: 1 }}
                >
                  <MapIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => navigate(`/devices/${device.deviceId}/edit`)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(device.deviceId)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>

        {devices.length === 0 && (
          <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
            Aucun appareil GPS enregistré
          </Typography>
        )}
      </Container>
    </>
  );
};

export default Dashboard; 