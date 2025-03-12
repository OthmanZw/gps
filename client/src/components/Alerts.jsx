import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Alert,
  Slider,
  CircularProgress
} from '@mui/material';
import {
  NotificationsActive as AlertIcon,
  Battery20 as BatteryIcon,
  Speed as SpeedIcon,
  LocationOff as LocationOffIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

const Alerts = () => {
  const [loading, setLoading] = useState(true);
  const [alertRules, setAlertRules] = useState([]);
  const [alertHistory, setAlertHistory] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  const [error, setError] = useState(null);
  const [newRule, setNewRule] = useState({
    type: 'battery',
    name: '',
    threshold: 20,
    enabled: true,
    notifyBy: ['app']
  });

  const alertTypes = [
    { value: 'battery', label: 'Niveau de batterie', icon: <BatteryIcon /> },
    { value: 'speed', label: 'Vitesse excessive', icon: <SpeedIcon /> },
    { value: 'geofence', label: 'Sortie de zone', icon: <LocationOffIcon /> },
    { value: 'offline', label: 'Appareil hors ligne', icon: <WarningIcon /> }
  ];

  const notificationMethods = [
    { value: 'app', label: 'Application' },
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS' }
  ];

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        
        // Récupérer les règles d'alertes
        const rulesResponse = await axios.get('http://localhost:3000/api/alerts/rules', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Récupérer l'historique des alertes
        const historyResponse = await axios.get('http://localhost:3000/api/alerts/history', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setAlertRules(rulesResponse.data);
        setAlertHistory(historyResponse.data);
      } catch (err) {
        console.error('Erreur lors de la récupération des alertes:', err);
        setError('Impossible de charger les alertes. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const handleOpenDialog = (rule = null) => {
    if (rule) {
      setSelectedRule(rule);
      setNewRule(rule);
    } else {
      setSelectedRule(null);
      setNewRule({
        type: 'battery',
        name: '',
        threshold: 20,
        enabled: true,
        notifyBy: ['app']
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRule(null);
  };

  const handleSaveRule = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (selectedRule) {
        // Modifier une règle existante
        await axios.put(`http://localhost:3000/api/alerts/rules/${selectedRule._id}`, newRule, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAlertRules(alertRules.map(r => r._id === selectedRule._id ? { ...newRule, _id: selectedRule._id } : r));
      } else {
        // Créer une nouvelle règle
        const response = await axios.post('http://localhost:3000/api/alerts/rules', newRule, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAlertRules([...alertRules, response.data]);
      }
      handleCloseDialog();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde de la règle:', err);
      setError('Impossible de sauvegarder la règle. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRule = async (ruleId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette règle ?')) {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3000/api/alerts/rules/${ruleId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAlertRules(alertRules.filter(r => r._id !== ruleId));
      } catch (err) {
        console.error('Erreur lors de la suppression de la règle:', err);
        setError('Impossible de supprimer la règle. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleNotification = (method) => {
    const notifyBy = newRule.notifyBy.includes(method)
      ? newRule.notifyBy.filter(m => m !== method)
      : [...newRule.notifyBy, method];
    setNewRule({ ...newRule, notifyBy });
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'error': return <ErrorIcon color="error" />;
      case 'warning': return <WarningIcon color="warning" />;
      default: return <CheckCircleIcon color="success" />;
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
      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Système d'Alertes
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 2, textTransform: 'none' }}
        >
          Nouvelle Alerte
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Règles d'alertes */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <AlertIcon sx={{ mr: 1 }} />
                Règles d'Alertes
              </Typography>
              <List>
                {alertRules.map((rule) => (
                  <ListItem
                    key={rule._id}
                    sx={{
                      border: 1,
                      borderColor: 'grey.200',
                      borderRadius: 1,
                      mb: 1,
                      '&:hover': { bgcolor: 'grey.50' }
                    }}
                  >
                    <ListItemIcon>
                      {alertTypes.find(t => t.value === rule.type)?.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={rule.name}
                      secondary={`Seuil: ${rule.threshold}${rule.type === 'speed' ? ' km/h' : rule.type === 'geofence' ? ' m' : '%'}`}
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={rule.enabled}
                        onChange={() => {
                          const updatedRule = { ...rule, enabled: !rule.enabled };
                          handleSaveRule(updatedRule);
                        }}
                      />
                      <IconButton
                        edge="end"
                        onClick={() => handleOpenDialog(rule)}
                        sx={{ ml: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        onClick={() => handleDeleteRule(rule._id)}
                        sx={{ ml: 1 }}
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

        {/* Historique des alertes */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <WarningIcon sx={{ mr: 1 }} />
                Historique des Alertes
              </Typography>
              <List>
                {alertHistory.map((alert) => (
                  <ListItem
                    key={alert._id}
                    sx={{
                      border: 1,
                      borderColor: 'grey.200',
                      borderRadius: 1,
                      mb: 1,
                      bgcolor: alert.status === 'unread' ? 'action.hover' : 'transparent'
                    }}
                  >
                    <ListItemIcon>
                      {getSeverityIcon(alert.severity)}
                    </ListItemIcon>
                    <ListItemText
                      primary={alert.message}
                      secondary={`${alert.deviceId} - ${new Date(alert.createdAt).toLocaleString()}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog pour ajouter/modifier une règle */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedRule ? 'Modifier la règle' : 'Nouvelle règle d\'alerte'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              select
              label="Type d'alerte"
              value={newRule.type}
              onChange={(e) => setNewRule({ ...newRule, type: e.target.value })}
              sx={{ mb: 2 }}
            >
              {alertTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {type.icon}
                    <Typography sx={{ ml: 1 }}>{type.label}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Nom de la règle"
              value={newRule.name}
              onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
              sx={{ mb: 2 }}
            />

            <Typography gutterBottom>
              Seuil {newRule.type === 'speed' ? '(km/h)' : newRule.type === 'geofence' ? '(mètres)' : '(%)'}
            </Typography>
            <Slider
              value={newRule.threshold}
              onChange={(e, value) => setNewRule({ ...newRule, threshold: value })}
              min={0}
              max={newRule.type === 'speed' ? 200 : newRule.type === 'geofence' ? 1000 : 100}
              valueLabelDisplay="auto"
              sx={{ mb: 3 }}
            />

            <Typography gutterBottom>Notifications via</Typography>
            <Box sx={{ mb: 2 }}>
              {notificationMethods.map((method) => (
                <Chip
                  key={method.value}
                  label={method.label}
                  onClick={() => handleToggleNotification(method.value)}
                  color={newRule.notifyBy.includes(method.value) ? 'primary' : 'default'}
                  sx={{ mr: 1 }}
                />
              ))}
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={newRule.enabled}
                  onChange={(e) => setNewRule({ ...newRule, enabled: e.target.checked })}
                />
              }
              label="Activer la règle"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSaveRule} variant="contained">
            {selectedRule ? 'Modifier' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Alerts; 