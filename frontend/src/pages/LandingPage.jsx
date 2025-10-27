import React, { useState, useEffect } from 'react';
import './bubbles.css';
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
<body id="inicio"></body>
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
                                Ser la marca de referencia en bebidas frappe con boba, ofreciendo una experiencia de sabor única y refrescante. Nos comprometemos a utilizar ingredientes de la más alta calidad, priorizando la innovación en nuestros sabores y la satisfacción de nuestros clientes en cada sorbo. Buscamos crear un ambiente vibrante y acogedor donde la gente pueda disfrutar de un momento delicioso y energizante.
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
                                Expandir nuestra marca para ser reconocida a nivel nacional como el destino predilecto para los amantes de las bebidas frappe y el té de burbujas. Seremos pioneros en la creación de sabores y texturas emocionantes, estableciendo un estándar de excelencia en la calidad del producto y el servicio al cliente. Soñamos con que nuestra boba sea sinónimo de felicidad, innovación y el placer de un antojo perfecto.
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
                               La marca "POPS BUBBLES TEA" es pionera en Morelia, pues desde el año 2010 comenzó a incluir las bolitas de tapioca en las bebidas.
                                <br/><br/>
                                Contamos con una amplia variedad de sabores que dan más de un millón de combinaciones, somos únicos y naturales nuestras pulpas son preparadas con la más sabrosa pulpa natural así cada sorbo es una explosión de frescura Y que lo convierten en una experiencia única, divertida y original Además que ofrecemos opciones de personalización tan únicas como tú lo puedas querer y hacer posible.
                                Atrevete a probar cada sabor y combinación existente en bubbles y descubre por qué es mucho más que una bebida, cada vez que lo pruebes descubrirás una experiencia refres- cante que estimulará tus sentidos y se grabará en tu memoria!!!
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

            <footer class="main-footer">
        <div class="container">
            <div class="logo-footer">Pop Bubbles</div>
            <p>© 2024 Todos los derechos reservados.</p>
        </div>
    </footer>
        </>
    );
}

export default LandingPage;