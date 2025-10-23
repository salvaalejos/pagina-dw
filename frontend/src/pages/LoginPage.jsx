import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from '../api/axiosConfig'; // Ajusta la ruta (../) si es necesario
import { useNavigate } from 'react-router-dom'; // Hook para redirigir
import './login.css'; // Importamos el CSS local

function LoginPage() {
    // --- Configuración ---
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate(); // Inicializamos el hook de navegación

    // --- Estado para Errores ---
    // Usamos esto para mostrar errores del API, igual que los "flashed messages"
    const [apiError, setApiError] = useState("");

    // --- Función de Envío ---
    const onSubmit = (data) => {
        console.log("Enviando datos de login:", data);
        setApiError(""); // Limpiamos errores previos

        axios.post('http://localhost:5000/api/login', data)
            .then(response => {
                // Éxito: El backend nos devuelve los datos del usuario
                console.log("Login exitoso:", response.data);

                // Redirigimos al usuario
                if (response.data.rol === 'admin') {
                    navigate('/admin'); // Al panel de admin
                } else {
                    navigate('/'); // A la página de inicio (por si acaso)
                }
            })
            .catch(error => {
                // Error: El backend nos devuelve un error (ej. 401)
                console.error("Error en el login:", error);
                if (error.response && error.response.data.message) {
                    setApiError(error.response.data.message); // Mostramos el error del API
                } else {
                    setApiError("Error de red. No se pudo conectar al servidor.");
                }
            });
    };

    // --- Efecto para Lucide icons (sin cambios) ---
    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, []);

    return (
        <div className="login-card">
            <div>
                <a href="/" className="login-logo">
                    {/* Apunta a la imagen en la carpeta /public */}
                    <img src="/images/Logo.png" alt="Logo Pop Bubbles" />
                </a>
                <h2 className="login-title">Acceso de Administrador</h2>
                <p className="login-subtitle">Ingresa tus credenciales para continuar.</p>
            </div>

            {/* --- Manejo de Errores ---
              Reemplaza el bloque `{% with messages ... %}`
            */}
            {apiError && (
                <div className="flash-message error" role="alert">
                    {apiError}
                </div>
            )}

            {/* Conectamos el `onSubmit` de React */}
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* El input de CSRF se elimina */}

                <div className="form-group">
                    <i data-lucide="user" className="form-icon"></i>
                    <input
                        id="username"
                        type="text"
                        className="form-input"
                        placeholder="Nombre de usuario"
                        {...register("username", { required: "El nombre de usuario es obligatorio" })}
                    />
                    {/* Error de validación del frontend */}
                    {errors.username && <span style={{color: 'red', fontSize: '0.9rem'}}>{errors.username.message}</span>}
                </div>

                <div className="form-group">
                    <i data-lucide="lock" className="form-icon"></i>
                    <input
                        id="password"
                        type="password"
                        className="form-input"
                        placeholder="Contraseña"
                        {...register("password", { required: "La contraseña es obligatoria" })}
                    />
                    {/* Error de validación del frontend */}
                    {errors.password && <span style={{color: 'red', fontSize: '0.9rem'}}>{errors.password.message}</span>}
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <button type="submit" className="btn btn-primary">
                        Iniciar Sesión
                    </button>
                </div>
            </form>
        </div>
    );
}

export default LoginPage;