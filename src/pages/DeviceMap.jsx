import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Box, Typography, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import L from 'leaflet';
import { deviceService, locationService } from '../services/api';

// Correction des icônes Leaflet pour React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const DeviceMap = () => {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [locations, setLocations] = useState([]);
  const [center, setCenter] = useState([48.8584, 2.2945]); // Paris par défaut

  useEffect(() => {
    loadDevices();
  }, []);

  useEffect(() => {
    if (selectedDevice) {
      loadLocations(selectedDevice);
    }
  }, [selectedDevice]);

  const loadDevices = async () => {
    try {
      const response = await deviceService.getAllDevices();
      setDevices(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des appareils:', err);
    }
  };

  const loadLocations = async (deviceId) => {
    try {
      const response = await locationService.getDeviceLocations(deviceId);
      setLocations(response.data);
      
      // Centrer la carte sur la dernière position si elle existe
      if (response.data.length > 0) {
        const lastLocation = response.data[0];
        setCenter([
          lastLocation.location.coordinates[1],
          lastLocation.location.coordinates[0]
        ]);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des positions:', err);
    }
  };

  const handleDeviceChange = (event) => {
    setSelectedDevice(event.target.value);
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Carte des Appareils
        </Typography>
        <FormControl fullWidth>
          <InputLabel>Sélectionner un appareil</InputLabel>
          <Select
            value={selectedDevice}
            label="Sélectionner un appareil"
            onChange={handleDeviceChange}
          >
            <MenuItem value="">
              <em>Tous les appareils</em>
            </MenuItem>
            {devices.map((device) => (
              <MenuItem key={device._id} value={device.deviceId}>
                {device.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      <Paper sx={{ height: 'calc(100vh - 250px)', overflow: 'hidden' }}>
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {locations.map((location) => (
            <Marker
              key={location._id}
              position={[
                location.location.coordinates[1],
                location.location.coordinates[0]
              ]}
            >
              <Popup>
                <Typography variant="subtitle2">
                  {devices.find(d => d.deviceId === selectedDevice)?.name}
                </Typography>
                <Typography variant="body2">
                  Vitesse: {location.speed} km/h
                </Typography>
                <Typography variant="body2">
                  Batterie: {location.batteryLevel}%
                </Typography>
                <Typography variant="body2">
                  Date: {new Date(location.timestamp).toLocaleString()}
                </Typography>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Paper>
    </Box>
  );
};

export default DeviceMap; 