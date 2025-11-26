import React, { useState, useEffect, createContext, useContext } from 'react';
import axios from '../api/axiosConfig'; // Usamos nuestra instancia de axios
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Por ahora, solo marcamos 'isLoading' como falso
        setIsLoading(false);
    }, []);


    // En AuthContext.jsx
    const login = async (username, password, captchaToken) => { // 1. Aceptamos el token
        try {
            const response = await axios.post('/login', {
                username,
                password,
                captchaToken // 2. Lo enviamos al backend
            });
            // ... resto del código igual

            if (response.data) {
                const userData = response.data;
                setUser(userData);
                setIsAuthenticated(true);

                if (userData.rol === 'admin') {
                    navigate('/admin');
                } else if (userData.rol === 'sucursal') {
                    navigate('/branch-dashboard');
                } else {
                    navigate('/');
                }
                return true;
            }
        } catch (error) {
            console.error("Error en login:", error);
            setUser(null);
            setIsAuthenticated(false);
            if (error.response && error.response.data) {
                throw new Error(error.response.data.message || "Error al iniciar sesión");
            }
            throw new Error("Error de red");
        }
    };

    const logout = async () => {
        try {
            // CORRECCIÓN: Se quitó /api. Ahora llama a /logout
            await axios.post('/logout');
        } catch (error) {
            console.error("Error en logout:", error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            navigate('/login');
        }
    };

    const register = async (name, email, username, password, captchaToken) => {
        try {
            // Enviamos el captchaToken junto con los datos del usuario
            const response = await axios.post('/register', {
                name,
                email,
                username,
                password,
                captchaToken // <--- NUEVO CAMPO
            });
            return response.data;
        } catch (error) {
            console.error("Error en registro:", error);
            if (error.response && error.response.data) {
                throw new Error(error.response.data.message || "Error al registrarse");
            }
            throw new Error("Error de red");
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, register }}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};