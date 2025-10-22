import { API_CLIENT_URL } from './Api';
import { modal, modalResponse } from "./Modal";

export const manejarRespuesta = async (res) => {
  let data;
  try {
    try {
      data = await res.json();
    } catch (e) {
      data = {};
    }
    if (res.status === 401) {
      const responseModal = await modalResponse(data.message, "info")
      if(responseModal){
        window.location.href =`${API_CLIENT_URL}/usuarios/cerrarSesion`;
      }
      data= null
    }

    if (res.status === 403) {
      const responseModal = await modalResponse(data.message, "info")
      if(responseModal){
        window.location.href = "/NotFount";
      }
    }

    if (!res.ok && data) {
      modal(data.message || "Error desconocido", "error")
    }

    // Si todo va bien
    return data;

  } catch (error) {
    console.error("Error de red:", error);
    modal("Ocurrió un error de red.", error)
  }
};


export default manejarRespuesta;
