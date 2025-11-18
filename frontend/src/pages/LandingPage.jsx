import React, { useState, useEffect } from 'react';
import './bubbles.css';
import axios from '../api/axiosConfig';
import { useCart } from '../context/CartContext';

import Header from '../components/Header';
import MenuSection from '../components/MenuSection';
import ContactForm from '../components/ContactForm';
import Cart from '../components/Cart';
import FloatingCartButton from '../components/FloatingCartButton';

function LandingPage() {
    const [branches, setBranches] = useState([]);
    const [products, setProducts] = useState([]);
    const { isOpen: isCartOpen } = useCart();

    // Cargar datos de la API (sin cambios)
    useEffect(() => {
        const fetchData = () => {
            const fetchProducts = axios.get('/products');
            const fetchBranches = axios.get('/branches');

            Promise.all([fetchProducts, fetchBranches])
                .then(([productsRes, branchesRes]) => {
                    setProducts(productsRes.data);
                    setBranches(branchesRes.data);
                })
                .catch(error => console.error("Error fetching landing page data:", error));
        };
        fetchData();
    }, []);

    // Efecto para modificar el <body> (sin cambios)
    useEffect(() => {
        if (isCartOpen) {
            document.body.classList.add('cart-is-open');
        } else {
            document.body.classList.remove('cart-is-open');
        }
        return () => {
            document.body.classList.remove('cart-is-open');
        };
    }, [isCartOpen]);

    // CORRECCIÓN: Eliminamos el useEffect que llamaba a lucide.createIcons()
    // Lo manejaremos dentro de cada componente que lo necesite.

    return (
        <>
            <Header />
            <Cart />
            <FloatingCartButton />

            {/* CORRECCIÓN: Eliminamos el 'div' wrapper y el tag <body> inválido */}

            <main id="inicio">
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
                    {/* ... (resto de las secciones 'vision' e 'historia' van aquí igual) ... */}
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

            <MenuSection products={products} branches={branches} />
            <ContactForm />

            <footer className="main-footer">
                <div className="container">
                    <div className="logo-footer">Pop Bubbles</div>
                    <p>© 2024 Todos los derechos reservados.</p>
                </div>
            </footer>
        </>
    );
}

export default LandingPage;