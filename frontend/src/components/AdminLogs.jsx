import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import './AdminLogs.css'; // Crearemos este CSS pequeño abajo

function AdminLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchLogs = async () => {
        try {
            const response = await axios.get('/logs');
            setLogs(response.data);
        } catch (err) {
            console.error("Error cargando logs:", err);
            setError("No se pudo cargar el historial.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
        // Opcional: Recargar cada 30 segundos automáticamente
        const interval = setInterval(fetchLogs, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="content-block" id="system-logs">
            <div className="content-card">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                    <h2>Bitácora del Sistema</h2>
                    <button onClick={fetchLogs} className="btn-sm" style={{background: 'none', border: '1px solid #ccc', cursor: 'pointer'}}>
                        🔄 Actualizar
                    </button>
                </div>

                {loading && <p>Cargando eventos...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                {!loading && !error && (
                    <div className="table-responsive">
                        <table className="logs-table">
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Usuario</th>
                                    <th>Acción</th>
                                    <th>Detalle</th>
                                    <th>IP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log) => (
                                    <tr key={log.id}>
                                        <td style={{whiteSpace: 'nowrap', fontSize: '0.85rem'}}>{log.fecha}</td>
                                        <td style={{fontWeight: 'bold', color: 'var(--brand-purple)'}}>{log.usuario}</td>
                                        <td>
                                            <span className={`badge badge-${log.accion.split('_')[0].toLowerCase()}`}>
                                                {log.accion}
                                            </span>
                                        </td>
                                        <td>{log.detalle}</td>
                                        <td style={{fontSize: '0.8rem', color: '#666'}}>{log.ip}</td>
                                    </tr>
                                ))}
                                {logs.length === 0 && (
                                    <tr>
                                        <td colSpan="5" style={{textAlign: 'center'}}>No hay registros aún.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminLogs;