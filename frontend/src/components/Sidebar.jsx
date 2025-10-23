import React from 'react';
// import { Link } from 'react-router-dom'; // Para navegación interna

function Sidebar() {

    // Función para cerrar sesión
    const handleLogout = () => {
        console.log("Cerrando sesión...");
        // Lógica de logout con axios
        // axios.post('http://localhost:5000/api/logout')
        //   .then(() => window.location.href = '/login');
    };

    return (
        <aside className="sidebar">
            <a href="/" className="sidebar-logo">
                <img src="/images/Logo2.png" alt="Logo Pop Bubbles" />
            </a>
            <nav className="sidebar-nav">
                <p className="sidebar-nav-category">Agregar:</p>
                <ul>
                    {/* En React, usamos `href` para links a IDs de la misma página */}
                    <li className="sidebar-nav-item"><a href="#add-product-section">Productos</a></li>
                    <li className="sidebar-nav-item"><a href="#add-branch-section">Sucursal</a></li>
                </ul>
                <p className="sidebar-nav-category">Ver:</p>
                <ul>
                    <li className="sidebar-nav-item"><a href="#products-list-section">Productos actuales</a></li>
                    <li className="sidebar-nav-item"><a href="#branches-list-section">Sucursales actuales</a></li>
                </ul>
                <p className="sidebar-nav-category">Acciones:</p>
                <ul>
                    {/* El logout ahora es un botón que llama a una función */}
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