import './admin.css';
import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import Sidebar from '../components/Sidebar';
import AddProductForm from '../components/AddProductForm';
import AddBranchForm from '../components/AddBranchForm';
import ProductList from '../components/ProductList';
import BranchList from '../components/BranchList';
import AddUserForm from '../components/AddUserForm';
import UserList from '../components/UserList';

function AdminDashboard() {

    const [products, setProducts] = useState([]);
    const [branches, setBranches] = useState([]);
    const [users, setUsers] = useState([]);

    const fetchData = () => {
        console.log("Buscando datos en el backend...");

        // CORRECCIÓN: Se quitó /api de todas las rutas
        const fetchProducts = axios.get('/products');
        const fetchBranches = axios.get('/branches');
        const fetchUsers = axios.get('/users');

        Promise.all([fetchProducts, fetchBranches, fetchUsers])
            .then(([productsRes, branchesRes, usersRes]) => {
                setProducts(productsRes.data);
                setBranches(branchesRes.data);
                setUsers(usersRes.data);

                console.log("¡Datos cargados!", {
                    products: productsRes.data,
                    branches: branchesRes.data,
                    users: usersRes.data
                });
            })
            .catch(error => console.error("Error fetching data:", error));
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, [products, branches, users]);


    return (
        <div className="admin-container">
            <Sidebar />
            <div className="content-wrapper">
                <header className="top-bar">
                    <h1>Administrador</h1>
                </header>

                <main className="scrollable-content">
                    <AddProductForm branches={branches} onProductAdded={fetchData} />
                    <AddBranchForm onBranchAdded={fetchData} />
                    <AddUserForm branches={branches} onUserAdded={fetchData} />

                    <ProductList
                        products={products}
                        branches={branches}
                        onProductDeleted={fetchData}
                    />
                    <BranchList
                        branches={branches}
                        onBranchDeleted={fetchData}
                    />
                    <UserList
                        users={users}
                        branches={branches}
                        onUserDeleted={fetchData}
                    />
                </main>
            </div>
        </div>
    );
}

export default AdminDashboard;