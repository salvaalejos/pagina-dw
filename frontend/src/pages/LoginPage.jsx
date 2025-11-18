import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock } from 'lucide-react'; // 1. IMPORTAR LOS ICONOS
import './login.css';

function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const { login } = useAuth();
    const [apiError, setApiError] = useState("");

    const onSubmit = async (data) => {
        setApiError("");
        try {
            await login(data.username, data.password);
        } catch (error) {
            console.error("Error en el login:", error);
            setApiError(error.message);
        }
    };

    // 2. ELIMINAR EL useEffect de lucide.createIcons()
    // Ya no es necesario porque usamos componentes de React.

    return (
        <div className="login-card">
            <div>
                <a href="/" className="login-logo">
                    <img src="/images/Logo.png" alt="Logo Pop Bubbles" />
                </a>
                <h2 className="login-title">Iniciar Sesión</h2>
                <p className="login-subtitle">Ingresa tus credenciales para continuar.</p>
            </div>

            {apiError && (
                <div className="flash-message error" role="alert">
                    {apiError}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    {/* 3. REEMPLAZAR <i> POR COMPONENTE */}
                    <User className="form-icon" />
                    <input
                        id="username"
                        type="text"
                        className="form-input"
                        placeholder="Nombre de usuario"
                        {...register("username", { required: "El nombre de usuario es obligatorio" })}
                    />
                    {errors.username && <span style={{color: 'red', fontSize: '0.9rem'}}>{errors.username.message}</span>}
                </div>

                <div className="form-group">
                    {/* 4. REEMPLAZAR <i> POR COMPONENTE */}
                    <Lock className="form-icon" />
                    <input
                        id="password"
                        type="password"
                        className="form-input"
                        placeholder="Contraseña"
                        {...register("password", { required: "La contraseña es obligatoria" })}
                    />
                    {errors.password && <span style={{color: 'red', fontSize: '0.9rem'}}>{errors.password.message}</span>}
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <button type="submit" className="btn btn-primary">
                        Iniciar Sesión
                    </button>
                </div>
            </form>

            <p style={{marginTop: '2rem', fontSize: '1rem', textAlign: 'center'}}>
                ¿No tienes cuenta?{' '}
                <Link to="/register" style={{color: 'var(--brand-purple)', fontWeight: 'bold', textDecoration: 'none'}}>
                    Regístrate aquí
                </Link>
            </p>
        </div>
    );
}

export default LoginPage;