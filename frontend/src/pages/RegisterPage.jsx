import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, AtSign, Lock, LockKeyhole } from 'lucide-react';
import ReCAPTCHA from "react-google-recaptcha"; // 1. IMPORTAR
import './register.css';

function RegisterPage() {
    const { register: registerUser } = useAuth();
    const { register, handleSubmit, setError, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [apiError, setApiError] = useState("");
    const [captchaToken, setCaptchaToken] = useState(null); // 2. ESTADO DEL TOKEN

    const onSubmit = async (data) => {
        setApiError("");

        // 3. VALIDAR CAPTCHA
        if (!captchaToken) {
            setApiError("Por favor, confirma que no eres un robot.");
            return;
        }

        if (data.password !== data.confirmPassword) {
            setError("confirmPassword", { type: "manual", message: "Las contraseñas no coinciden" });
            return;
        }

        try {
            // 4. ENVIAR TOKEN (Ahora la función register recibe un 5to argumento)
            const response = await registerUser(data.name, data.email, data.username, data.password, captchaToken);
            alert(response.message);
            navigate('/login');
        } catch (error) {
            const msg = error.message.toLowerCase();
            if (msg.includes("usuario")) {
                setError("username", { type: "manual", message: error.message });
            } else if (msg.includes("correo") || msg.includes("email")) {
                setError("email", { type: "manual", message: error.message });
            } else {
                setApiError(error.message);
            }
            setCaptchaToken(null); // Resetear captcha si falla
        }
    };

    return (
        <div className="register-card">
            <div>
                <a href="/" className="login-logo">
                    <img src="/images/Logo.png" alt="Logo Pop Bubbles" />
                </a>
                <h2 className="login-title">Crea tu cuenta</h2>
                <p className="login-subtitle">Regístrate para guardar tus pedidos.</p>
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
                        id="name"
                        type="text"
                        className="form-input"
                        placeholder="Nombre Completo"
                        {...register("name", { required: "Tu nombre es obligatorio" })}
                    />
                    {errors.name && <span style={{color: 'red', fontSize: '0.9rem'}}>{errors.name.message}</span>}
                </div>

                <div className="form-group">
                    <Mail className="form-icon" />
                    <input
                        id="email"
                        type="email"
                        className="form-input"
                        placeholder="tu@correo.com"
                        {...register("email", { required: "El correo es obligatorio" })}
                    />
                    {errors.email && <span style={{color: 'red', fontSize: '0.9rem'}}>{errors.email.message}</span>}
                </div>

                <div className="form-group">
                    <AtSign className="form-icon" />
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

                <div className="form-group">
                    <LockKeyhole className="form-icon" />
                    <input
                        id="confirmPassword"
                        type="password"
                        className="form-input"
                        placeholder="Confirma tu contraseña"
                        {...register("confirmPassword", { required: "Confirma tu contraseña" })}
                    />
                    {errors.confirmPassword && <span style={{color: 'red', fontSize: '0.9rem'}}>{errors.confirmPassword.message}</span>}
                </div>

                {/* 5. AÑADIR RECAPTCHA VISUAL */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', marginBottom: '1rem' }}>
                    <ReCAPTCHA
                        sitekey="6LePJxIsAAAAAKh0DbjagXnEnqL7GrF5CUUvsWY8"
                        onChange={(token) => setCaptchaToken(token)}
                    />
                </div>

                <div style={{ marginTop: '1rem' }}>
                    <button type="submit" className="btn btn-primary">
                        Registrarme
                    </button>
                </div>

                <p style={{marginTop: '1.5rem', fontSize: '1rem', textAlign: 'center'}}>
                    ¿Ya tienes una cuenta? <Link to="/login" style={{color: 'var(--brand-purple)', fontWeight: 'bold', textDecoration: 'none'}}>Inicia sesión aquí</Link>
                </p>
            </form>
        </div>
    );
}

export default RegisterPage;