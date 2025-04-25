document.addEventListener('DOMContentLoaded', function() {
    // Menu mobile
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const nav = document.querySelector('nav');

    mobileMenuBtn.addEventListener('click', function() {
        nav.classList.toggle('active');
    });

    // Fechar menu ao clicar em um link
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                nav.classList.remove('active');
            }
        });
    });

    // Cardápio dinâmico
    const menuItems = [
        {
            id: 1,
            name: "AK Clássico",
            description: "Pão brioche, hambúrguer 180g, queijo cheddar, alface, tomate e molho especial.",
            price: 28.90,
            image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        },
        {
            id: 2,
            name: "AK Bacon",
            description: "Pão brioche, hambúrguer 180g, queijo cheddar, bacon crocante, cebola caramelizada e molho barbecue.",
            price: 32.90,
            image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        },
        {
            id: 3,
            name: "AK Vegetariano",
            description: "Pão brioche, hambúrguer de grão-de-bico, queijo coalho, rúcula, tomate seco e molho de iogurte.",
            price: 26.90,
            image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        },
        {
            id: 4,
            name: "AK Picante",
            description: "Pão australiano, hambúrguer 200g, queijo pepper jack, pimenta jalapeño, cebola roxa e molho picante.",
            price: 30.90,
            image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        },
        {
            id: 5,
            name: "AK Duplo",
            description: "Pão brioche, 2 hambúrgueres 180g, queijo prato, queijo cheddar, bacon e molho especial.",
            price: 38.90,
            image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        },
        {
            id: 6,
            name: "AK Frango",
            description: "Pão brioche, hambúrguer de frango 180g, queijo prato, alface, tomate e molho de ervas.",
            price: 27.90,
            image: "https://images.unsplash.com/photo-1534790566855-4cb788d389ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        }
    ];

    const menuGrid = document.querySelector('.menu-grid');

    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="menu-item-content">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <span class="price">R$ ${item.price.toFixed(2)}</span>
                <button class="add-to-cart" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">Adicionar ao Carrinho</button>
            </div>
        `;
        menuGrid.appendChild(menuItem);
    });

    // Sistema de Carrinho
    let cart = [];
    const cartButton = document.getElementById('cart-button');
    const cartModal = document.querySelector('.cart-modal');
    const closeCart = document.querySelector('.close-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const cartCount = document.querySelector('.cart-count');
    const clearCartBtn = document.querySelector('.clear-cart');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const checkoutModal = document.querySelector('.checkout-modal');
    const closeCheckout = document.querySelector('.close-checkout');
    const backToCart = document.querySelector('.back-to-cart');
    const confirmOrder = document.querySelector('.confirm-order');
    const orderSummary = document.querySelector('.order-summary');

    // Abrir/fechar carrinho
    cartButton.addEventListener('click', function(e) {
        e.preventDefault();
        cartModal.classList.add('active');
    });

    closeCart.addEventListener('click', function() {
        cartModal.classList.remove('active');
    });

    // Abrir/fechar checkout
    checkoutBtn.addEventListener('click', function() {
        updateOrderSummary();
        cartModal.classList.remove('active');
        checkoutModal.classList.add('active');
    });

    closeCheckout.addEventListener('click', function() {
        checkoutModal.classList.remove('active');
    });

    backToCart.addEventListener('click', function() {
        checkoutModal.classList.remove('active');
        cartModal.classList.add('active');
    });

    // Adicionar item ao carrinho
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            const name = e.target.getAttribute('data-name');
            const price = parseFloat(e.target.getAttribute('data-price'));
            
            addToCart(id, name, price);
        }
    });

    // Limpar carrinho
    clearCartBtn.addEventListener('click', clearCart);

    // Confirmar pedido
    confirmOrder.addEventListener('click', function() {
        alert('Pedido confirmado! Envie o comprovante PIX para finalizar.');
        clearCart();
        checkoutModal.classList.remove('active');
    });

    function addToCart(id, name, price) {
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id,
                name,
                price,
                quantity: 1
            });
        }
        
        updateCart();
    }

    function updateCart() {
        renderCartItems();
        updateCartTotal();
        updateCartCount();
    }

    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio</p>';
            return;
        }
        
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">R$ ${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn increase" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        // Adicionar eventos para os novos botões
        document.querySelectorAll('.decrease').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                decreaseQuantity(id);
            });
        });

        document.querySelectorAll('.increase').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                increaseQuantity(id);
            });
        });

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                removeItem(id);
            });
        });
    }

    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalPrice.textContent = `R$ ${total.toFixed(2)}`;
    }

    function updateCartCount() {
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = count;
    }

    function increaseQuantity(id) {
        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity += 1;
            updateCart();
        }
    }

    function decreaseQuantity(id) {
        const item = cart.find(item => item.id === id);
        if (item && item.quantity > 1) {
            item.quantity -= 1;
            updateCart();
        } else if (item && item.quantity === 1) {
            removeItem(id);
        }
    }

    function removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        updateCart();
    }

    function clearCart() {
        cart = [];
        updateCart();
    }

    function updateOrderSummary() {
        orderSummary.innerHTML = '';
        
        if (cart.length === 0) return;
        
        cart.forEach(item => {
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <span>${item.name} x${item.quantity}</span>
                <span>R$ ${(item.price * item.quantity).toFixed(2)}</span>
            `;
            orderSummary.appendChild(orderItem);
        });

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const totalElement = document.createElement('div');
        totalElement.className = 'order-item';
        totalElement.innerHTML = `
            <strong>Total</strong>
            <strong>R$ ${total.toFixed(2)}</strong>
        `;
        orderSummary.appendChild(totalElement);
    }

    // Suavizar rolagem para âncoras
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#carrinho') {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});