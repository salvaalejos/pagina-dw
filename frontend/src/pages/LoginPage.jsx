import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock } from 'lucide-react';
// 1. IMPORTAR LIBRERÍA v2
import ReCAPTCHA from "react-google-recaptcha";
import './login.css';

function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    // Recuerda que tu AuthContext debe aceptar el tercer parámetro (captchaToken)
    const { login } = useAuth();

    const [apiError, setApiError] = useState("");
    const [captchaToken, setCaptchaToken] = useState(null); // Estado para guardar el token

    const onSubmit = async (data) => {
        setApiError("");

        // 2. VALIDACIÓN: ¿El usuario marcó la casilla?
        if (!captchaToken) {
            setApiError("Por favor, confirma que no eres un robot.");
            return;
        }

        try {
            // 3. ENVIAR AL BACKEND
            await login(data.username, data.password, captchaToken);
        } catch (error) {
            console.error("Error en el login:", error);
            setApiError(error.message);
            setCaptchaToken(null); // Reseteamos el captcha si falla
        }
    };

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

                {/* 4. COMPONENTE VISUAL */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem', marginBottom: '1rem' }}>
                    <ReCAPTCHA
                        sitekey="6LePJxIsAAAAAKh0DbjagXnEnqL7GrF5CUUvsWY8"
                        onChange={(token) => setCaptchaToken(token)}
                    />
                </div>

                <div style={{ marginTop: '1rem' }}>
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