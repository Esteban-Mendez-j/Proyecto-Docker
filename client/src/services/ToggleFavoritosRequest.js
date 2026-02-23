import { API_CLIENT_URL } from "./Api";

export async function toggleFavoritoRequest(nvacantes) {
  try {
    const response = await fetch(
      `${API_CLIENT_URL}/api/vacantes/favoritas/add/${nvacantes}`,
      {
        method: "POST",
        credentials: "include", // necesario para enviar la cookie jwtToken
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("Error al agregar favorito");

    const data = await response.json();
    return data; // puedes retornar la respuesta si la necesitas
  } catch (error) {
    console.error("❌ Error al agregar favorito:", error);
    throw error; // para manejarlo en el componente
  }
}