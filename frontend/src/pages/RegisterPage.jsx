import React, { useState } from 'react'; // 1. Quitamos useEffect
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// 2. Importar los iconos de lucide-react
import { User, Mail, AtSign, Lock, LockKeyhole } from 'lucide-react';
import './register.css'; // 3. Importar el NUEVO CSS

function RegisterPage() {
    const { register: registerUser } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [apiError, setApiError] = useState("");

    // 4. Ya no se necesita el useEffect de lucide

    const onSubmit = async (data) => {
        setApiError("");
        if (data.password !== data.confirmPassword) {
            setApiError("Las contraseñas no coinciden");
            return;
        }

        try {
            const response = await registerUser(data.name, data.email, data.username, data.password);
            alert(response.message);
            navigate('/login');
        } catch (error) {
            setApiError(error.message);
        }
    };

    return (
        // 5. Usamos la nueva clase y quitamos el style en línea
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
                {/* 6. Mantenemos el formulario vertical */}

                <div className="form-group">
                    <User className="form-icon" /> {/* Icono de React */}
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
                    <Mail className="form-icon" /> {/* Icono de React */}
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
                    <AtSign className="form-icon" /> {/* Icono de React */}
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
                    <Lock className="form-icon" /> {/* Icono de React */}
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
                    <LockKeyhole className="form-icon" /> {/* Icono de React */}
                    <input
                        id="confirmPassword"
                        type="password"
                        className="form-input"
                        placeholder="Confirma tu contraseña"
                        {...register("confirmPassword", { required: "Confirma tu contraseña" })}
                    />
                    {errors.confirmPassword && <span style={{color: 'red', fontSize: '0.9rem'}}>{errors.confirmPassword.message}</span>}
                </div>

                <div style={{ marginTop: '2rem' }}>
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