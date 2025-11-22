import Swal from 'sweetalert2';

export async function manejarFormulario({ form, validateForm, buildData, endpointUrl, redirectUrl, metodo, tipo = "application/json" }) {
  limpiarErrores();

  if (!validateForm()) {
    await Swal.fire({ text: "Por favor, complete los campos correctamente.", icon: 'info' });    return;
  }

  try {
    const formData = new FormData(form);
    const data = buildData(formData);
    let response;

    if (tipo === "application/json") {
      response = await fetch(endpointUrl, {
        method: metodo,
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });
    } else if (tipo === "multipart/form-data") {
      response = await fetch(endpointUrl, {
        method: metodo,
        body: buildData(formData),
        credentials: 'include'
      });
    } else {
      throw new Error("Tipo de contenido no soportado");
    }

    const responseData = await response.json();
    if (responseData.status === 201) {
      form.reset();
      await Swal.fire({ text: responseData.mensaje || "Formulario enviado correctamente", icon: 'success' }); if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    }
    else if (responseData.status === 200) {
      form.reset();
      await Swal.fire({ text: responseData.mensaje || "Porceso exitoso!", icon: 'success' }); if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    }
    else if (responseData.errors) {
      mostrarErrores(responseData.errors);
    }
    else {
      await Swal.fire({ text: responseData.mensaje|| "Error desconocido", icon: 'error' });
    }

  } catch (error) {
    await Swal.fire({ text: "Error al conectar con el servidor", icon: 'error' });    console.error(error);
  }
}

function limpiarErrores() {
  const errorFields = document.querySelectorAll('.error-text');
  const errorInput = document.querySelectorAll('.error-input');
  errorInput.forEach(input => input.classList.remove("error-input"));
  errorFields.forEach(field => {
    field.textContent = "";
    field.classList.add('hidden');
  });
}

function mostrarErrores(errors) {
  for (let fieldName in errors) {
    const field = document.querySelector(`[name="${fieldName}"]`);
    const labelError = document.getElementById(`error-${fieldName}`);
    if (field && labelError) {
      field.classList.add('error-input');
      labelError.classList.remove("hidden");
      labelError.textContent = errors[fieldName];
    }
  }
}
