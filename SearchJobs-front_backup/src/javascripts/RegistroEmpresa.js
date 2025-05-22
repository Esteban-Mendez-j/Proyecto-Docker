import { manejarFormulario } from './MensajeErrorFrom.js';
import { API_CLIENT_URL } from './Api.js';
import Swal from 'sweetalert2';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const nextButton = document.querySelector('button[type="button"]');
  const cancelButton = document.querySelector('button[type="button"]:first-child');
  const loginLink = document.querySelector('a[href*="sesion"]');

  const password = document.getElementById('passwordEmpresa');
  const confirmPassword = document.getElementById('confirmPasswordEmpresa');

  const reqLength = document.getElementById('req-length');
  const reqUppercase = document.getElementById('req-uppercase');
  const reqLowercase = document.getElementById('req-lowercase');
  const reqNumber = document.getElementById('req-number');
  const reqMatch = document.getElementById('req-match');

  const progressFill = document.querySelector('.progress-bar-fill');

  const validateForm = () => {
    const companyName = document.querySelector('input[placeholder="Nombre legal de la empresa"]').value;
    const taxId = document.querySelector('input[placeholder="Número de identificación tributaria"]').value;
    const companyType = document.querySelector('select').value;
    const email = document.querySelector('input[type="email"]').value;
    const passwordValue = password.value.trim();
    const confirmPasswordValue = confirmPassword.value.trim();

    if (!companyName || !taxId || companyType === "Selecciona una opción" || !email || !passwordValue || !confirmPasswordValue) {
      Swal.fire({ text: 'Por favor, completa todos los campos obligatorios.', icon: 'info' });      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({ text: 'Por favor, ingresa un correo electrónico válido.', icon: 'error' });      return false;
    }

    const lengthValid = passwordValue.length >= 8 && passwordValue.length <= 15;
    const uppercaseValid = /[A-Z]/.test(passwordValue);
    const lowercaseValid = /[a-z]/.test(passwordValue);
    const numberValid = /[0-9]/.test(passwordValue);
    const matchValid = passwordValue !== '' && passwordValue === confirmPasswordValue;

    if (!lengthValid || !uppercaseValid || !lowercaseValid || !numberValid) {
      Swal.fire({ text: 'La contraseña no cumple con los requisitos de seguridad.', icon: 'error' });      return false;
    }

    if (!matchValid) {
      Swal.fire({ text: 'Las contraseñas no coinciden.', icon: 'error' });      return false;
    }

    return true;
  };

  const updatePasswordRequirements = () => {
    const passwordValue = password.value.trim();
    const confirmPasswordValue = confirmPassword.value.trim();

    reqLength.classList.toggle('valid', passwordValue.length >= 8 && passwordValue.length <= 15);
    reqUppercase.classList.toggle('valid', /[A-Z]/.test(passwordValue));
    reqLowercase.classList.toggle('valid', /[a-z]/.test(passwordValue));
    reqNumber.classList.toggle('valid', /[0-9]/.test(passwordValue));
    reqMatch.classList.toggle('valid', passwordValue !== '' && passwordValue === confirmPasswordValue);
  };

  if (nextButton) {
    nextButton.addEventListener('click', (e) => {
      e.preventDefault();
      if (validateForm()) {
        progressFill.style.width = '100%';
        Swal.fire({ text: 'Formulario válido. Avanzando al siguiente paso...', icon: 'info' });      }
    });
  }

  if (cancelButton) {
    cancelButton.addEventListener('click', () => {
      if (confirm('¿Estás seguro de que quieres cancelar el registro?')) {
        window.location.href = '/';
      }
    });
  }

  if (loginLink) {
    loginLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '/iniciar-sesion';
    });
  }

  if (password && confirmPassword) {
    password.addEventListener('input', updatePasswordRequirements);
    confirmPassword.addEventListener('input', updatePasswordRequirements);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    manejarFormulario({
      form,
      validateForm,
      buildData: (formData) => ({
        nombre: formData.get('nombre'),
        sectorEmpresarial: formData.get('sectorEmpresa'),
        correo: formData.get('correo'),
        contrasena: formData.get('passwordEmpresa'),
        telefono: formData.get('telefono'),
        nit: formData.get('nit'),
      }),
      endpointUrl: `${API_CLIENT_URL}/api/empresas/add`,
      redirectUrl: '/login',
      metodo:"POST"
    });
  });
});
