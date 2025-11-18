import './admin.css';
import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import AddSucursalProductForm from '../components/AddSucursalProductForm';
import ProductList from '../components/ProductList';

// (El componente BranchSidebar se queda igual)
function BranchSidebar() {
    const { logout } = useAuth();
    const handleLogout = (e) => {
        e.preventDefault();
        logout();
    };
    return (
        <aside className="sidebar">
            <a href="/" className="sidebar-logo">
                <img src="/images/Logo2.png" alt="Logo Pop Bubbles" />
            </a>
            <nav className="sidebar-nav">
                <p className="sidebar-nav-category">Gestionar:</p>
                <ul>
                    <li className="sidebar-nav-item"><a href="#add-product-section">Agregar Producto</a></li>
                    <li className="sidebar-nav-item"><a href="#products-list-section">Ver Mis Productos</a></li>
                </ul>
                <p className="sidebar-nav-category">Acciones:</p>
                <ul>
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

function BranchDashboard() {
    const [products, setProducts] = useState([]);
    // 1. CORRECCIÓN: 'branches' ahora se cargará en el estado
    const [branches, setBranches] = useState([]);
    const { user } = useAuth();

    const fetchData = () => {
        console.log("Buscando datos de la sucursal...");

        // 2. CORRECCIÓN: Hacemos ambas peticiones, igual que en AdminDashboard
        const fetchProducts = axios.get('/sucursal/products');
        const fetchBranches = axios.get('/branches'); // <-- AÑADIDO

        // 3. CORRECCIÓN: Usamos Promise.all para esperar ambas
        Promise.all([fetchProducts, fetchBranches])
            .then(([productsRes, branchesRes]) => {
                setProducts(productsRes.data);
                setBranches(branchesRes.data); // <-- AÑADIDO: Guardamos las sucursales
                console.log("¡Datos de sucursal cargados!", {
                    products: productsRes.data,
                    branches: branchesRes.data
                });
            })
            .catch(error => console.error("Error fetching branch data:", error));
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 4. CORRECCIÓN: Añadir 'branches' a las dependencias de los iconos
    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, [products, branches]);

    return (
        <div className="admin-container">
            <BranchSidebar />
            <div className="content-wrapper">
                <header className="top-bar">
                    <h1>Gestión de Sucursal: {user ? user.name : ''}</h1>
                </header>

                <main className="scrollable-content">
                    <AddSucursalProductForm
                        onProductAdded={fetchData}
                    />

                    {/* 5. CORRECCIÓN: Ahora 'branches' SÍ tiene datos */}
                    <ProductList
                        products={products}
                        branches={branches}
                        onProductDeleted={fetchData}
                    />
                </main>
            </div>
        </div>
    );
}

export default BranchDashboard;