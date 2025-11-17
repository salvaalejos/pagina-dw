import React from 'react';
import { useForm } from 'react-hook-form';
import axios from '../api/axiosConfig';

function AddUserForm({ branches, onUserAdded }) {
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
    const selectedRol = watch("rol", "cliente");

    const onSubmit = (data) => {
        console.log("Creando nuevo usuario:", data);

        if (data.rol !== 'sucursal') {
            data.id_branch = null;
        }

        // CORRECCIÓN: Se quitó /api. Ahora llama a /users
        axios.post('/users', data)
            .then(res => {
                alert(res.data.message);
                reset();
                onUserAdded();
            })
            .catch(err => {
                console.error("Error al agregar usuario:", err);
                if (err.response && err.response.data.message) {
                    alert(`Error: ${err.response.data.message}`);
                } else {
                    alert("Error al agregar usuario. Revisa la consola.");
                }
            });
    };

    return (
        <div id="add-user-section" className="content-block">
            <div className="content-card">
                <h2>Agregar Nuevo Usuario</h2>
                <form id="add-user-form" onSubmit={handleSubmit(onSubmit)}>

                    <div className="form-group">
                        <label htmlFor="user-name" className="form-label">Nombre Completo</label>
                        <input
                            type="text"
                            id="user-name"
                            placeholder="Ej: Juan Pérez"
                            className="form-input"
                            {...register("name", { required: "El nombre es obligatorio" })}
                        />
                         {errors.name && <span style={{color: 'red', fontSize: '0.9rem'}}>{errors.name.message}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="user-email" className="form-label">Email (Opcional para Sucursal/Admin)</label>
                        <input
                            type="email"
                            id="user-email"
                            placeholder="ej: usuario@correo.com"
                            className="form-input"
                            {...register("email")}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="user-username" className="form-label">Nombre de Usuario (para login)</label>
                        <input
                            type="text"
                            id="user-username"
                            placeholder="Ej: juanperez_sucursal"
                            className="form-input"
                            {...register("username", { required: "El nombre de usuario es obligatorio" })}
                        />
                         {errors.username && <span style={{color: 'red', fontSize: '0.9rem'}}>{errors.username.message}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="user-password" className="form-label">Contraseña</label>
                        <input
                            type="password"
                            id="user-password"
                            placeholder="Contraseña segura"
                            className="form-input"
                            {...register("password", { required: "La contraseña es obligatoria" })}
                        />
                         {errors.password && <span style={{color: 'red', fontSize: '0.9rem'}}>{errors.password.message}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="user-rol" className="form-label">Rol del Usuario</label>
                        <select
                            id="user-rol"
                            className="form-select"
                            defaultValue="cliente"
                            {...register("rol", { required: "El rol es obligatorio" })}
                        >
                            <option value="cliente">Cliente</option>
                            <option value="sucursal">Sucursal</option>
                            <option value="admin">Administrador</option>
                        </select>
                         {errors.rol && <span style={{color: 'red', fontSize: '0.9rem'}}>{errors.rol.message}</span>}
                    </div>

                    {selectedRol === 'sucursal' && (
                        <div className="form-group">
                            <label htmlFor="user-sucursal" className="form-label">Asignar a Sucursal</label>
                            <select
                                id="user-sucursal"
                                className="form-select"
                                defaultValue=""
                                {...register("id_branch", { required: "La sucursal es obligatoria para este rol" })}
                            >
                                <option value="" disabled>Selecciona una sucursal</option>
                                {Array.isArray(branches) && branches.map(sucursal => (
                                    <option key={sucursal.id} value={sucursal.id}>
                                        {sucursal.nombre}
                                    </option>
                                ))}
                            </select>
                            {errors.id_branch && <span style={{color: 'red', fontSize: '0.9rem'}}>{errors.id_branch.message}</span>}
                        </div>
                    )}

                    <button type="submit" className="form-button">Crear Usuario</button>
                </form>
            </div>
        </div>
    );
}

export default AddUserForm;