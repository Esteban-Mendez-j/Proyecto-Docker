import { API_CLIENT_URL } from './Api.js';

export async function autenticacion(username, password) {
  try {
    const res = await fetch(`${API_CLIENT_URL}/api/usuarios/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username, password }),
      credentials: "include"
    });

    if (!res.ok) {
        // throw new Error(`Error HTTP: ${res.status}`);
        return{data: null, error: "Credenciales Invalidas"}
    }

    const data = await res.json();
    return { data, error: null };
  } catch (e) {
    return { data: null, error: e};
  }
}
