import React from 'react';
import { useAuth } from '../context/AuthContext'; // 1. Importar el hook

function Sidebar() {
    // 2. Obtener la función 'logout' del contexto
    const { logout } = useAuth();

    // 3. La función handleLogout ahora llama a la función del contexto
    const handleLogout = (e) => {
        e.preventDefault(); // Prevenir cualquier acción default del botón
        console.log("Cerrando sesión...");
        logout();
    };

    return (
        <aside className="sidebar">
            <a href="/" className="sidebar-logo">
                <img src="/images/Logo2.png" alt="Logo Pop Bubbles" />
            </a>
            <nav className="sidebar-nav">
                <p className="sidebar-nav-category">Agregar:</p>
                <ul>
                    <li className="sidebar-nav-item"><a href="#add-product-section">Productos</a></li>
                    <li className="sidebar-nav-item"><a href="#add-branch-section">Sucursal</a></li>
                    {/* 4. AÑADIR ENLACE A FORMULARIO DE USUARIOS */}
                    <li className="sidebar-nav-item"><a href="#add-user-section">Usuarios</a></li>
                </ul>
                <p className="sidebar-nav-category">Ver:</p>
                <ul>
                    <li className="sidebar-nav-item"><a href="#products-list-section">Productos actuales</a></li>
                    <li className="sidebar-nav-item"><a href="#branches-list-section">Sucursales actuales</a></li>
                    {/* 5. AÑADIR ENLACE A LISTA DE USUARIOS */}
                    <li className="sidebar-nav-item"><a href="#users-list-section">Usuarios actuales</a></li>
                </ul>
                <p className="sidebar-nav-category">Acciones:</p>
                <ul>
                    {/* El logout ahora usa 'onClick' y llama a 'handleLogout' */}
                    <li className="sidebar-nav-item">
                        <button
                            onClick={handleLogout}
                            style={{color: '#DC3545', fontWeight: 'bold', background: 'none', border: 'none', padding: '0', cursor: 'pointer', fontSize: '1.7rem', display: 'block', width: '100%', textAlign: 'left', paddingLeft: '0.75rem'}}
                        >
                            Cerrar Sesión
                        </button>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;