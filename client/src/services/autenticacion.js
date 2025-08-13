import { API_CLIENT_URL } from './Api.js';
console.log(API_CLIENT_URL)
document.addEventListener('DOMContentLoaded', () => {
    const passwordToggle = document.getElementById('passwordToggle');
    const password = document.getElementById('password');
    const form = document.getElementById("loginForm");

    if (passwordToggle && password) {
        passwordToggle.addEventListener('click', () => {
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);

            if (type === 'text') {
                passwordToggle.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
          `;
                passwordToggle.setAttribute('aria-label', 'Ocultar contraseña');
            } else {
                passwordToggle.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          `;
                passwordToggle.setAttribute('aria-label', 'Mostrar contraseña');
            }
        });
    }

    form?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const target = e.target;
        const formData = new FormData(target);
        const username = formData.get("username")?.toString() || "";
        const password = formData.get("password")?.toString() || "";
        const divError = document.getElementById("ErrorElement");
        const strongError = document.getElementById("ErrorMessage");

        try {
            console.log(`${API_CLIENT_URL}/api/usuarios/login`)
            const response = await fetch(`${API_CLIENT_URL}/api/usuarios/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    username: username,
                    password: password,
                }),
                credentials: "include"
            });

            if (response.ok) {
                target.reset();
                divError.classList.add("hidden");
                const data = await response.json();
                const roles = data.roles;
                const rolPrincipal = data.rolPrincipal;
                console.log(rolPrincipal)
                if (rolPrincipal == "ADMIN" || rolPrincipal == "SUPER_ADMIN") {
                    window.location.href = "/admin";
                } else if (rolPrincipal === "EMPRESA") {
                    window.location.href = "/dashboard/empresa";
                } else {
                    window.location.href = "/dashboard/candidato";
                }
            } else {
                const errorData = await response.json();
                divError.classList.remove("hidden");
                strongError.textContent = errorData.mensaje;
            }
        } catch (err) {
            console.error("Error en login:", err);
            alert("Ocurrió un error al iniciar sesión.");
        }
    });
});