
export async function toggleFavoritoRequest(nvacantes) {
  try {
    const response = await fetch(
      `http://localhost:8080/api/vacantes/favoritas/add/${nvacantes}`,
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
    console.log("⭐", data.mensaje);

    return data; // puedes retornar la respuesta si la necesitas
  } catch (error) {
    console.error("❌ Error al agregar favorito:", error);
    throw error; // para manejarlo en el componente
  }
}