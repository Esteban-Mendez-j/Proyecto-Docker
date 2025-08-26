import Swal from 'sweetalert2';
import { API_CLIENT_URL } from './Api';

export const manejarRespuesta = async (res) => {
  let data;
  try {
    try {
      data = await res.json();
    } catch (e) {
      data = {};
    }
    console.log(res.status)
    if (res.status === 401) {
      if (data.error === "TOKEN_EXPIRED") {
        await Swal.fire({ text: "Tu sesión ha expirado.", icon: 'error' });       
        window.location.href=`${API_CLIENT_URL}/usuarios/cerrarSesion`;
      } else {
        await Swal.fire({ text: "No estás autenticado.", icon: 'error' });      
      }
      window.location.href =`${API_CLIENT_URL}/usuarios/cerrarSesion`;

      // window.location.href = "/login";
      data= null
      return;
    }

    if (res.status === 403) {
      await Swal.fire({ text: "no autorizado", icon: 'error' });
      window.location.href = "/404";
      return;
    }

    if (!res.ok) {
      await Swal.fire({ text: data.message || "Error desconocido", icon: 'error' });      return;
    }

    // Si todo va bien
    return data;

  } catch (error) {
    console.error("Error de red:", error);
    await Swal.fire({ text: "Ocurrió un error de red.", icon: 'error' });  }
};


export default manejarRespuesta;
