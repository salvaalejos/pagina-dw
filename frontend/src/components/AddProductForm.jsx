import React from 'react';
import { useForm } from 'react-hook-form';
// Importamos la configuración de axios
import axios from '../api/axiosConfig'; // Asegúrate que la ruta sea correcta

// Recibimos 'branches' y 'onProductAdded'
function AddProductForm({ branches, onProductAdded }) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onSubmit = (data) => {
        console.log("Enviando nuevo producto:", data);

        // Convertimos el precio a número por si acaso
        const dataToSend = {
          ...data,
          product_price: parseFloat(data.product_price)
        };

        axios.post('/products', dataToSend) // Usamos la URL corta
            .then(res => {
                alert("¡Producto agregado!");
                reset(); // Limpia el formulario
                onProductAdded(); // Recarga la lista
            })
            .catch(err => {
                console.error("Error al agregar producto:", err);
                 if (err.response && err.response.data.message) {
                    alert(`Error: ${err.response.data.message}`);
                 } else if (err.response && err.response.status === 400) {
                     alert("Error: Datos inválidos. Revisa que todos los campos estén llenos correctamente.");
                 }
                 else {
                    alert("Error al agregar producto. Revisa la consola.");
                 }
            });
    };

    return (
        // Asegúrate que este div principal esté presente
        <div id="add-product-section" className="content-block">
            <div className="content-card">
                <h2>Agregar Nuevo Producto</h2>
                {/* El formulario debe estar aquí */}
                <form id="add-product-form" onSubmit={handleSubmit(onSubmit)}>
                    {/* Input para Nombre */}
                    <div className="form-group">
                        <label htmlFor="product-name" className="form-label">Nombre del Producto</label>
                        <input
                            type="text"
                            id="product-name"
                            placeholder="Ej: Taro Fresh Milk"
                            className="form-input"
                            {...register("product_name", { required: "El nombre es obligatorio" })}
                        />
                         {errors.product_name && <span style={{color: 'red', fontSize: '0.9rem'}}>{errors.product_name.message}</span>}
                    </div>
                    {/* Input para Precio */}
                    <div className="form-group">
                        <label htmlFor="product-price" className="form-label">Precio</label>
                        <input
                            type="number"
                            id="product-price"
                            placeholder="Ej: 55.00"
                            min="0"
                            step="0.50"
                            className="form-input"
                            {...register("product_price", { required: "El precio es obligatorio", valueAsNumber: true })}
                        />
                         {errors.product_price && <span style={{color: 'red', fontSize: '0.9rem'}}>{errors.product_price.message}</span>}
                    </div>
                    {/* Input para URL de Imagen */}
                    <div className="form-group">
                        <label htmlFor="product-image" className="form-label">URL de la Imagen</label>
                        <input
                            type="url"
                            id="product-image"
                            placeholder="https://ejemplo.com/imagen.jpg"
                            className="form-input"
                            {...register("product_image", { required: "La URL de la imagen es obligatoria" })}
                        />
                         {errors.product_image && <span style={{color: 'red', fontSize: '0.9rem'}}>{errors.product_image.message}</span>}
                    </div>
                    {/* Textarea para Descripción */}
                    <div className="form-group">
                        <label htmlFor="product-description" className="form-label">Descripción</label>
                        <textarea
                            id="product-description"
                            rows="3"
                            placeholder="Una breve descripción del producto..."
                            className="form-textarea"
                            {...register("product_description", { required: "La descripción es obligatoria" })}
                        ></textarea>
                         {errors.product_description && <span style={{color: 'red', fontSize: '0.9rem'}}>{errors.product_description.message}</span>}
                    </div>
                    {/* Select para Sucursal */}
                    <div className="form-group">
                        <label htmlFor="product-sucursal" className="form-label">Sucursal</label>
                        <select
                            id="product-sucursal"
                            className="form-select"
                            defaultValue="" // Añadimos un valor por defecto
                            {...register("product_sucursal", { required: "Debes seleccionar una sucursal" })}
                        >
                            <option value="" disabled>Selecciona una sucursal</option>
                            {/* Verificamos que 'branches' exista y sea un array antes de mapear */}
                            {Array.isArray(branches) && branches.map(sucursal => (
                                <option key={sucursal.id} value={sucursal.id}>
                                    {sucursal.nombre}
                                </option>
                            ))}
                        </select>
                         {errors.product_sucursal && <span style={{color: 'red', fontSize: '0.9rem'}}>{errors.product_sucursal.message}</span>}
                    </div>
                    {/* El botón de envío */}
                    <button type="submit" className="form-button">Agregar Producto</button>
                </form> {/* Asegúrate que el form cierre aquí */}
            </div> {/* Asegúrate que content-card cierre aquí */}
        </div> // Asegúrate que el div principal cierre aquí
    );
}

export default AddProductForm;