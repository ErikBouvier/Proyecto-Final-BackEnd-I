const socket = io();

const productsList = document.getElementById('products-list');    
const productsForm = document.getElementById('product-form');
const errorMessage = document.getElementById('error-message');
const productId = document.getElementById('product-id');
const btnDelete = document.getElementById('btn-delete-product');
const prevPageButton = document.getElementById('pag-prev');
const nextPageButton = document.getElementById('pag-sig');
const pageNumberSpan = document.getElementById('page-number');

socket.on('products-list', (data) => {
    const products = data.products.docs || [];

    productsList.innerText = '';

    products.forEach(product => {
        productsList.innerHTML += `<li>Id: ${product.id} - Nombre: ${product.title} - Categoria: ${product.category} - Price: ${product.price} </li>`;
    });
})

productsForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.target;
    const formdata = new FormData(form);
    console.log('formData',);
    
    errorMessage.innerText = '';

    form.reset();

    socket.emit('new-product', {
        title: formdata.get('title'),
        description: formdata.get('description'),
        code: formdata.get('code'),
        price: formdata.get('price'),
        status: formdata.get('status') || 'off',
        stock: formdata.get('stock'),
        category: formdata.get('category'),
    });
});

btnDelete.onclick = () => {
    const id = Number(productId.value);
    productId.value = '';
    errorMessage.innerText = '';

    if (id > 0){
        socket.emit('delete-product', { id });
    }
}



let currentPage = 1;
const limit = 10;

const fetchProducts = async (page) => {
    try {
        const response = await fetch(`/api/products?page=${page}&limit=${limit}`);
        const data = await response.json();

        if (data.status === 'success') {
            productsList.innerHTML = '';
            data.payload.docs.forEach(product => {
                productsList.innerHTML += `<li>Id: ${product._id} - Nombre: ${product.title} - Categoría: ${product.category} - Precio: ${product.price}</li>`;
            });

            prevPageButton.disabled = page <= 1;
            nextPageButton.disabled = !data.payload.hasNextPage;
            pageNumberSpan.textContent = `Página ${page}`;
        } else {
            console.error('Error fetching products:', data.message);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

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

fetchProducts(currentPage);

socket.on('error-message', (data) => {
    errorMessage.innerText = data.message;
});





