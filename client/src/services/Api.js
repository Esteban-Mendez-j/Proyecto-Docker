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