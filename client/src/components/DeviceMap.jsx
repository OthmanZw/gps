import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Alert, CircularProgress } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import NavBar from './NavBar';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const DeviceMap = () => {
  const [device, setDevice] = useState(null);
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { deviceId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchDeviceAndLocations = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch device details
        const deviceResponse = await axios.get(`http://localhost:3000/api/devices/${deviceId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDevice(deviceResponse.data);

        // Fetch location history
        const locationsResponse = await axios.get(`http://localhost:3000/api/locations/${deviceId}/history`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (locationsResponse.data && locationsResponse.data.length > 0) {
          console.log('Received locations:', locationsResponse.data.length);
          console.log('First location:', locationsResponse.data[0]);
          console.log('Last location:', locationsResponse.data[locationsResponse.data.length - 1]);
          
          // Trier les positions par timestamp (du plus ancien au plus récent)
          const sortedLocations = [...locationsResponse.data].sort((a, b) => 
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
          
          console.log('Sorted locations:', sortedLocations.map(loc => ({
            latitude: loc.latitude,
            longitude: loc.longitude,
            timestamp: loc.timestamp
          })));
          
          setLocations(sortedLocations);
        } else {
          setError('Aucune position disponible pour cet appareil');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError(error.response?.data?.message || 'Erreur lors de la récupération des données');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDeviceAndLocations();
  }, [deviceId, navigate]);

  if (loading) {
    return (
      <>
        <NavBar />
        <Container>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavBar />
        <Container>
          <Box sx={{ mt: 4 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        </Container>
      </>
    );
  }

  if (!device || locations.length === 0) {
    return (
      <>
        <NavBar />
        <Container>
          <Box sx={{ mt: 4 }}>
            <Alert severity="info">Aucune donnée disponible</Alert>
          </Box>
        </Container>
      </>
    );
  }

  // Calculer le centre de la carte (première position)
  const center = [locations[0].latitude, locations[0].longitude];

  // Préparer les positions pour la polyline
  const polylinePositions = locations.map(loc => [loc.latitude, loc.longitude]);

  return (
    <>
      <NavBar />
      <Container>
        <Box sx={{ mt: 4 }}>
          <Button variant="outlined" onClick={() => navigate('/dashboard')} sx={{ mb: 2 }}>
            Retour au tableau de bord
          </Button>
          <Typography variant="h5" sx={{ mb: 2 }}>
            {device.name} - Historique des positions ({locations.length} points)
          </Typography>
          <Box sx={{ height: '600px', width: '100%', position: 'relative' }}>
            <MapContainer
              center={center}
              zoom={14}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {locations.map((location, index) => (
                <Marker
                  key={index}
                  position={[location.latitude, location.longitude]}
                >
                  <Popup>
                    <div>
                      <strong>Point {index + 1}/{locations.length}</strong><br />
                      <strong>Date:</strong> {new Date(location.timestamp).toLocaleString()}<br />
                      <strong>Vitesse:</strong> {location.speed} km/h<br />
                      <strong>Altitude:</strong> {location.altitude} m<br />
                      <strong>Cap:</strong> {location.heading}°<br />
                      <strong>Batterie:</strong> {location.batteryLevel}%<br />
                      <strong>Position:</strong> [{location.latitude}, {location.longitude}]
                    </div>
                  </Popup>
                </Marker>
              ))}
              <Polyline
                positions={polylinePositions}
                color="blue"
                weight={3}
                opacity={0.7}
              />
            </MapContainer>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default DeviceMap; 