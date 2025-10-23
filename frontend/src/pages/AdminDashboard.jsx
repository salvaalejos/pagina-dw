import './admin.css';
import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig'; // Ajusta la ruta (../) si es necesario
import Sidebar from '../components/Sidebar';
import AddProductForm from '../components/AddProductForm';
import AddBranchForm from '../components/AddBranchForm';
import ProductList from '../components/ProductList';
import BranchList from '../components/BranchList';

function AdminDashboard() {

    // --- PASO 1: Prepara la "memoria" (useState) ---
    // Ya no iniciamos con datos hardcodeados, sino con arrays vacíos.
    const [products, setProducts] = useState([]);
    const [branches, setBranches] = useState([]);

    // --- PASO 2: Define la función para ir a la API ---
    const fetchData = () => {
        console.log("Buscando datos en el backend...");

        // Hacemos las dos peticiones a la vez
        const fetchProducts = axios.get('http://localhost:5000/api/products');
        const fetchBranches = axios.get('http://localhost:5000/api/branches');

        // Promise.all espera a que ambas peticiones terminen
        Promise.all([fetchProducts, fetchBranches])
            .then(([productsRes, branchesRes]) => {
                // Cuando terminen, guardamos los datos en la "memoria" (el estado)
                setProducts(productsRes.data);
                setBranches(branchesRes.data);
                console.log("¡Datos cargados!", productsRes.data, branchesRes.data);
            })
            .catch(error => console.error("Error fetching data:", error));
    };

    // --- PASO 3: Dispara la función cuando la página cargue (useEffect) ---
    useEffect(() => {
        fetchData(); // Llama a la función que busca los datos

        // El array vacío `[]` significa: "ejecuta esto solo una vez, cuando el componente se monte"
    }, []);

    // --- PASO 4: Inicializa Lucide (sin cambios) ---
    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
        // Ahora se re-ejecuta si los productos o sucursales cambian
    }, [products, branches]);


    // --- PASO 5: Pasa los datos y la función de recarga a los componentes hijos ---
    return (
        <div className="admin-container">
            <Sidebar />
            <div className="content-wrapper">
                <header className="top-bar">
                    <h1>Administrador</h1>
                </header>

                <main className="scrollable-content">
                    {/* Le pasamos la lista de sucursales Y la función para recargar datos */}
                    <AddProductForm branches={branches} onProductAdded={fetchData} />

                    {/* Le pasamos la función para recargar datos */}
                    <AddBranchForm onBranchAdded={fetchData} />

                    {/* Le pasamos los datos Y una función para manejar el borrado */}
                    <ProductList
                        products={products}
                        branches={branches}
                        onProductDeleted={fetchData} // La forma fácil: recargar todo
                    />

                    <BranchList
                        branches={branches}
                        onBranchDeleted={fetchData} // La forma fácil: recargar todo
                    />
                </main>
            </div>
        </div>
    );
}

export default AdminDashboard;