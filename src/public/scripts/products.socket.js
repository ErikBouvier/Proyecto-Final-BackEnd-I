const product_socket = io();

const productsList = document.getElementById('products-list');
const productsForm = document.getElementById('product-form');
const productAdded = document.getElementById('product-added');
const errorMessage = document.getElementById('error-message');
const productId = document.getElementById('product-id');
const btnDelete = document.getElementById('btn-delete-product');
const prevPageButton = document.getElementById('pag-prev');
const nextPageButton = document.getElementById('pag-sig');
const pageNumber = document.getElementById('page-number');
const clearCartBtn = document.getElementById('clear-cart-btn');

let currentPage = 1; 

const updateProductsList = (products) => {
    if (productsList) {
        productsList.innerHTML = '';
        products.forEach(product => {
            productsList.innerHTML += `<li>Id: ${product._id} - Nombre: ${product.title} - Categoría: ${product.category} - Precio: ${product.price}</li>`;
        });
    }
};

const fetchProducts = async (page = 1, limit = 10) => {
    try {
        const response = await fetch(`/api/products?page=${page}&limit=${limit}`);
        const data = await response.json();

        if (data.status === 'success') {
            updateProductsList(data.payload.docs);

            if (pageNumber) {
                pageNumber.innerText = `Página ${page}`;
            }

            if (prevPageButton) {
                prevPageButton.disabled = page <= 1;
            }

            if (nextPageButton) {
                nextPageButton.disabled = !data.payload.hasNextPage;
            }
        } else {
            console.error(data.message || 'Error al obtener los productos');
        }
    } catch (error) {
        console.error('Error en fetchProducts:', error);
    }
};

if (prevPageButton && nextPageButton) {
    prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchProducts(currentPage);
        }
    });

    nextPageButton.addEventListener('click', () => {
        currentPage++;
        fetchProducts(currentPage);
    });
}

if (productsForm) {
    productsForm.onsubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        
        errorMessage.innerText = '';

        product_socket.emit('new-product', {
            title: formData.get('title'),
            description: formData.get('description'),
            code: formData.get('code'),
            price: formData.get('price'),
            status: formData.get('status') || 'off',
            stock: formData.get('stock'),
            category: formData.get('category'),
        });

        form.reset();
    };
}

if (btnDelete) {
    btnDelete.onclick = () => {
        const id = productId.value;
        
        productId.value = '';
        errorMessage.innerText = '';
        product_socket.emit('delete-product', { id });

    };
}

product_socket.on('connect', () => {
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            const cartId = clearCartBtn.getAttribute('data-cart-id');
            product_socket.emit('clear-cart', { cartId });
        });
    }
});

product_socket.on('products-list', (data) => {
    const products = data.products.docs ?? [];
    updateProductsList(products);
});

product_socket.on('product-added', (product) => {
    if (productAdded) {
        productAdded.innerHTML = `
            <h2>Artículo: ${product.title}</h2>
            <p>Descripción: ${product.description}</p>
            <p>Código: ${product.code}</p>
            <p>Precio: ${product.price}</p>
            <p>Stock: ${product.stock}</p>
            <p>Categoría: ${product.category}</p>
            <p>Cantidad: ${product.quantity}</p>
        `;
    }
});

product_socket.on('error-message', (data) => {
    if (errorMessage) {
        errorMessage.innerText = data.message;
    }
});

fetchProducts(currentPage);
