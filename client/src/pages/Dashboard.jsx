import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
  Divider,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Map as MapIcon,
  Add as AddIcon,
  Battery20 as BatteryLowIcon,
  Battery90 as BatteryHighIcon,
  SignalCellular4Bar as SignalIcon,
  SignalCellularOff as NoSignalIcon
} from '@mui/icons-material';
import axios from 'axios';
import NavBar from '../components/NavBar';

const Dashboard = () => {
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
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
      } finally {
        setLoading(false);
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

  const getBatteryColor = (level) => {
    if (level > 60) return 'success';
    if (level > 20) return 'warning';
    return 'error';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'maintenance': return 'warning';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Tableau de bord
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/devices/new')}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              py: 1.5
            }}
          >
            Ajouter un appareil
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Grid container spacing={3}>
          {devices.map((device) => (
            <Grid item xs={12} sm={6} md={4} key={device.deviceId}>
              <Card 
                elevation={3}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" component="h2">
                      {device.name}
                    </Typography>
                    <Chip
                      label={device.status}
                      color={getStatusColor(device.status)}
                      size="small"
                    />
                  </Box>
                  <Typography color="textSecondary" gutterBottom>
                    ID: {device.deviceId}
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    {device.batteryLevel > 20 ? (
                      <BatteryHighIcon color={getBatteryColor(device.batteryLevel)} />
                    ) : (
                      <BatteryLowIcon color="error" />
                    )}
                    <Typography sx={{ ml: 1 }}>
                      {device.batteryLevel}%
                    </Typography>
                    {device.status === 'active' ? (
                      <SignalIcon color="success" sx={{ ml: 2 }} />
                    ) : (
                      <NoSignalIcon color="error" sx={{ ml: 2 }} />
                    )}
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                  <Tooltip title="Voir sur la carte">
                    <IconButton
                      onClick={() => navigate(`/device/${device.deviceId}`)}
                      size="small"
                      color="primary"
                    >
                      <MapIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Modifier">
                    <IconButton
                      onClick={() => navigate(`/devices/${device.deviceId}/edit`)}
                      size="small"
                      color="info"
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Supprimer">
                    <IconButton
                      onClick={() => handleDelete(device.deviceId)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {devices.length === 0 && !loading && (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              backgroundColor: 'background.paper',
              borderRadius: 2,
              mt: 4
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Aucun appareil GPS enregistré
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/devices/new')}
              sx={{ mt: 2 }}
            >
              Ajouter un appareil
            </Button>
          </Box>
        )}
      </Container>
    </>
  );
};

export default Dashboard; 