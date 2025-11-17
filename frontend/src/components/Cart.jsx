import React, { useEffect, useState } from 'react'; // 1. Quitamos useRef
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';
// 2. Importamos los iconos que necesitamos
import { X, MinusCircle, PlusCircle } from 'lucide-react';
import './Cart.css';

function Cart() {
    const { cartItems, addItem, removeItem, clearCart, selectedBranch, isOpen, toggleCart } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [total, setTotal] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 3. Ya no necesitamos la 'ref'

    useEffect(() => {
        const newTotal = cartItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
        setTotal(newTotal);
    }, [cartItems]);

    // 4. Eliminamos el 'useEffect' que llamaba a 'createIcons'

    const handlePlaceOrder = async () => {
        if (!isAuthenticated) {
            alert("Por favor, inicia sesión para realizar un pedido.");
            toggleCart();
            navigate('/login');
            return;
        }
        if (cartItems.length === 0) {
            alert("Tu carrito está vacío.");
            return;
        }
        if (!selectedBranch) {
            alert("Por favor, selecciona una sucursal en el menú.");
            return;
        }

        setIsSubmitting(true);

        const orderData = {
            sucursal_id: parseInt(selectedBranch, 10),
            total: total,
            cartItems: cartItems.map(item => ({
                bebida_id: item.id,
                cantidad: item.cantidad,
                precio_unitario: item.precio
            }))
        };

        try {
            const response = await axios.post('/orders', orderData);
            alert(response.data.message);
            clearCart();
            navigate('/my-orders');
        } catch (error) {
            console.error("Error al crear pedido:", error);
            alert("Hubo un error al crear tu pedido. Intenta de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        // 5. Quitamos la 'ref'
        <aside className="cart-sidebar">
            <div className="cart-header">
                <h3>Mi Pedido</h3>
                <button className="cart-close-btn" onClick={toggleCart}>
                    {/* 6. Reemplazamos <i> por componente */}
                    <X />
                </button>
            </div>
            <div className="cart-body">
                {cartItems.length === 0 ? (
                    <p className="cart-empty">Tu carrito está vacío.</p>
                ) : (
                    cartItems.map(item => (
                        <div className="cart-item" key={item.id}>
                            <img src={item.imagen} alt={item.nombre} className="cart-item-img" />
                            <div className="cart-item-info">
                                <p className="cart-item-name">{item.nombre}</p>
                                <p className="cart-item-price">${item.precio.toFixed(2)}</p>
                            </div>
                            <div className="cart-item-controls">
                                {/* 7. Reemplazamos <i> por componentes */}
                                <button onClick={() => removeItem(item)}><MinusCircle className="w-5 h-5" /></button>
                                <span>{item.cantidad}</span>
                                <button onClick={() => addItem(item)}><PlusCircle className="w-5 h-5" /></button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="cart-footer">
                <div className="cart-total">
                    <strong>Total:</strong>
                    <strong>${total.toFixed(2)}</strong>
                </div>
                <button
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '1rem' }}
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Procesando..." : "Realizar Pedido"}
                </button>
            </div>
        </aside>
    );
}

export default Cart;