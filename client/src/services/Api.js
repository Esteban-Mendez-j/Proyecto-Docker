// //Docker
// export const API_URL = import.meta.env.PUBLIC_API_URL || 'http://backend:8080';
// export const WS_URL  = import.meta.env.PUBLIC_WS_URL  || 'ws://backend:8080';

// export const DOCKER_URL_VIDEO  = import.meta.env.PUBLIC_CLIENT_WS_URL  || `${API_URL}/video/`;
// export const DOCKER_URL_IMAGEN  = import.meta.env.PUBLIC_CLIENT_WS_URL  || `${API_URL}/img/`;
// export const DOCKER_URL_PDF  = import.meta.env.PUBLIC_CLIENT_WS_URL  || `${API_URL}/pdf/`;

// //local
// export const API_CLIENT_URL = import.meta.env.PUBLIC_CLIENT_API_URL || 'http://localhost:8080';
// export const WS_CLIENT_URL  = import.meta.env.PUBLIC_CLIENT_WS_URL  || 'ws://localhost:8080';

// export const URL_VIDEO  = import.meta.env.PUBLIC_CLIENT_WS_URL  || `${API_CLIENT_URL}/video/`;
// export const URL_IMAGEN  = import.meta.env.PUBLIC_CLIENT_WS_URL  || `${API_CLIENT_URL}/img/`;
// export const URL_PDF  = import.meta.env.PUBLIC_CLIENT_WS_URL  || `${API_CLIENT_URL}/pdf/`;

// PRODUCCIÓN (Vercel)
export const API_CLIENT_URL = import.meta.env.VITE_CLIENT_API_URL;
export const WS_CLIENT_URL  = import.meta.env.VITE_CLIENT_WS_URL;

// Rutas de archivos
export const URL_VIDEO  = `${API_CLIENT_URL}/video/`;
export const URL_IMAGEN = `${API_CLIENT_URL}/img/`;
export const URL_PDF    = `${API_CLIENT_URL}/pdf/`;

