import React from 'react';
import { Link } from 'react-router-dom'; // Para /login, /my-orders, etc.
import { HashLink } from 'react-router-hash-link'; // 1. IMPORTAMOS HashLink
import { useAuth } from '../context/AuthContext';
// (Ya no necesitamos useCart aquí, lo cual es correcto)

function Header() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="main-header">
        <div className="container">
           {/* El logo ya apunta a "/", lo cual está perfecto */}
           <a href="/" className="logo">
                 <img src="/images/Logo.png" alt="Logo de Pop Bubbles" />
            </a>

            {/* 2. REEMPLAZAMOS <a> por <HashLink> */}
            <nav className="main-nav">
                <HashLink to="/#inicio">Inicio</HashLink>
                <HashLink to="/#menu">Menú</HashLink>
                <HashLink to="/#contacto">Contactanos</HashLink>
            </nav>

            <nav className="auth-nav">

                {/* Esto ya usa <Link>, lo cual es correcto */}
                {isAuthenticated && user?.rol === 'cliente' && (
                  <Link to="/my-orders" className="auth-link">Mis Pedidos</Link>
                )}

                {isAuthenticated ? (
                  <a href="#" onClick={logout} className="auth-link logout">
                    Cerrar Sesión
                  </a>
                ) : (
                  <>
                    <Link to="/login" className="auth-link">
                      Inicio sesión
                    </Link>
                    <Link to="/register" className="auth-link register">
                      Registro
                    </Link>
                  </>
                )}

                {/* El botón del carrito ya no está aquí, lo cual es correcto */}
            </nav>

        </div>
    </header>
  );
}

export default Header;