import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Timeline,
  Battery90 as BatteryIcon,
  Speed as SpeedIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalDevices: 0,
    activeDevices: 0,
    averageBattery: 0,
    totalDistance: 0,
  });
  const [batteryData, setBatteryData] = useState([]);
  const [activityData, setActivityData] = useState([]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        // Simulons des données pour la démonstration
        // Dans un environnement réel, ces données viendraient de votre API
        const mockData = {
          stats: {
            totalDevices: 12,
            activeDevices: 8,
            averageBattery: 75,
            totalDistance: 1250,
          },
          batteryHistory: [
            { date: '2024-01', level: 90 },
            { date: '2024-02', level: 85 },
            { date: '2024-03', level: 75 },
            { date: '2024-04', level: 80 },
          ],
          activityDistribution: [
            { name: 'En mouvement', value: 45 },
            { name: 'Stationnaire', value: 30 },
            { name: 'Inactif', value: 15 },
            { name: 'Maintenance', value: 10 },
          ],
        };

        setStats(mockData.stats);
        setBatteryData(mockData.batteryHistory);
        setActivityData(mockData.activityDistribution);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setError('Erreur lors de la récupération des analyses');
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}>
        Analyses et Statistiques
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Cartes de statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={3}
            sx={{
              height: '100%',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Timeline color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Appareils Totaux</Typography>
              </Box>
              <Typography variant="h4" sx={{ textAlign: 'center', color: 'primary.main' }}>
                {stats.totalDevices}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Dont {stats.activeDevices} actifs
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={3}
            sx={{
              height: '100%',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BatteryIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Batterie Moyenne</Typography>
              </Box>
              <Typography variant="h4" sx={{ textAlign: 'center', color: 'success.main' }}>
                {stats.averageBattery}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={3}
            sx={{
              height: '100%',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SpeedIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">Distance Totale</Typography>
              </Box>
              <Typography variant="h4" sx={{ textAlign: 'center', color: 'info.main' }}>
                {stats.totalDistance} km
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={3}
            sx={{
              height: '100%',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TimeIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Temps d'Activité</Typography>
              </Box>
              <Typography variant="h4" sx={{ textAlign: 'center', color: 'warning.main' }}>
                85%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Graphiques */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Historique des Niveaux de Batterie</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={batteryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="level" stroke="#8884d8" name="Niveau de batterie (%)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Distribution de l'Activité</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={activityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {activityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Analytics; 