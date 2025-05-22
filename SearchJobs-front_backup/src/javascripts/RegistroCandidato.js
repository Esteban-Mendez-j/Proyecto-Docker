import { manejarFormulario } from './MensajeErrorFrom.js';
import { API_CLIENT_URL } from './Api.js';
import Swal from 'sweetalert2';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registroForm');
    const stepsContainer = [document.getElementById('step1')];
    const progressFill = document.getElementById('progressFill');
    const steps = document.querySelectorAll('.step');

    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const passwordToggle = document.getElementById('passwordToggle');
    const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
    
    const reqLength = document.getElementById('req-length');
    const reqUppercase = document.getElementById('req-uppercase');
    const reqLowercase = document.getElementById('req-lowercase');
    const reqNumber = document.getElementById('req-number');
    const reqMatch = document.getElementById('req-match');

    const updateProgress = (step) => {
      const width = ((step - 1) / (stepsContainer.length)) * 100;
      if (progressFill) {
        progressFill.style.width = `${width}%`;
      }
      
      steps.forEach((stepEl) => {
        const stepNum = parseInt(stepEl.dataset.step, 10);
        if (stepNum < step) {
          stepEl.classList.add('completed');
          stepEl.classList.remove('active');
        } else if (stepNum === step) {
          stepEl.classList.add('active');
          stepEl.classList.remove('completed');
        } else {
          stepEl.classList.remove('active', 'completed');
        }
      });
    };

    const validateForm = () => {
      const nombre = document.getElementById('nombre').value.trim();
      const email = document.getElementById('email').value.trim();
      const apellido  = document.getElementById('apellido').value.trim();
      const identificacion = document.getElementById('identificacion').value.trim();
      const passwordValue = password.value;
      const confirmPasswordValue = confirmPassword.value;
      const terminos = document.getElementById('terminos').checked;

      if (!nombre || !email || !passwordValue || !confirmPasswordValue || !apellido || !identificacion) {
        Swal.fire({ text: 'Completa todos los campos requeridos', icon: 'info' });       
        return false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Swal.fire({ text: 'Ingresa un correo electrónico válido', icon: 'error' });        
        return false;
      }

      const passwordValidations = {
        length: passwordValue.length >= 8 && passwordValue.length <= 15,
        uppercase: /[A-Z]/.test(passwordValue),
        lowercase: /[a-z]/.test(passwordValue),
        number: /[0-9]/.test(passwordValue),
        match: passwordValue === confirmPasswordValue
      };

      if (Object.values(passwordValidations).includes(false)) {
        Swal.fire({ text: 'La contraseña no cumple los requisitos', icon: 'error' });        return false;
      }

      if (!terminos) {
        Swal.fire({ text: 'Debes aceptar los términos y condiciones', icon: 'info' });        return false;
      }

      return true;
    };

    const togglePasswordVisibility = (input, toggleButton) => {
      toggleButton.addEventListener('click', () => {
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        toggleButton.innerHTML = type === 'text' 
          ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>'
          : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
      });
    };

    if (password && passwordToggle) togglePasswordVisibility(password, passwordToggle);
    if (confirmPassword && confirmPasswordToggle) togglePasswordVisibility(confirmPassword, confirmPasswordToggle);

    const validatePassword = () => {
      const passwordValue = password.value;
      const confirmPasswordValue = confirmPassword.value;

      reqLength.classList.toggle('valid', passwordValue.length >= 8 && passwordValue.length <= 15);
      reqUppercase.classList.toggle('valid', /[A-Z]/.test(passwordValue));
      reqLowercase.classList.toggle('valid', /[a-z]/.test(passwordValue));
      reqNumber.classList.toggle('valid', /[0-9]/.test(passwordValue));
      reqMatch.classList.toggle('valid', passwordValue && confirmPasswordValue && passwordValue === confirmPasswordValue);
    };

    password?.addEventListener('input', validatePassword);
    confirmPassword?.addEventListener('input', validatePassword);

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      manejarFormulario({
        form,
        validateForm,
        buildData: (formData) => ({
            nombre: formData.get('nombre'),
            apellido: formData.get('apellido'),
            correo: formData.get('correo'),
            contrasena: formData.get('password'),
            telefono: formData.get('telefono'),
            identificacion: formData.get('identificacion'),
        }),
        endpointUrl: `${API_CLIENT_URL}/api/candidatos/add`,
        redirectUrl: '/login',
        metodo:"POST"
      });
    });
});
