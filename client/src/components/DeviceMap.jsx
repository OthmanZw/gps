import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Alert, CircularProgress } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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
          setLocations(locationsResponse.data);
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
          <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Button variant="outlined" onClick={() => navigate('/dashboard')} sx={{ mb: 2, alignSelf: 'flex-start' }}>
              Retour au tableau de bord
            </Button>
            <CircularProgress sx={{ mt: 4 }} />
            <Typography sx={{ mt: 2 }}>Chargement des données...</Typography>
          </Box>
        </Container>
      </>
    );
  }

  if (error || !device || locations.length === 0) {
    return (
      <>
        <NavBar />
        <Container>
          <Box sx={{ mt: 4 }}>
            <Button variant="outlined" onClick={() => navigate('/dashboard')} sx={{ mb: 2 }}>
              Retour au tableau de bord
            </Button>
            <Alert severity={error ? "error" : "info"} sx={{ mt: 2 }}>
              {error || 'Aucune position enregistrée pour cet appareil'}
            </Alert>
            {device && (
              <Typography variant="h6" sx={{ mt: 2 }}>
                Appareil : {device.name}
              </Typography>
            )}
          </Box>
        </Container>
      </>
    );
  }

  const center = [locations[0].latitude, locations[0].longitude];

  return (
    <>
      <NavBar />
      <Container>
        <Box sx={{ mt: 4 }}>
          <Button variant="outlined" onClick={() => navigate('/dashboard')} sx={{ mb: 2 }}>
            Retour au tableau de bord
          </Button>
          <Typography variant="h5" sx={{ mb: 2 }}>
            {device.name} - Historique des positions
          </Typography>
          <Box sx={{ height: '600px', width: '100%', position: 'relative' }}>
            <MapContainer
              center={center}
              zoom={13}
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
                      <strong>Date:</strong> {new Date(location.timestamp).toLocaleString()}<br />
                      <strong>Latitude:</strong> {location.latitude.toFixed(6)}<br />
                      <strong>Longitude:</strong> {location.longitude.toFixed(6)}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default DeviceMap; 