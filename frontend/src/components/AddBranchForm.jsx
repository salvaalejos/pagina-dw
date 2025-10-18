import React from 'react';
import { useForm } from 'react-hook-form';
// Importamos la configuración de axios
import axios from '../api/axiosConfig'; // Asegúrate que la ruta sea correcta

// Recibimos la prop 'onBranchAdded' desde AdminDashboard
function AddBranchForm({ onBranchAdded }) {
    // Agregamos 'reset' para limpiar el formulario
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    // Adaptamos la función onSubmit
    const onSubmit = (data) => {
        console.log("Nueva sucursal:", data);

        // --- Lógica de conexión (YA ACTIVA) ---
        // Usamos la URL corta '/branches' gracias a la config de axios
        axios.post('/branches', data)
            .then(response => {
                alert(response.data.message); // Muestra el mensaje de éxito del API
                reset(); // Limpia los campos del formulario
                onBranchAdded(); // Llama a la función del padre para recargar la lista de sucursales
            })
            .catch(error => {
                console.error("Error al agregar sucursal:", error);
                // Muestra un mensaje de error más específico si es posible
                if (error.response && error.response.data.message) {
                    alert(`Error: ${error.response.data.message}`);
                } else {
                    alert("Hubo un error al agregar la sucursal. Revisa la consola.");
                }
            });
    };

    return (
        <div id="add-branch-section" className="content-block">
            <div className="content-card">
                <h2>Agregar Nueva Sucursal</h2>
                {/* El formulario ahora llama a la función onSubmit adaptada */}
                <form id="add-branch-form" onSubmit={handleSubmit(onSubmit)}>

                    <div className="form-group">
                        <label htmlFor="branch-name" className="form-label">Nombre de la Sucursal</label>
                        <input
                            type="text"
                            id="branch-name"
                            placeholder="Ej: Sucursal Centro"
                            className="form-input"
                            {...register("branch_name", { required: "El nombre es obligatorio" })}
                        />
                        {errors.branch_name && <span style={{color: 'red', fontSize: '0.9rem'}}>{errors.branch_name.message}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="branch-address" className="form-label">Dirección de la Sucursal</label>
                        <input
                            type="text"
                            id="branch-address"
                            placeholder="Ej: Calle Principal #123"
                            className="form-input"
                            {...register("branch_address", { required: "La dirección es obligatoria" })}
                        />
                        {errors.branch_address && <span style={{color: 'red', fontSize: '0.9rem'}}>{errors.branch_address.message}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="branch-phone" className="form-label">Teléfono de la Sucursal</label>
                        <input
                            type="tel"
                            id="branch-phone"
                            placeholder="Ej: 555-123-4567"
                            className="form-input"
                            {...register("branch_phone", { required: "El teléfono es obligatorio" })}
                        />
                        {errors.branch_phone && <span style={{color: 'red', fontSize: '0.9rem'}}>{errors.branch_phone.message}</span>}
                    </div>

                    <button type="submit" className="form-button">Agregar Sucursal</button>
                </form>
            </div>
        </div>
    );
}

export default AddBranchForm;