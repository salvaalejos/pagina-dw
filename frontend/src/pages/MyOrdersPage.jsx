import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import Header from '../components/Header'; // Reutilizamos el header
import './MyOrdersPage.css'; // Importamos el CSS
import './bubbles.css'; // Para estilos globales y el footer

function MyOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [branches, setBranches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        // Cargar iconos de Lucide
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, [orders]); // Refrescar cuando lleguen los pedidos

    useEffect(() => {
        const fetchOrderData = async () => {
            setIsLoading(true);
            try {
                // Pedimos dos cosas al mismo tiempo:
                const fetchOrders = axios.get('/my-orders');
                const fetchBranches = axios.get('/branches'); // Necesitamos esto para los nombres

                // Esperamos a que ambas terminen
                const [ordersRes, branchesRes] = await Promise.all([fetchOrders, fetchBranches]);

                setOrders(ordersRes.data);
                setBranches(branchesRes.data);

                console.log("Pedidos cargados:", ordersRes.data);
            } catch (err) {
                console.error("Error al cargar mis pedidos:", err);
                setError("No se pudieron cargar tus pedidos. Intenta de nuevo.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrderData();
    }, []); // Se ejecuta solo una vez

    // Función para buscar el nombre de la sucursal usando el ID
    const getBranchName = (branchId) => {
        const branch = branches.find(b => b.id === branchId);
        return branch ? branch.nombre : "Sucursal (ya no disponible)";
    };

    return (
        <>
            <Header />
            {/* Usamos el padding-top de 'main' en bubbles.css */}
            <main className="my-orders-page">
                <div className="container">
                    <div className="text-content" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 className="section-title">Mis Pedidos</h2>
                        <p>Aquí puedes ver el historial de todas tus compras.</p>
                    </div>

                    {isLoading && <p style={{textAlign: 'center'}}>Cargando pedidos...</p>}
                    {error && <p style={{textAlign: 'center', color: 'red'}}>{error}</p>}

                    {!isLoading && orders.length === 0 && (
                        <p style={{textAlign: 'center', fontSize: '1.2rem', color: '#6b7280'}}>
                            Aún no has realizado ningún pedido.
                        </p>
                    )}

                    {/* Mapear y mostrar cada tarjeta de pedido */}
                    <div className="orders-list">
                        {orders.map(order => (
                            <div className="order-card" key={order.id}>
                                <div className="order-header">
                                    <div className="order-header-info">
                                        <p><strong>Pedido ID:</strong> <span>#{order.id}</span></p>
                                        <p><strong>Fecha:</strong> <span>{new Date(order.fecha).toLocaleString()}</span></p>
                                        <p><strong>Sucursal:</strong> <span>{getBranchName(order.sucursal_id)}</span></p>
                                    </div>
                                    <div className="order-header-total">
                                        ${order.total.toFixed(2)}
                                    </div>
                                </div>
                                <div className="order-body">
                                    <p className="order-body-title">Bebidas en este pedido:</p>
                                    {order.bebidas.map((bebida, index) => (
                                        <div className="order-item" key={index}>
                                            <img src={bebida.imagen} alt={bebida.nombre} className="order-item-img" />
                                            <div className="order-item-info">
                                                <p className="order-item-name">{bebida.nombre}</p>
                                                <p className="order-item-details">
                                                    {bebida.cantidad} x ${bebida.precio_unitario.toFixed(2)}
                                                </p>
                                            </div>
                                            <strong style={{marginLeft: 'auto', color: 'var(--text-main)'}}>
                                                ${(bebida.cantidad * bebida.precio_unitario).toFixed(2)}
                                            </strong>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <footer className="main-footer">
                <div className="container">
                    <div className="logo-footer">Pop Bubbles</div>
                    <p>© 2024 Todos los derechos reservados.</p>
                </div>
            </footer>
        </>
    );
}

export default MyOrdersPage;