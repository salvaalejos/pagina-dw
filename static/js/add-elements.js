document.addEventListener('DOMContentLoaded', () => {

    // Referencias a elementos del DOM
    const addProductForm = document.getElementById('add-product-form');
    const productsList = document.getElementById('products-list');
    const addBranchForm = document.getElementById('add-branch-form');
    const branchesList = document.getElementById('branches-list');

    // Cargar datos desde localStorage o usar datos por defecto
    let products = JSON.parse(localStorage.getItem('products')) || [
        { id: 1, name: "Taro Fresh Milk", price: 55.00, image: "https://placehold.co/600x400/a7f3d0/10b981?text=Taro+Fresh", description: "El clásico y cremoso sabor del taro con leche fresca." }
    ];
    let branches = JSON.parse(localStorage.getItem('branches')) || [
        { id: 1, name: "Sucursal Centro" }, { id: 2, name: "Sucursal Norte" }
    ];

    // --- FUNCIONES DE RENDERIZADO ---
    const renderProducts = () => {
        lucide.createIcons();
    };

    const renderBranches = () => {
        lucide.createIcons();
    };


});