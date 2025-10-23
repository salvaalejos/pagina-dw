import React from 'react';
import { useForm } from 'react-hook-form';
import axios from '../api/axiosConfig'; // Ajusta la ruta (../) si es necesario

function ContactForm() {
    // Agregamos `reset` para limpiar el formulario después de enviar
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    // Función de envío adaptada
    const onSubmit = (data) => {
        console.log("Datos del formulario de contacto:", data);

        axios.post('http://localhost:5000/api/comments', data)
            .then(response => {
                alert("¡Comentario enviado con éxito!");
                reset(); // Limpiamos los campos del formulario
            })
            .catch(error => {
                console.error("Error al enviar comentario:", error);
                alert("Hubo un error al enviar tu comentario. Intenta de nuevo.");
            });
    };

    return (
        <section id="contacto" className="fade-in-section">
            <div className="container">
                <div className="text-content" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 className="section-title">¡Contáctanos!</h2>
                    <p style={{ maxWidth: '600px', margin: '1rem auto 0' }}>¿Tienes una idea, un antojo o una duda? Nos encantaría escucharte.</p>
                </div>

                <div className="card">
                    {/* Conectamos el `onSubmit` de React */}
                    <form id="contact-form" onSubmit={handleSubmit(onSubmit)}>
                        {/* El CSRF Token se elimina */}

                        <div className="form-group">
                            <label htmlFor="name" className="form-label">Nombre Completo</label>
                            <input
                                type="text"
                                id="name"
                                placeholder="Tu nombre aquí"
                                className="form-input"
                                {...register("name", { required: "Tu nombre es obligatorio" })}
                            />
                            {errors.name && <span style={{color: 'red', fontSize: '0.9rem'}}>{errors.name.message}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Correo Electrónico</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="tu@correo.com"
                                className="form-input"
                                {...register("email", { required: "El correo es obligatorio" })}
                            />
                            {errors.email && <span style={{color: 'red', fontSize: '0.9rem'}}>{errors.email.message}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="message" className="form-label">Mensaje</label>
                            <textarea
                                id="message"
                                rows="5"
                                placeholder="Cuéntanos cómo podemos ayudarte..."
                                className="form-textarea"
                                {...register("message", { required: "No olvides escribir un mensaje" })}
                            ></textarea>
                            {errors.message && <span style={{color: 'red', fontSize: '0.9rem'}}>{errors.message.message}</span>}
                        </div>
                        <div style={{ textAlign: 'center', margin: '2rem 0 0 0' }}>
                            <button type="submit" className="btn btn-primary">Enviar Mensaje</button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default ContactForm;