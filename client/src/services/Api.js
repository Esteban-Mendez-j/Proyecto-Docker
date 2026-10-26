//Docker
export const API_URL = import.meta.env.PUBLIC_API_URL || 'http://backend:8080';
export const WS_URL  = import.meta.env.PUBLIC_WS_URL  || 'ws://backend:8080';

export const DOCKER_URL_VIDEO  = import.meta.env.PUBLIC_CLIENT_WS_URL  || `${API_URL}/video/`;
export const DOCKER_URL_IMAGEN  = import.meta.env.PUBLIC_CLIENT_WS_URL  || `${API_URL}/img/`;
export const DOCKER_URL_PDF  = import.meta.env.PUBLIC_CLIENT_WS_URL  || `${API_URL}/pdf/`;

// url Server
export const API_CLIENT_URL = import.meta.env.VITE_CLIENT_API_URL ||  'http://localhost:8080';
export const WS_CLIENT_URL  = import.meta.env.VITE_CLIENT_WS_URL || 'ws://localhost:8080';

// Supabase Storage
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

// URLs públicas de los buckets
export const URL_VIDEO = `${SUPABASE_URL}/storage/v1/object/public/video/`;
export const URL_IMAGEN = `${SUPABASE_URL}/storage/v1/object/public/imagen/`;
export const URL_PDF = `${SUPABASE_URL}/storage/v1/object/public/file/cv/`;
export const URL_FILE = `${SUPABASE_URL}/storage/v1/object/public/file/`;