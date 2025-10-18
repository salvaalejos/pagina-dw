import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig'; // Ajusta la ruta (../) si es necesario

// Importamos los componentes que forman esta página
import Header from '../components/Header';
import MenuSection from '../components/MenuSection'; // Componente de Menú (NUEVO)
import ContactForm from '../components/ContactForm'; // Formulario de contacto actualizado

function LandingPage() {

    // --- Estado para guardar los datos de la API ---
    const [branches, setBranches] = useState([]);
    const [products, setProducts] = useState([]);

    // --- useEffect para buscar los datos al cargar la página ---
    useEffect(() => {
        const fetchData = () => {
            const fetchProducts = axios.get('http://localhost:5000/api/products');
            const fetchBranches = axios.get('http://localhost:5000/api/branches');

            Promise.all([fetchProducts, fetchBranches])
                .then(([productsRes, branchesRes]) => {
                    setProducts(productsRes.data);
                    setBranches(branchesRes.data);
                })
                .catch(error => console.error("Error fetching landing page data:", error));
        };

        fetchData();
    }, []); // El `[]` asegura que se ejecute solo una vez al cargar

    // --- Efecto para Lucide icons ---
    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }); // Se ejecuta en cada render para refrescar iconos

    return (
        <>
            <Header />

            <main>
                <div className="container">
                    {/* --- Secciones Estáticas (Misión, Visión, etc.) --- */}
                    <section className="content-section">
                        <div className="image-container">
                            <img src="/images/mision-mascota.png" alt="Mascota Guardia de Pop Bubbles" />
                        </div>
                        <div className="text-content">
                            <h2 className="section-title">Misión</h2>
                            <p>
                                Ser la marca de referencia en bebidas frappe con boba...
                            </p>
                        </div>
                    </section>

                    <section className="content-section">
                        <div className="image-container">
                            <img src="/images/vision-mascota.png" alt="Mascota de Pop Bubbles" />
                        </div>
                        <div className="text-content">
                            <h2 className="section-title">Visión</h2>
                            <p>
                                Expandir nuestra marca para ser reconocida a nivel nacional...
                            </p>
                        </div>
                    </section>

                    <section className="content-section">
                        <div className="image-container">
                             <img src="/images/historia-mascota.png" alt="Vaso de Pop Bubbles" />
                        </div>
                        <div className="text-content">
                            <h2 className="section-title">Nuestra historia</h2>
                            <p>
                                La marca "POPS BUBBLES TEA" es pionera en Morelia...
                                <br/><br/>
                                Contamos con una amplia variedad de sabores...
                            </p>
                        </div>
                    </section>
                </div>
            </main>

            {/* --- Sección Dinámica del Menú ---
              Pasamos los productos y sucursales que cargamos de la API
            */}
            <MenuSection products={products} branches={branches} />

            {/* --- Formulario de Contacto (ya conectado) --- */}
            <ContactForm />

            <footer className="main-footer">
                <div className="logo-footer">Pop Bubbles</div>
                <p>© 2024 Todos los derechos reservados.</p>
            </footer>
        </>
    );
}

export default LandingPage;