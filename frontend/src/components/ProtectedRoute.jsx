import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importamos nuestro hook de Auth

/**
 * Este componente protege las rutas.
 * Revisa si el usuario está autenticado.
 * Si se le pasa un 'role', también revisa que el usuario tenga ese rol.
 */
function ProtectedRoute({ children, role }) {
    // --- LÍNEA CORREGIDA ---
    // Se eliminó el guion bajo extra al final
    const { isAuthenticated, user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        // Muestra "Cargando..." mientras se verifica la sesión
        return <div>Cargando sesión...</div>;
    }

    // 1. Si no está autenticado
    if (!isAuthenticated) {
        // Redirige al login, guardando la página que intentaba visitar
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. Si se requiere un rol específico y el usuario no lo tiene
    if (role && user.rol !== role) {
        // Redirige a la página de inicio (o a "no autorizado")
        return <Navigate to="/" replace />;
    }

    // 3. Si todo está en orden, muestra la página solicitada
    return children;
}

export default ProtectedRoute;