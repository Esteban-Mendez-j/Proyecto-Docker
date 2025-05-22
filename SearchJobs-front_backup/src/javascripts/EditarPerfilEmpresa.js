import { manejarFormulario } from "./MensajeErrorFrom.js";
import { API_CLIENT_URL } from './Api.js';
import Swal from 'sweetalert2';


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("PerfilForm");

  /* Campos que siempre deben venir completos */
  const requiredFields = [
    "nombre",
    "sectorEmpresa",
    "telefono",
    "nit",
    "descripcion",
    "sitioWeb",
  ];

  const validateForm = () => {
    for (const id of requiredFields) {
      const input = document.getElementById(id);
      if (!input || !input.value.trim()) {
        Swal.fire({ text: "Por favor completa todos los campos requeridos.", icon: 'info' });        
        return false;
      }
    }
    return true;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const empresaId = form.dataset.id;
      await manejarFormulario({
        form,
        validateForm,
        buildData: () => {
          // Crear un nuevo FormData vacío
          const formData = new FormData();

          // Construir el objeto empresa con los campos de texto
          const empresaPayload = {
            idUsuario: empresaId,
            nombre: form.nombre.value,
            correo: form.correo.value,
            sectorEmpresarial: form.sectorEmpresa.value,
            telefono: form.telefono.value,
            nit: form.nit.value,
            descripcion: form.descripcion.value,
            sitioWeb: form.sitioWeb.value,
            ...(form['img'].files.length === 0 && form.dataset.imagen
            ? { imagen: form.dataset.imagen }
            : {})
          };

          // Agregar el objeto empresa como JSON Blob
          formData.append(
            "empresa",
            new Blob([JSON.stringify(empresaPayload)], { type: "application/json" })
          );
          const imagenInput = form.querySelector('input[name="img"]');
          if (imagenInput && imagenInput.files.length > 0) {
            formData.append("img", imagenInput.files[0]);
          }

          return formData;
        },
        endpointUrl: `${API_CLIENT_URL}/api/empresas/edit/${empresaId}`,
        redirectUrl: "/perfil/empresa",
        metodo: "PUT",
        tipo: "multipart/form-data"
      });
  });

});
