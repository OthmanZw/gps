import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Fab,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  BatteryFull as BatteryFullIcon,
  BatteryAlert as BatteryAlertIcon,
} from '@mui/icons-material';
import { deviceService } from '../services/api';

const DeviceList = () => {
  const [devices, setDevices] = useState([]);
  const [open, setOpen] = useState(false);
  const [editDevice, setEditDevice] = useState(null);
  const [formData, setFormData] = useState({
    deviceId: '',
    name: '',
    type: '',
  });
  const [error, setError] = useState('');

  const loadDevices = async () => {
    try {
      const response = await deviceService.getAllDevices();
      setDevices(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des appareils');
    }
  };

  useEffect(() => {
    loadDevices();
  }, []);

  const handleClickOpen = (device = null) => {
    if (device) {
      setEditDevice(device);
      setFormData({
        deviceId: device.deviceId,
        name: device.name,
        type: device.type,
      });
    } else {
      setEditDevice(null);
      setFormData({
        deviceId: '',
        name: '',
        type: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditDevice(null);
    setFormData({
      deviceId: '',
      name: '',
      type: '',
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editDevice) {
        await deviceService.updateDevice(editDevice._id, formData);
      } else {
        await deviceService.createDevice(formData);
      }
      handleClose();
      loadDevices();
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet appareil ?')) {
      try {
        await deviceService.deleteDevice(id);
        loadDevices();
      } catch (err) {
        setError('Erreur lors de la suppression');
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Mes Appareils
        </Typography>
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => handleClickOpen()}
        >
          <AddIcon />
        </Fab>
      </Box>

      <Grid container spacing={3}>
        {devices.map((device) => (
          <Grid item xs={12} sm={6} md={4} key={device._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" component="h2">
                    {device.name}
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleClickOpen(device)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(device._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  ID: {device.deviceId}
                </Typography>
                <Typography color="textSecondary">
                  Type: {device.type}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  {device.batteryLevel > 20 ? (
                    <BatteryFullIcon color="success" />
                  ) : (
                    <BatteryAlertIcon color="error" />
                  )}
                  <Typography>
                    Batterie: {device.batteryLevel}%
                  </Typography>
                </Box>
                <Box sx={{ mt: 1 }}>
                  <Chip
                    label={device.status === 'active' ? 'Actif' : 'Inactif'}
                    color={device.status === 'active' ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editDevice ? 'Modifier l\'appareil' : 'Ajouter un appareil'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="deviceId"
            label="ID de l'appareil"
            type="text"
            fullWidth
            value={formData.deviceId}
            onChange={handleChange}
            disabled={!!editDevice}
          />
          <TextField
            margin="dense"
            name="name"
            label="Nom de l'appareil"
            type="text"
            fullWidth
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="type"
            label="Type d'appareil"
            type="text"
            fullWidth
            value={formData.type}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editDevice ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeviceList; 