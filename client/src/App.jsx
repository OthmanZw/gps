import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import DeviceMap from './components/DeviceMap';
import DeviceForm from './components/DeviceForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/device/:deviceId" element={<DeviceMap />} />
        <Route path="/devices/new" element={<DeviceForm />} />
        <Route path="/devices/:id/edit" element={<DeviceForm />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
