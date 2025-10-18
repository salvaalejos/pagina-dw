import React from 'react';
import axios from '../api/axiosConfig'; // Asegúrate que la ruta sea correcta

function ProductList({ products, branches, onProductDeleted }) {

    const getBranchName = (branchId) => {
        // Aseguramos comparar como strings o números consistentes
        const branch = branches.find(b => String(b.id) === String(branchId));
        return branch ? branch.nombre : "Sucursal desconocida";
    };

    const handleDelete = (id) => {
        console.log("Borrando producto con id:", id);
        if (window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
            axios.delete(`/products/${id}`) // Usamos URL corta
                .then(res => {
                    alert("¡Producto eliminado!");
                    onProductDeleted();
                })
                .catch(err => {
                    console.error("Error al eliminar:", err);
                     if (err.response && err.response.data.message) {
                        alert(`Error: ${err.response.data.message}`);
                    } else {
                        alert("Error al eliminar el producto.");
                    }
                });
        }
    };

    return (
        <div id="products-list-section" className="content-block">
            <div className="content-card">
                <h2>Productos Actuales</h2>
                <div id="products-list" className="list-container">
                    {/* Verificamos si 'products' es un array antes de mapear */}
                    {!Array.isArray(products) || products.length === 0 ? (
                        <p className="empty-list-message">No hay productos para mostrar.</p>
                    ) : (
                        products.map(drink => (
                            <div className="list-item" key={drink.id}>
                                <div className="list-item-content">
                                    {/* --- CORRECCIONES AQUÍ --- */}
                                    {/* Usamos las propiedades correctas del objeto 'drink' */}
                                    <img
                                        src={drink.imagen}
                                        alt={`Imagen de ${drink.nombre}`}
                                        className="list-item-image"
                                        // Añadimos un fallback por si la imagen no carga
                                        onError={(e) => { e.target.onerror = null; e.target.src="/images/placeholder.png"}}
                                    />
                                    <div className="list-item-info">
                                        <p className="title">{drink.nombre}</p>
                                        <p className="subtitle">{getBranchName(drink.id_sucursal)}</p>
                                        <p className="price">${parseFloat(drink.precio).toFixed(2)}</p>
                                    </div>
                                     {/* --- FIN CORRECCIONES --- */}
                                </div>
                                <button className="delete-button" onClick={() => handleDelete(drink.id)}>
                                    <i data-lucide="trash-2"></i>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductList;