import React from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axiosConfig'; // 1. Importamos axios
import { Download, LogOut } from 'lucide-react'; // Opcional: Iconos bonitos

function Sidebar() {
    const { logout, user } = useAuth();

    const handleLogout = (e) => {
        e.preventDefault();
        console.log("Cerrando sesión...");
        logout();
    };

    // 2. Función para descargar el respaldo
    const handleDownloadBackup = async (e) => {
        e.preventDefault();
        // Confirmación simple
        if (!window.confirm("¿Deseas descargar una copia de seguridad de la base de datos?")) return;

        try {
            console.log("Generando respaldo...");
            const response = await axios.get('/backup', {
                responseType: 'blob', // Importante: indicamos que esperamos un archivo binario
            });

            // Crear un enlace invisible para forzar la descarga
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            // Extraer nombre de archivo si es posible, o usar uno genérico
            const contentDisposition = response.headers['content-disposition'];
            let fileName = 'backup_bubble_tea.sql';
            if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
                if (fileNameMatch.length === 2)
                    fileName = fileNameMatch[1];
            }

            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();

            // Limpieza
            link.parentNode.removeChild(link);
            alert("¡Respaldo descargado correctamente!");

        } catch (error) {
            console.error("Error descargando respaldo:", error);
            alert("Hubo un error al generar el respaldo. Verifica que 'mysqldump' esté instalado en el servidor.");
        }
    };

    return (
        <aside className="sidebar">
            <a href="/" className="sidebar-logo">
                <img src="/images/Logo2.png" alt="Logo Pop Bubbles" />
            </a>
            <nav className="sidebar-nav">
                {/* SOLO ADMIN ve estas opciones */}
                {user && user.rol === 'admin' ? (
                    <>
                        <p className="sidebar-nav-category">Agregar:</p>
                        <ul>
                            <li className="sidebar-nav-item"><a href="#add-product-section">Productos</a></li>
                            <li className="sidebar-nav-item"><a href="#add-branch-section">Sucursal</a></li>
                            <li className="sidebar-nav-item"><a href="#add-user-section">Usuarios</a></li>
                        </ul>
                        <p className="sidebar-nav-category">Ver:</p>
                        <ul>
                            <li className="sidebar-nav-item"><a href="#products-list-section">Productos actuales</a></li>
                            <li className="sidebar-nav-item"><a href="#branches-list-section">Sucursales actuales</a></li>
                            <li className="sidebar-nav-item"><a href="#users-list-section">Usuarios actuales</a></li>
                            <li className="sidebar-nav-item"><a href="#system-logs">Bitácora de Sistema</a></li>
                        </ul>

                        {/* BOTÓN DE RESPALDO */}
                        <p className="sidebar-nav-category">Sistema:</p>
                        <ul>
                            <li className="sidebar-nav-item">
                                <button
                                    onClick={handleDownloadBackup}
                                    style={{
                                        background: 'none', border: 'none', color: '#93D501',
                                        fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer',
                                        textAlign: 'left', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px'
                                    }}
                                >
                                    <Download size={20}/> Descargar BD
                                </button>
                            </li>
                        </ul>
                    </>
                ) : (
                    /* OPCIONES DE SUCURSAL (Si quisieras diferenciarlas, o se usa el mismo sidebar) */
                    <>
                        <p className="sidebar-nav-category">Gestionar:</p>
                        <ul>
                            <li className="sidebar-nav-item"><a href="#add-product-section">Agregar Producto</a></li>
                            <li className="sidebar-nav-item"><a href="#products-list-section">Ver Mis Productos</a></li>
                        </ul>
                    </>
                )}

                <p className="sidebar-nav-category">Acciones:</p>
                <ul>
                    <li className="sidebar-nav-item">
                        <button
                            onClick={handleLogout}
                            style={{color: '#DC3545', fontWeight: 'bold', background: 'none', border: 'none', padding: '0', cursor: 'pointer', fontSize: '1.7rem', display: 'flex', alignItems: 'center', gap:'8px', width: '100%', textAlign: 'left', paddingLeft: '0.75rem'}}
                        >
                            <LogOut size={24}/> Cerrar Sesión
                        </button>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;