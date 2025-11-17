import React from 'react';
import { Routes, Route } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';

// Importa tus páginas
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import BranchDashboard from './pages/BranchDashboard';
import RegisterPage from './pages/RegisterPage';
import MyOrdersPage from './pages/MyOrdersPage'; // <-- 1. IMPORTAR

function App() {
  return (
    <Routes>
      {/* --- Rutas Públicas --- */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* --- Rutas Protegidas --- */}

      <Route
        path="/admin"
        element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>}
      />

      <Route
        path="/branch-dashboard"
        element={<ProtectedRoute role="sucursal"><BranchDashboard /></ProtectedRoute>}
      />

      {/* 2. DESCOMENTAR Y ACTIVAR LA RUTA */}
      <Route
        path="/my-orders"
        element={
          <ProtectedRoute role="cliente">
            <MyOrdersPage />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;