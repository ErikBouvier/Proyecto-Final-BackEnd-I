const socket = io();
const cartList = document.getElementById('cart-list');

socket.on('add-to-cart', async ({ cartId, productId }) => {
    try {
        socket.emit('add-to-cart', { cartId, productId });
        socket.emit('cart-updated', cart); 
    } catch (error) {
        socket.emit('error', error.message); 
    }
});

const addToCart = (productId) => {
    let cartId = localStorage.getItem('cartId');
    if (!cartId) {
        fetch('/api/carts/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', charset: 'utf-8',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al crear el carrito');
            }
            return response.json();
        })
        .then(data => {
            cartId = data.payload._id;
            localStorage.setItem('cartId', cartId);

            socket.emit('add-to-cart', { cartId, productId });
        })
        .catch(error => {
            console.error('Error al crear el carrito:', error);
            alert('No se pudo crear el carrito. Intente nuevamente.');
        });
    } else {
        socket.emit('add-to-cart', { cartId, productId });
    }
};

const removeFromCart = (productId) => {
    const cartId = localStorage.getItem('cartId');
    if (!cartId) {
        console.error('No hay carrito activo');
        return;
    }
    socket.emit('remove-from-cart', { cartId, productId });
};

const viewCart = () => {
    const cartId = localStorage.getItem('cartId');
    if (!cartId) {
        console.error('No hay carrito activo');
        return;
    }
    window.location.href = `/cart/${cartId}`;
};

socket.on('cart-updated', (cart) => {
    if (!cart || !cart.products) {  
        console.error('El carrito está vacío o no es válido');
        cartList.innerHTML = '<p>El carrito está vacío o no se pudo cargar.</p>';
        return;
    }

    if (cartList) {
        cartList.innerHTML = '';

        cart.products.forEach(cartItem => {
            const productItem = document.createElement('div');
            productItem.classList.add('product-item');
            productItem.innerHTML = `
                <h2>Articulo: ${cartItem.product?.title || 'No disponible'}</h2>
                <p>Descripción: ${cartItem.product?.description || 'No disponible'}</p>
                <p>Codigo: ${cartItem.product?.code || 'No disponible'}</p>
                <p>Precio: ${cartItem.product?.price || 'No disponible'}</p>
                <p>Stock: ${cartItem.product?.stock || 'No disponible'}</p>
                <p>Categoría: ${cartItem.product?.category || 'No disponible'}</p>
                <p>Cantidad: ${cartItem.quantity}</p>
            `;
            cartList.appendChild(productItem);
        });
    }
});


const clearCart = () => {
    const cartId = localStorage.getItem('cartId');
    if (!cartId) {
        console.error('No hay carrito activo');
        return;
    }
    socket.emit('clear-cart', { cartId });
};

