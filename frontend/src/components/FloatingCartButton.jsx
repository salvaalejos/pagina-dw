import React from 'react'; // 1. Ya no se necesita useEffect ni useRef
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart } from 'lucide-react'; // 2. Importar el icono como componente
import './FloatingCartButton.css';

function FloatingCartButton() {
    const { toggleCart, cartItems } = useCart();
    const { isAuthenticated, user } = useAuth();

    // 3. Ya no necesitamos el useEffect para 'createIcons'

    const totalItems = cartItems.reduce((sum, item) => sum + item.cantidad, 0);

    if (isAuthenticated && (user.rol === 'admin' || user.rol === 'sucursal')) {
        return null;
    }

    return (
        // 4. Quitamos la 'ref'
        <button className="floating-cart-btn" onClick={toggleCart}>
            {totalItems > 0 && (
                <span className="cart-item-count">{totalItems}</span>
            )}
            {/* 5. Reemplazamos <i> por el componente de React */}
            <ShoppingCart className="cart-icon" size={32} />
        </button>
    );
}

export default FloatingCartButton;