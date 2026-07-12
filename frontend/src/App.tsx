import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AllCars from './pages/AllCars';
import VehicleDetail from './pages/VehicleDetail';
import ProtectedAdminRoute from './routes/ProtectedAdminRoute';
import VehicleManagement from './pages/admin/VehicleManagement';
import AddVehicle from './pages/admin/AddVehicle';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/cars" element={<AllCars />} />
        <Route path="/vehicle/:id" element={<VehicleDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route
          path="/admin/vehicles"
          element={
            <ProtectedAdminRoute>
              <VehicleManagement />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/add-vehicle"
          element={
            <ProtectedAdminRoute>
              <AddVehicle />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
