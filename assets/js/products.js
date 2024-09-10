// Elementos del DOM
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const productList = document.getElementById('product-list');
const loadMoreButton = document.getElementById('load-more-button');

let products = []; // Almacenará todos los productos
let displayedProducts = []; // Almacenará los productos actualmente mostrados
let currentIndex = 0; // Índice del último producto mostrado
const productsPerLoad = 10; // Número de productos a cargar cada vez

// Función para cargar los productos desde el archivo JSON
async function loadProducts() {
    try {
        const response = await fetch('./assets/inc/data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        products = await response.json();
        displayProducts(products.slice(0, productsPerLoad));
        currentIndex = productsPerLoad;
        updateLoadMoreButton();
    } catch (error) {
        console.error('Error al cargar los productos:', error);
        productList.innerHTML = '<div class="product-item"><div class="card-body">Error al cargar los productos. Por favor, intente más tarde.</div></div>';
    }
}

// Función para mostrar productos
function displayProducts(productsToShow) {
    productList.innerHTML = '';
    productsToShow.forEach(product => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <div class="card-header">
            <h5>Part Number: ${product.partNumbers.join(', ')}</h5>
            </div>
            <div class="card-body d-flex flex-column align-items-center">
                <p>${product.description}</p>
                
                <button class="info-button btn btn-request" onclick="requestInfo('${product.partNumbers[0]}')">Request Information</button>
            </div>
        `;
        productList.appendChild(div);
    });
    displayedProducts = productsToShow;
}

// Función para filtrar productos
function filterProducts(searchTerm) {
    return products.filter(product => 
        product.partNumbers.some(partNumber => 
            partNumber.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
}

// Función para cargar más productos
function loadMore() {
    const nextBatch = products.slice(currentIndex, currentIndex + productsPerLoad);
    displayProducts([...displayedProducts, ...nextBatch]);
    currentIndex += productsPerLoad;
    updateLoadMoreButton();
}

// Función para actualizar el estado del botón "Cargar más"
function updateLoadMoreButton() {
    loadMoreButton.style.display = currentIndex >= products.length ? 'none' : 'inline-block';
}

// Función para solicitar información (simulada)
/* function requestInfo(partNumber) {
    alert(`Solicitud de información para el producto: ${partNumber}`);
    // Aquí se podría abrir un modal o redirigir a un formulario
} */

// Evento para búsqueda en tiempo real
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value;
    const filteredProducts = filterProducts(searchTerm);
    displayProducts(filteredProducts.slice(0, productsPerLoad));
    currentIndex = productsPerLoad;
    updateLoadMoreButton();
});

// Evento para el botón de búsqueda
searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value;
    const filteredProducts = filterProducts(searchTerm);
    displayProducts(filteredProducts.slice(0, productsPerLoad));
    currentIndex = productsPerLoad;
    updateLoadMoreButton();
});

// Evento para el botón "Cargar más"
loadMoreButton.addEventListener('click', loadMore);

// Cargar los productos al iniciar la página
loadProducts();

// Elementos del DOM para el modal
const modal = document.getElementById('contact-modal');
const closeBtn = modal.querySelector('.close');
const contactForm = document.getElementById('contact-form');

const divSuccess = document.getElementById('successContainer');
const partNumberInput = document.getElementById('part-number');
const modalBody = modal.querySelector('.modal-body');

// Función para abrir el modal
function openModal(partNumber) {
    partNumberInput.value = partNumber;
    modal.style.display = 'block';
    // Reset the form and hide any previous messages
    contactForm.reset();
    hideResponseMessage();
}

// Función para cerrar el modal
function closeModal() {
    modal.style.display = 'none';
}

// Evento para cerrar el modal
closeBtn.onclick = closeModal;
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}

// Función para solicitar información (abre el modal)
function requestInfo(partNumber) {
    openModal(partNumber);
}

// Función para mostrar el spinner de carga
function showLoadingSpinner() {
    const spinner = document.createElement('div');
    spinner.className = 'spinner-border text-primary';
    spinner.setAttribute('role', 'status');
    spinner.innerHTML = '<span class="visually-hidden">Loading...</span>';
    modalBody.appendChild(spinner);
}

// Función para ocultar el spinner de carga
function hideLoadingSpinner() {
    const spinner = modalBody.querySelector('.spinner-border');
    if (spinner) {
        spinner.remove();
    }
}


// Función para mostrar el mensaje de respuesta
function showResponseMessage(message, isSuccess) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${isSuccess ? 'alert-success' : 'alert-danger'}`;
    alertDiv.textContent = message;
    modalBody.appendChild(alertDiv);
}


// Función para ocultar el mensaje de respuesta
function hideResponseMessage() {
    const alertDiv = modalBody.querySelector('.alert');
    if (alertDiv) {
        alertDiv.remove();
    }
}

// Evento para enviar el formulario
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);

    // Ocultar cualquier mensaje anterior y mostrar el spinner
    hideResponseMessage();
    showLoadingSpinner();

    fetch('./assets/inc/send_mail.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(result => {
        hideLoadingSpinner();
        showResponseMessage(result.message, result.success);
        /* if (result.success) {
            // Opcional: cerrar el modal después de un tiempo si el envío fue exitoso
            setTimeout(closeModal, 3000);
        } */
    })
    .catch(error => {
        console.error('Error:', error);
        hideLoadingSpinner();
        showResponseMessage('Ocurred an error. Please, try again.', false);
    });
});


const contactFormPrincipal = document.getElementById('contact_principal');
const messageResult = document.getElementById('messageresult'); // Asegúrate de que este ID exista en tu HTML
const bodyMessage = messageResult.querySelector('.messageAlert');

function showSpinner() {
    const spinner = document.createElement('div');
    spinner.className = 'spinner-border text-primary';
    spinner.setAttribute('role', 'status');
    spinner.innerHTML = '<span class="visually-hidden">Loading...</span>';
    bodyMessage.appendChild(spinner);
}

// Función para ocultar el spinner de carga
function hideSpinner() {
    const spinner = bodyMessage.querySelector('.spinner-border');
    if (spinner) {
        spinner.remove();
    }
}


// Función para mostrar el mensaje de respuesta
function showMessage(message, isSuccess) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${isSuccess ? 'alert-success' : 'alert-danger'}`;
    alertDiv.textContent = message;
    bodyMessage.appendChild(alertDiv);
}


// Función para ocultar el mensaje de respuesta
function hideMessage() {
    const alertDiv = bodyMessage.querySelector('.alert');
    if (alertDiv) {
        alertDiv.remove();
    }
}
contactFormPrincipal.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);

    // Ocultar cualquier mensaje anterior y mostrar el spinner
    hideMessage();
    showSpinner();

    fetch('./assets/inc/send_mail_request.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(result => {
        hideSpinner();
        showMessage(result.message, result.success);
    })
    .catch(error => {
        console.error('Error:', error);
        hideSpinner();
        showMessage('Ocurrió un error. Por favor, inténtalo de nuevo.', false); // Corrección en showResponse
    });
});
