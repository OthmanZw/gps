import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Notifications as NotificationIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Geofencing = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  const [newZone, setNewZone] = useState({
    name: '',
    radius: 100,
    lat: 0,
    lng: 0,
    notifications: true
  });

  useEffect(() => {
    // Simulons des données de zones pour la démonstration
    const mockZones = [
      {
        id: 1,
        name: 'Zone Bureau',
        radius: 200,
        lat: 48.8566,
        lng: 2.3522,
        notifications: true,
        color: '#FF4444'
      },
      {
        id: 2,
        name: 'Zone Entrepôt',
        radius: 300,
        lat: 48.8606,
        lng: 2.3376,
        notifications: true,
        color: '#44FF44'
      }
    ];
    setZones(mockZones);
    setLoading(false);
  }, []);

  const handleOpenDialog = (zone = null) => {
    if (zone) {
      setSelectedZone(zone);
      setNewZone(zone);
    } else {
      setSelectedZone(null);
      setNewZone({
        name: '',
        radius: 100,
        lat: 48.8566,
        lng: 2.3522,
        notifications: true
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedZone(null);
  };

  const handleSaveZone = () => {
    if (selectedZone) {
      setZones(zones.map(z => z.id === selectedZone.id ? { ...newZone, id: selectedZone.id } : z));
    } else {
      setZones([...zones, { ...newZone, id: Date.now(), color: `#${Math.floor(Math.random()*16777215).toString(16)}` }]);
    }
    handleCloseDialog();
  };

  const handleDeleteZone = (zoneId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette zone ?')) {
      setZones(zones.filter(z => z.id !== zoneId));
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Gestion des Zones
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 2, textTransform: 'none' }}
        >
          Ajouter une zone
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card elevation={3} sx={{ height: '500px' }}>
            <CardContent sx={{ height: '100%', p: '0 !important' }}>
              <MapContainer
                center={[48.8566, 2.3522]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {zones.map((zone) => (
                  <Circle
                    key={zone.id}
                    center={[zone.lat, zone.lng]}
                    radius={zone.radius}
                    pathOptions={{ color: zone.color }}
                  >
                    <Popup>
                      <Typography variant="subtitle1">{zone.name}</Typography>
                      <Typography variant="body2">Rayon: {zone.radius}m</Typography>
                    </Popup>
                  </Circle>
                ))}
              </MapContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Zones Actives
              </Typography>
              <List>
                {zones.map((zone) => (
                  <ListItem
                    key={zone.id}
                    sx={{
                      border: 1,
                      borderColor: 'grey.200',
                      borderRadius: 1,
                      mb: 1,
                      '&:hover': { bgcolor: 'grey.50' }
                    }}
                  >
                    <LocationIcon sx={{ mr: 2, color: zone.color }} />
                    <ListItemText
                      primary={zone.name}
                      secondary={`Rayon: ${zone.radius}m`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => handleOpenDialog(zone)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        onClick={() => handleDeleteZone(zone.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedZone ? 'Modifier la zone' : 'Ajouter une nouvelle zone'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Nom de la zone"
              value={newZone.name}
              onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="number"
              label="Rayon (mètres)"
              value={newZone.radius}
              onChange={(e) => setNewZone({ ...newZone, radius: Number(e.target.value) })}
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Latitude"
                  value={newZone.lat}
                  onChange={(e) => setNewZone({ ...newZone, lat: Number(e.target.value) })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Longitude"
                  value={newZone.lng}
                  onChange={(e) => setNewZone({ ...newZone, lng: Number(e.target.value) })}
                />
              </Grid>
            </Grid>
            <FormControlLabel
              control={
                <Switch
                  checked={newZone.notifications}
                  onChange={(e) => setNewZone({ ...newZone, notifications: e.target.checked })}
                />
              }
              label="Activer les notifications"
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSaveZone} variant="contained">
            {selectedZone ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Geofencing; 