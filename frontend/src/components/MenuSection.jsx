import React, { useState, useEffect } from 'react';

// Recibimos `products` y `branches` de la LandingPage
function MenuSection({ products, branches }) {

    // --- Estado para la lógica del menú ---
    const [selectedBranch, setSelectedBranch] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);

    // --- Efecto para recargar iconos ---
    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, [filteredProducts]); // Se refresca cada vez que los productos filtrados cambian

    // --- Manejador para el <select> ---
    const handleBranchChange = (event) => {
        const branchId = event.target.value;
        setSelectedBranch(branchId);

        if (!branchId) {
            setFilteredProducts([]);
            return;
        }

        // Filtramos productos basados en el ID de la sucursal seleccionada
        const filtered = products.filter(p => p.id_sucursal.toString() === branchId);
        setFilteredProducts(filtered);
    };

    return (
        <section id="menu" className="fade-in-section">
            <div className="container">
                <div className="text-content" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 className="section-title">Nuestro Menú</h2>
                </div>

                <div className="card">
                    <div className="form-group">
                        <label htmlFor="branch-selector" className="form-label" style={{ textAlign: 'center', fontSize: '1.5rem' }}>Paso 1: ¡Elige tu sucursal! 📍</label>
                        {/* El `onChange` llama a nuestra función `handleBranchChange`
                          El `value` está controlado por nuestro estado `selectedBranch`
                        */}
                        <select
                            id="branch-selector"
                            className="form-select"
                            value={selectedBranch}
                            onChange={handleBranchChange}
                        >
                            <option value="" disabled>-- Selecciona dónde recoger tu felicidad --</option>
                            {/* Mapeamos las sucursales desde la prop */}
                            {branches.map(sucursal => (
                                <option key={sucursal.id} value={sucursal.id}>
                                    {sucursal.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* --- Contenedor del Menú ---
                  Solo se muestra si una sucursal ha sido seleccionada
                */}
                <div id="menu-container" className={!selectedBranch ? 'hidden' : ''}>
                    <div className="text-content" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 className="section-title" style={{ fontSize: '2rem' }}>Paso 2: Arma tu pedido</h2>
                    </div>
                    
                    <div id="menu-items" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>

                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((drink, index) => (
                                <div key={drink.id}
                                     className="bg-white rounded-3xl shadow-xl overflow-hidden transform hover:scale-[1.03] transition-all duration-300 border border-gray-100 menu-item-card"
                                     style={{ animationDelay: `${index * 0.1}s` }}>

                                    <img src={drink.imagen} alt={`Imagen de ${drink.nombre}`}
                                         className="w-full object-cover rounded-t-3xl" style={{ height: '180px' }} />

                                    <div className="p-6">
                                        <h4 className="text-2xl font-bold text-emerald-800 mb-2">{drink.nombre}</h4>
                                        <p className="text-gray-500 mb-4 text-sm line-clamp-2">{drink.descripcion}</p>
                                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                            <span className="text-2xl font-extrabold text-red-500">${parseFloat(drink.precio).toFixed(2)}</span>
                                            <button className="add-to-cart-btn bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 text-sm"
                                                    data-id={drink.id}>
                                                <i data-lucide="plus" className="w-5 h-5"></i>
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