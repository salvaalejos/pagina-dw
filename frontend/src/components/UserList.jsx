import React from 'react';
import axios from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

function UserList({ users, branches, onUserDeleted }) {

    const { user: currentUser } = useAuth();

    const getBranchName = (branchId) => {
        if (branchId === null || branchId === undefined) {
            return "N/A";
        }
        const branch = branches.find(b => String(b.id) === String(branchId));
        return branch ? branch.nombre : "Desconocida";
    };

    const handleDelete = (id) => {
        if (id === currentUser.id) {
            alert("No puedes eliminar tu propia cuenta.");
            return;
        }

        if (window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
            // CORRECCIÓN: Se quitó /api. Ahora llama a /users/:id
            axios.delete(`/users/${id}`)
                .then(res => {
                    alert("¡Usuario eliminado!");
                    onUserDeleted();
                })
                .catch(err => {
                    console.error("Error al eliminar:", err);
                    if (err.response && err.response.data.message) {
                        alert(`Error: ${err.response.data.message}`);
                    } else {
                        alert("Error al eliminar el usuario.");
                    }
                });
        }
    };

    return (
        <div id="users-list-section" className="content-block">
            <div className="content-card">
                <h2>Usuarios Actuales</h2>
                <div id="users-list" className="list-container">
                    {!Array.isArray(users) || users.length === 0 ? (
                        <p className="empty-list-message">No hay usuarios para mostrar.</p>
                    ) : (
                        users.map(user => (
                            <div className="list-item" key={user.id}>
                                <div className="list-item-content">
                                    <div className="list-item-info">
                                        <p className="title">{user.nombre} (@{user.username})</p>
                                        <p className="subtitle">Email: {user.email || "N/A"}</p>
                                        <p className="subtitle">Rol: {user.rol} | Sucursal: {getBranchName(user.id_sucursal)}</p>
                                    </div>
                                </div>

                                {currentUser.id !== user.id && (
                                    <button className="delete-button" onClick={() => handleDelete(user.id)}>
                                        <i data-lucide="trash-2"></i>
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserList;