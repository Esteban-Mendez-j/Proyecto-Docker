import { API_CLIENT_URL } from '/src/javascripts/Api.js';
import { manejarRespuesta } from './ManejarRespuesta';
import Swal from 'sweetalert2';

document.addEventListener("DOMContentLoaded", () => {
    const applyButton = document.getElementById("applyButton");
    const ChatBTN = document.getElementById("ChatBTN");

    applyButton?.addEventListener("click", async () => {
        const jobId = applyButton.getAttribute("data-id");

        try {
            const response = await fetch(
                `${API_CLIENT_URL}/api/postulados/add/${jobId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include", // incluye cookies si usas JWT en cookies
                },
            );

            const data = await response.json();

            if (data.status === "success") {
                await Swal.fire({ text: data.message || "Postulación exitosa.", icon: 'success' });
                window.location.reload(); 
            } else if (data.status === "info") {
                await Swal.fire({ text: data.message || "Completa tu perfil para postularte.", icon: 'info' }); window.location.href = "/perfil/candidato"; // ajusta esta ruta a la real
            } else if (data.status === "error") {
                await Swal.fire({ text: data.message || "No se pudo realizar la postulación.", icon: 'error' });
            }
        } catch (error) {
            console.error("Error al postularse:", error);
            await Swal.fire({ text: "Hubo un error al postularse.", icon: 'error' });
        }
    });

    ChatBTN?.addEventListener("click", async () => {
        const jobId = ChatBTN.getAttribute("data-id");

        try {
            const response = await fetch(
                `${API_CLIENT_URL}/api/chats/vacantes/crear`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ jobId }),
                    credentials: 'include' 
                },
            );

            const chat = await manejarRespuesta(response);
            if (!chat){return}
            window.location.href = `/chat/${chat.id}`;

        } catch (error) {
            console.error("Error al crear el chat:", error);
            await Swal.fire({ text: "Hubo un error al crear el chat.", icon: 'error' });
        }
    });
});