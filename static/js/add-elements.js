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
                productsList.innerHTML = ''; // Limpiar la lista
                if (products.length === 0) {
                    productsList.innerHTML = '<p class="text-gray-500">No hay productos para mostrar.</p>';
                    return;
                }
                products.forEach(product => {
                    const productEl = document.createElement('div');
                    productEl.className = 'flex items-center justify-between bg-gray-50 p-3 rounded-lg';
                    productEl.innerHTML = `
                        <div class="flex items-center gap-4">
                            <img src="${product.image}" alt="[Imagen de ${product.name}]" class="w-16 h-16 object-cover rounded-md">
                            <div>
                                <p class="font-bold text-gray-800">${product.name}</p>
                                <p class="text-sm text-emerald-600 font-semibold">$${product.price.toFixed(2)}</p>
                            </div>
                        </div>
                        <button class="delete-product text-red-500 hover:text-red-700 p-2" data-id="${product.id}">
                            <i data-lucide="trash-2" class="w-5 h-5"></i>
                        </button>
                    `;
                    productsList.appendChild(productEl);
                });
                lucide.createIcons();
            };

            const renderBranches = () => {
                branchesList.innerHTML = ''; // Limpiar la lista
                if (branches.length === 0) {
                    branchesList.innerHTML = '<p class="text-gray-500">No hay sucursales para mostrar.</p>';
                    return;
                }
                branches.forEach(branch => {
                    const branchEl = document.createElement('div');
                    branchEl.className = 'flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg';
                    branchEl.innerHTML = `
                        <p class="font-semibold text-gray-800">${branch.name}</p>
                        <button class="delete-branch text-red-500 hover:text-red-700 p-2" data-id="${branch.id}">
                            <i data-lucide="trash-2" class="w-5 h-5"></i>
                        </button>
                    `;
                    branchesList.appendChild(branchEl);
                });
                lucide.createIcons();
            };

            // --- MANEJADORES DE EVENTOS ---
            addProductForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const newProduct = {
                    id: Date.now(),
                    name: document.getElementById('product-name').value,
                    price: parseFloat(document.getElementById('product-price').value),
                    image: document.getElementById('product-image').value,
                    description: document.getElementById('product-description').value,
                };
                products.push(newProduct);
                localStorage.setItem('products', JSON.stringify(products));
                renderProducts();
                addProductForm.reset();
            });

            addBranchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const newBranch = {
                    id: Date.now(),
                    name: document.getElementById('branch-name').value,
                };
                branches.push(newBranch);
                localStorage.setItem('branches', JSON.stringify(branches));
                renderBranches();
                addBranchForm.reset();
            });

            productsList.addEventListener('click', (e) => {
                const deleteButton = e.target.closest('.delete-product');
                if (deleteButton) {
                    const productId = parseInt(deleteButton.dataset.id);
                    products = products.filter(p => p.id !== productId);
                    localStorage.setItem('products', JSON.stringify(products));
                    renderProducts();
                }
            });

            branchesList.addEventListener('click', (e) => {
                const deleteButton = e.target.closest('.delete-branch');
                if (deleteButton) {
                    const branchId = parseInt(deleteButton.dataset.id);
                    branches = branches.filter(b => b.id !== branchId);
                    localStorage.setItem('branches', JSON.stringify(branches));
                    renderBranches();
                }
            });

            // Renderizado inicial
            renderProducts();
            renderBranches();
        });