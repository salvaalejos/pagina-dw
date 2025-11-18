import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Plus } from 'lucide-react'; // 1. Importar el icono 'Plus'

function MenuSection({ products, branches }) {
    const { addItem, setSelectedBranch, selectedBranch } = useCart();
    const [filteredProducts, setFilteredProducts] = useState([]);

    // 2. Eliminamos el useEffect que llamaba a 'createIcons'

    const handleBranchChange = (event) => {
        const branchId = event.target.value;
        setSelectedBranch(branchId);
        if (!branchId) {
            setFilteredProducts([]);
            return;
        }
        const filtered = products.filter(p => p.id_sucursal.toString() === branchId);
        setFilteredProducts(filtered);
    };

    const handleAddItem = (drink) => {
        if (!selectedBranch) {
            alert("¡Por favor, selecciona una sucursal primero!");
            document.getElementById('branch-selector').scrollIntoView({ behavior: 'smooth' });
            return;
        }
        addItem(drink);
    };

    return (
        <section id="menu" className="fade-in-section">
            <div className="container">
                {/* --- Selector de sucursal (sin cambios) --- */}
                <div className="text-content" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 className="section-title">Nuestro Menú</h2>
                </div>
                <div className="card">
                    <div className="form-group">
                        <label htmlFor="branch-selector" className="form-label" style={{ textAlign: 'center', fontSize: '1.5rem' }}>Paso 1: ¡Elige tu sucursal! 📍</label>
                        <select
                            id="branch-selector"
                            className="form-select"
                            value={selectedBranch}
                            onChange={handleBranchChange}
                        >
                            <option value="" disabled>-- Selecciona dónde recoger tu felicidad --</option>
                            {branches.map(sucursal => (
                                <option key={sucursal.id} value={sucursal.id}>
                                    {sucursal.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* --- Contenedor del Menú --- */}
                <div id="menu-container" className={!selectedBranch ? 'hidden' : ''}>
                    <div className="text-content" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 className="section-title" style={{ fontSize: '2rem' }}>Paso 2: Arma tu pedido</h2>
                    </div>

                    <div id="menu-items">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((drink, index) => (
                                <div key={drink.id}
                                     className="product-card"
                                     style={{ animationDelay: `${index * 0.1}s` }}>

                                    <img src={drink.imagen} alt={`Imagen de ${drink.nombre}`}
                                         className="product-card-img" />

                                    <div className="product-card-body">
                                        <h4 className="product-card-title">{drink.nombre}</h4>
                                        <p className="product-card-desc">{drink.descripcion}</p>

                                        <div className="product-card-footer">
                                            <span className="product-card-price">
                                                ${parseFloat(drink.precio).toFixed(2)}
                                            </span>

                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleAddItem(drink)}
                                            >
                                                {/* 3. Reemplazamos <i> por el componente */}
                                                <Plus size={16} />
                                                Agregar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 col-span-full text-center">
                                Lo sentimos, no hay productos disponibles en esta sucursal.
                            </p>
                        )}

                    </div>
                </div>
            </div>
        </section>
    );
}

export default MenuSection;