import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  DirectionsCar as VehicleIcon,
  Person as PersonIcon,
  Build as MaintenanceIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Group as GroupIcon
} from '@mui/icons-material';

const FleetManagement = () => {
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState([]);
  const [maintenanceTasks, setMaintenanceTasks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('vehicle'); // 'vehicle' ou 'maintenance'
  const [selectedItem, setSelectedItem] = useState(null);
  const [newItem, setNewItem] = useState({
    type: 'vehicle',
    name: '',
    status: 'active',
    assignedTo: '',
    group: 'default',
    lastMaintenance: '',
    nextMaintenance: ''
  });

  const vehicleStatuses = [
    { value: 'active', label: 'Actif', color: 'success' },
    { value: 'maintenance', label: 'En maintenance', color: 'warning' },
    { value: 'inactive', label: 'Inactif', color: 'error' }
  ];

  const groups = [
    { value: 'default', label: 'Par défaut' },
    { value: 'delivery', label: 'Livraison' },
    { value: 'sales', label: 'Commercial' },
    { value: 'service', label: 'Service' }
  ];

  useEffect(() => {
    // Simulons des données pour la démonstration
    const mockVehicles = [
      {
        id: 1,
        name: 'Véhicule 001',
        type: 'car',
        status: 'active',
        assignedTo: 'John Doe',
        group: 'delivery',
        lastMaintenance: '2024-01-15',
        nextMaintenance: '2024-04-15'
      },
      {
        id: 2,
        name: 'Véhicule 002',
        type: 'van',
        status: 'maintenance',
        assignedTo: 'Jane Smith',
        group: 'service',
        lastMaintenance: '2024-02-01',
        nextMaintenance: '2024-05-01'
      }
    ];

    const mockTasks = [
      {
        id: 1,
        vehicleId: 1,
        type: 'routine',
        description: 'Changement d\'huile',
        dueDate: '2024-04-15',
        status: 'pending',
        priority: 'medium'
      },
      {
        id: 2,
        vehicleId: 2,
        type: 'repair',
        description: 'Remplacement des freins',
        dueDate: '2024-03-20',
        status: 'in_progress',
        priority: 'high'
      }
    ];

    setVehicles(mockVehicles);
    setMaintenanceTasks(mockTasks);
    setLoading(false);
  }, []);

  const handleOpenDialog = (type, item = null) => {
    setDialogType(type);
    if (item) {
      setSelectedItem(item);
      setNewItem(item);
    } else {
      setSelectedItem(null);
      setNewItem({
        type: type === 'vehicle' ? 'car' : 'routine',
        name: '',
        status: 'active',
        assignedTo: '',
        group: 'default',
        lastMaintenance: '',
        nextMaintenance: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  const handleSave = () => {
    if (dialogType === 'vehicle') {
      if (selectedItem) {
        setVehicles(vehicles.map(v => v.id === selectedItem.id ? { ...newItem, id: selectedItem.id } : v));
      } else {
        setVehicles([...vehicles, { ...newItem, id: Date.now() }]);
      }
    } else {
      if (selectedItem) {
        setMaintenanceTasks(tasks => tasks.map(t => t.id === selectedItem.id ? { ...newItem, id: selectedItem.id } : t));
      } else {
        setMaintenanceTasks(tasks => [...tasks, { ...newItem, id: Date.now() }]);
      }
    }
    handleCloseDialog();
  };

  const handleDelete = (type, id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      if (type === 'vehicle') {
        setVehicles(vehicles.filter(v => v.id !== id));
      } else {
        setMaintenanceTasks(tasks => tasks.filter(t => t.id !== id));
      }
    }
  };

  const getStatusColor = (status) => {
    const statusObj = vehicleStatuses.find(s => s.value === status);
    return statusObj ? statusObj.color : 'default';
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
          Gestion de Flotte
        </Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('vehicle')}
            sx={{ mr: 2, borderRadius: 2, textTransform: 'none' }}
          >
            Ajouter un véhicule
          </Button>
          <Button
            variant="outlined"
            startIcon={<MaintenanceIcon />}
            onClick={() => handleOpenDialog('maintenance')}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Nouvelle maintenance
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Liste des véhicules */}
        <Grid item xs={12} md={8}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <VehicleIcon sx={{ mr: 1 }} />
                Véhicules
              </Typography>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nom</TableCell>
                      <TableCell>Groupe</TableCell>
                      <TableCell>Assigné à</TableCell>
                      <TableCell>Statut</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vehicles.map((vehicle) => (
                      <TableRow key={vehicle.id}>
                        <TableCell>{vehicle.name}</TableCell>
                        <TableCell>
                          <Chip
                            label={groups.find(g => g.value === vehicle.group)?.label}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PersonIcon sx={{ mr: 1, fontSize: 'small' }} />
                            {vehicle.assignedTo}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={vehicleStatuses.find(s => s.value === vehicle.status)?.label}
                            color={getStatusColor(vehicle.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog('vehicle', vehicle)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete('vehicle', vehicle.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Maintenance planifiée */}
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <MaintenanceIcon sx={{ mr: 1 }} />
                Maintenance Planifiée
              </Typography>
              <List>
                {maintenanceTasks.map((task) => (
                  <ListItem
                    key={task.id}
                    sx={{
                      border: 1,
                      borderColor: 'grey.200',
                      borderRadius: 1,
                      mb: 1,
                      '&:hover': { bgcolor: 'grey.50' }
                    }}
                  >
                    <ListItemIcon>
                      {task.priority === 'high' ? (
                        <ErrorIcon color="error" />
                      ) : task.priority === 'medium' ? (
                        <WarningIcon color="warning" />
                      ) : (
                        <CheckIcon color="success" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={task.description}
                      secondary={`Échéance: ${new Date(task.dueDate).toLocaleDateString()}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => handleOpenDialog('maintenance', task)}
                      >
                        <EditIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog pour ajouter/modifier */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedItem
            ? `Modifier ${dialogType === 'vehicle' ? 'le véhicule' : 'la maintenance'}`
            : `Ajouter ${dialogType === 'vehicle' ? 'un véhicule' : 'une maintenance'}`}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {dialogType === 'vehicle' ? (
              <>
                <TextField
                  fullWidth
                  label="Nom du véhicule"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  select
                  label="Groupe"
                  value={newItem.group}
                  onChange={(e) => setNewItem({ ...newItem, group: e.target.value })}
                  sx={{ mb: 2 }}
                >
                  {groups.map((group) => (
                    <MenuItem key={group.value} value={group.value}>
                      {group.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  label="Assigné à"
                  value={newItem.assignedTo}
                  onChange={(e) => setNewItem({ ...newItem, assignedTo: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  select
                  label="Statut"
                  value={newItem.status}
                  onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
                  sx={{ mb: 2 }}
                >
                  {vehicleStatuses.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </TextField>
              </>
            ) : (
              <>
                <TextField
                  fullWidth
                  label="Description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  type="date"
                  label="Date d'échéance"
                  value={newItem.dueDate}
                  onChange={(e) => setNewItem({ ...newItem, dueDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  select
                  label="Priorité"
                  value={newItem.priority}
                  onChange={(e) => setNewItem({ ...newItem, priority: e.target.value })}
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="low">Basse</MenuItem>
                  <MenuItem value="medium">Moyenne</MenuItem>
                  <MenuItem value="high">Haute</MenuItem>
                </TextField>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSave} variant="contained">
            {selectedItem ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FleetManagement; 