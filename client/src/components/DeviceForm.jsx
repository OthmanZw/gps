import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Container, Typography, TextField, Button, Alert } from '@mui/material';
import axios from 'axios';
import NavBar from './NavBar';

const DeviceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    deviceId: '',
    description: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    if (id) {
      const fetchDevice = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/devices/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setFormData(response.data);
        } catch (error) {
          console.error('Error fetching device:', error);
          if (error.response?.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
          }
          setError('Erreur lors de la récupération des données de l\'appareil');
        }
      };

      fetchDevice();
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      if (id) {
        await axios.put(`http://localhost:3000/api/devices/${id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:3000/api/devices', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving device:', error);
      setError(error.response?.data?.message || 'Erreur lors de l\'enregistrement de l\'appareil');
    }
  };

  return (
    <>
      <NavBar />
      <Container maxWidth="sm">
        <Box sx={{ mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/dashboard')}
            sx={{ mb: 2 }}
          >
            Retour au tableau de bord
          </Button>
          <Typography variant="h5" sx={{ mb: 3 }}>
            {id ? 'Modifier l\'appareil' : 'Ajouter un appareil'}
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nom de l'appareil"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="ID de l'appareil"
              name="deviceId"
              value={formData.deviceId}
              onChange={handleChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
            >
              {id ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default DeviceForm; 