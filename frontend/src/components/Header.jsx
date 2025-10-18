import React from 'react';

function Header() {
  return (
    <header className="main-header">
        <div className="container">
           <a href="/" className="logo">
                 <img src="/images/Logo.png" alt="Logo de Pop Bubbles" />
            </a>
            <nav className="main-nav">
                <a href="#inicio">Inicio</a>
                <a href="#menu">Menú</a>
                <a href="#contacto">Contactanos</a>
            </nav>
        </div>
    </header>
  );
}

export default Header;