document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('myForm');
  const errorContainer = document.getElementById('errorContainer');
  const successContainer = document.getElementById('successContainer');

  form.addEventListener('submit', function(e) {
      e.preventDefault();
      errorContainer.style.display = 'none';
      successContainer.style.display = 'none';
      errorContainer.innerHTML = '';
      let isValid = true;
  
      // Validar nombre y apellido
      const name = document.getElementById('name');
      const lastname = document.getElementById('lastname');
      if (name.value.trim() === '' || lastname.value.trim() === '') {
        showError('Name and Last Name are required');
        isValid = false;
      }
  
      // Validar teléfono
      const phone = document.getElementById('phone');
      if (!isValidPhone(phone.value)) {
        showError('Please enter a valid phone number');
        isValid = false;
      }
  
      // Validar email
      const email = document.getElementById('email');
      if (!isValidEmail(email.value)) {
        showError('Please enter a valid email address');
        isValid = false;
      }
  
      // Validar modelo de máquina y número de parte
      const machinemodel = document.getElementById('machinemodel');
      const partnumber = document.getElementById('partnumber');
      if (machinemodel.value.trim() === '' || partnumber.value.trim() === '') {
        showError('Machine Model and Part Number are required');
        isValid = false;
      }
  
      // Validar mensaje
      const message = document.getElementById('message');
      if (message.value.trim() === '') {
        showError('Please enter a message');
        isValid = false;
      }
  
      if (isValid) {
        // Enviar el formulario usando AJAX
        fetch(form.action, {
            method: form.method,
            body: new FormData(form)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                successContainer.textContent = data.message;
                successContainer.style.display = 'block';
                form.reset();
            } else {
                throw new Error(data.message || 'Unknown error occurred');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError(error.message || 'There was an error sending the form. Please try again.');
        });
    }
});
  
    function isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }
  
    function isValidPhone(phone) {
      const re = /^\+?[\d\s()-]{10,}$/;
      return re.test(phone);
    }
  
    function showError(message) {
      if (errorContainer.innerHTML === '') {
        errorContainer.innerHTML = '<ul></ul>';
      }
      const ul = errorContainer.querySelector('ul');
      const li = document.createElement('li');
      li.textContent = message;
      ul.appendChild(li);
      errorContainer.style.display = 'block';
    }
  
    // Agregar listeners para limpiar mensajes de error al escribir
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', function() {
        errorContainer.style.display = 'none';
        successContainer.style.display = 'none';
      });
    });
  });