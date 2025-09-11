document.addEventListener('DOMContentLoaded', () => {


    const menuData = [
        { id: 1, name: "Taro Fresh Milk", description: "El clásico y cremoso sabor del taro con leche fresca.", price: 55.00, image: "https://placehold.co/600x400/a7f3d0/10b981?text=Taro+Fresh" },
        { id: 2, name: "Mango Pop", description: "Refrescante té verde con pulpa de mango y perlas explosivas.", price: 60.00, image: "https://placehold.co/600x400/fde68a/f59e0b?text=Mango+Pop" },
        { id: 3, name: "Strawberry Love", description: "Una dulce combinación de fresas, crema y perlas de tapioca.", price: 58.00, image: "https://placehold.co/600x400/fecaca/ef4444?text=Fresa+Love" },
        { id: 4, name: "Classic Pearl Milk Tea", description: "El inconfundible sabor del té negro con leche y perlas de tapioca.", price: 50.00, image: "https://placehold.co/600x400/d1d5db/4b5563?text=Classic" },
        { id: 5, name: "Matcha Supreme", description: "Intenso y delicioso té matcha con una suave capa de espuma de leche.", price: 65.00, image: "https://placehold.co/600x400/86efac/15803d?text=Matcha" },
        { id: 6, name: "Passion Fruit Green Tea", description: "Exótico y vibrante, ideal para un día caluroso.", price: 52.00, image: "https://placehold.co/600x400/facc15/ca8a04?text=Passion" }
    ];

    let cart = [];

    // Elementos del DOM
    const cartButton = document.getElementById('cart-button');
    const closeCartButton = document.getElementById('close-cart-button');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartTotal = document.getElementById('cart-total');
    const branchSelector = document.getElementById('branch-selector');
    const menuContainer = document.getElementById('menu-container');
    const menuItemsContainer = document.getElementById('menu-items');

    // Funciones del Carrito
    const openCart = () => {
        cartSidebar.classList.remove('translate-x-full');
        cartOverlay.classList.remove('hidden');
    };

    const closeCart = () => {
        cartSidebar.classList.add('translate-x-full');
        cartOverlay.classList.add('hidden');
    };

    const updateCart = () => {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            emptyCartMessage.classList.remove('hidden');
        } else {
            emptyCartMessage.classList.add('hidden');
            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'flex items-center justify-between mb-4';
                itemElement.innerHTML = `
                    <div class="flex items-center gap-4">
                        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-md object-cover">
                        <div>
                            <h4 class="font-bold">${item.name}</h4>
                            <p class="text-sm text-gray-500">$${item.price.toFixed(2)}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                         <button class="quantity-change text-gray-500" data-id="${item.id}" data-change="-1">-</button>
                        <span class="font-bold">${item.quantity}</span>
                        <button class="quantity-change text-gray-500" data-id="${item.id}" data-change="1">+</button>
                         <button class="remove-item text-red-500 hover:text-red-700" data-id="${item.id}"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemElement);
            });
        }

        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cartTotal.textContent = `$${total.toFixed(2)}`;

        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (totalItems > 0) {
            cartCount.textContent = totalItems;
            cartCount.classList.remove('hidden');
        } else {
            cartCount.classList.add('hidden');
        }
        lucide.createIcons(); // Re-render icons in cart
    };

    const addToCart = (productId) => {
        const product = menuData.find(p => p.id === productId);
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCart();
    };

    const changeQuantity = (productId, change) => {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                cart = cart.filter(cartItem => cartItem.id !== productId);
            }
        }
        updateCart();
    };

    const renderMenu = () => {
        menuItemsContainer.innerHTML = '';
        menuData.forEach((product, index) => {
            const menuItem = document.createElement('div');
            menuItem.className = 'bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 menu-item-card';
            menuItem.style.animationDelay = `${(index + 1) * 0.1}s`;
            menuItem.innerHTML = `
                <img src="${product.image}" alt="[Imagen de ${product.name}]" class="w-full h-48 object-cover">
                <div class="p-6">
                    <h4 class="text-xl font-bold mb-2">${product.name}</h4>
                    <p class="text-gray-600 mb-4 text-sm">${product.description}</p>
                    <div class="flex justify-between items-center">
                        <span class="text-xl font-extrabold text-emerald-600">$${product.price.toFixed(2)}</span>
                        <button class="add-to-cart-btn bg-emerald-100 text-emerald-800 hover:bg-emerald-200 font-bold py-2 px-4 rounded-full transition-colors flex items-center gap-2" data-id="${product.id}">
                            <i data-lucide="plus-circle" class="w-5 h-5"></i>
                            Agregar
                        </button>
                    </div>
                </div>
            `;
            menuItemsContainer.appendChild(menuItem);
        });
        lucide.createIcons();
    };

    // Event Listeners
    cartButton.addEventListener('click', openCart);
    closeCartButton.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    branchSelector.addEventListener('change', function() {
        if (this.value) {
            menuContainer.classList.remove('hidden');
            renderMenu();
        } else {
            menuContainer.classList.add('hidden');
        }
    });

    menuItemsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.add-to-cart-btn');
        if (btn) {
            const productId = parseInt(btn.dataset.id);
            addToCart(productId);
        }
    });

    cartItemsContainer.addEventListener('click', (e) => {
        const quantityBtn = e.target.closest('.quantity-change');
        const removeBtn = e.target.closest('.remove-item');
        if (quantityBtn) {
            const productId = parseInt(quantityBtn.dataset.id);
            const change = parseInt(quantityBtn.dataset.change);
            changeQuantity(productId, change);
        }
        if(removeBtn){
            const productId = parseInt(removeBtn.dataset.id);
            cart = cart.filter(item => item.id !== productId);
            updateCart();
        }
    });

    // Lógica del Menú Móvil
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // Efecto scroll de la barra de navegación
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('bg-white/95', 'shadow-md');
        } else {
            header.classList.remove('bg-white/95', 'shadow-md');
        }
    });

    // Simulación de envío de formulario de contacto
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        formFeedback.innerHTML = '<p class="text-emerald-600 font-semibold">¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.</p>';
        contactForm.reset();
        setTimeout(() => { formFeedback.innerHTML = ''; }, 5000);
    });

    updateCart(); // Initial call to set up the cart state

});