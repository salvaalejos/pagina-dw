import React from 'react';
// Importamos la configuración de axios
import axios from '../api/axiosConfig'; // Asegúrate que la ruta sea correcta

// Recibimos `branches` y `onBranchDeleted` como props
function BranchList({ branches, onBranchDeleted }) {

    // Adaptamos la función handleDelete
    const handleDelete = (id) => {
        console.log("Borrando sucursal con id:", id);

        // --- Lógica de conexión (YA ACTIVA) ---
        // Usamos la URL corta `/branches/${id}`
        if (window.confirm("¿Estás seguro? Esto eliminará también los productos asociados a esta sucursal.")) {
            axios.delete(`/branches/${id}`)
                .then(response => {
                    alert(response.data.message); // Muestra mensaje de éxito del API
                    onBranchDeleted(); // Llama a la función del padre para recargar la lista
                })
                .catch(error => {
                    console.error("Error al eliminar sucursal:", error);
                    // Muestra un mensaje de error más específico si es posible
                    if (error.response && error.response.data.message) {
                        alert(`Error: ${error.response.data.message}`);
                    } else {
                        alert("Hubo un error al eliminar la sucursal. Revisa la consola.");
                    }
                });
        }
    };

    return (
        <div id="branches-list-section" className="content-block">
            <div className="content-card">
                <h2>Sucursales Actuales</h2>
                <div id="branches-list" className="list-container">
                    {/* El resto del código JSX se mantiene igual */}
                    {branches.length === 0 ? (
                        <p className="empty-list-message">No hay sucursales para mostrar.</p>
                    ) : (
                        branches.map(sucursal => (
                            <div className="list-item" key={sucursal.id}>
                                <div className="list-item-content">
                                    <div className="list-item-info">
                                        <p className="title">{sucursal.nombre}</p>
                                        <p className="subtitle">{sucursal.direccion}</p>
                                        {/* <p className="subtitle">{sucursal.telefono}</p> */}
                                    </div>
                                </div>
                                {/* El botón ahora llama a la función handleDelete adaptada */}
                                <button className="delete-button" onClick={() => handleDelete(sucursal.id)}>
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

export default BranchList;