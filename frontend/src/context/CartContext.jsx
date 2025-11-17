import React, { useState, createContext, useContext } from 'react';

// 1. Crear el contexto
const CartContext = createContext();

// 2. Crear el Proveedor
export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(""); // ID de la sucursal elegida

    // --- NUEVO ESTADO PARA EL CARRITO ---
    const [isOpen, setIsOpen] = useState(false); // Por defecto, está cerrado

    // --- NUEVAS FUNCIONES ---
    const toggleCart = () => {
        // Esta función simplemente invierte el estado
        setIsOpen(!isOpen);
    };

    const closeCart = () => {
        // Esta función fuerza el cierre (útil al navegar a otra página)
        setIsOpen(false);
    };

    // --- (Funciones existentes sin cambios) ---
    const addItem = (product) => {
        const exist = cartItems.find((item) => item.id === product.id);
        if (exist) {
            setCartItems(
                cartItems.map((item) =>
                    item.id === product.id ? { ...exist, cantidad: exist.cantidad + 1 } : item
                )
            );
        } else {
            setCartItems([...cartItems, { ...product, cantidad: 1 }]);
        }
        setIsOpen(true); // Abrir el carrito al agregar un item
    };

    const removeItem = (product) => {
        const exist = cartItems.find((item) => item.id === product.id);
        if (exist.cantidad === 1) {
            setCartItems(cartItems.filter((item) => item.id !== product.id));
        } else {
            setCartItems(
                cartItems.map((item) =>
                    item.id === product.id ? { ...exist, cantidad: exist.cantidad - 1 } : item
                )
            );
        }
    };

    // Modificamos clearCart para que también cierre el panel
    const clearCart = () => {
        setCartItems([]);
        setIsOpen(false);
    };

    // 6. Proveer el estado y las funciones a los hijos
    return (
        <CartContext.Provider
            value={{
                cartItems,
                selectedBranch,
                setSelectedBranch,
                addItem,
                removeItem,
                clearCart,
                // --- PROVEEMOS EL NUEVO ESTADO Y FUNCIONES ---
                isOpen,
                toggleCart,
                closeCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

// 7. Hook personalizado (sin cambios)
export const useCart = () => {
    return useContext(CartContext);
};