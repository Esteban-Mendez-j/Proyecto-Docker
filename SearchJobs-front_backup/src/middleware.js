import { API_URL } from './javascripts/Api.js';
const rutasPorRol = {
  'ROLE_INVITADO': ['/', '/login','/empleos/*','/perfil/empresa/*','/registro', '/registro/candidato','/registro/empresa', '/404'],
  'CANDIDATO': [ '/','/login','/pdf/*', '/perfil/empresa/*','/chat/*','/dashboard/candidato','/empleos/*', '/perfil/candidato/*', '/logout', '/chat/candidato/*', '/postulados', '/404'],
  'EMPRESA': [ '/','/login','/dashboard/empresa','/pdf/*',  '/chat/*','/perfil/empresa/*', '/logout','/postulados/*', '/chat/empresa/*', '/404', "/empleos/*", '/perfil/candidato/*'],
  'ADMIN': [ '/','/login','/admin/*','/perfil/*','/pdf/*',  '/logout', '/404', '/empleos/*','/postulados/*', '/perfil/candidato/*'],
  'SUPER_ADMIN': ['/','/admin/*','/login', '/pdf/*', '/perfil/*','/logout', '/404', '/empleos/*','/postulados/*', '/perfil/candidato/*' ]
};

export async function onRequest(context, next) {
  const { request, url } = context;
  function rutaPermitida(rutasPermitidas, rutaActual) {
    return rutasPermitidas.some(ruta => {
      if (ruta.endsWith('/*')) {
        const prefijo = ruta.slice(0, -2);
        return rutaActual.startsWith(prefijo);
      }
      return rutaActual === ruta;
    });
  }

  try {
    
    console.log(`${API_URL}/api/usuarios/rol`)
    const cookie = request.headers.get('cookie');
    const res = await fetch(`${API_URL}/api/usuarios/rol`, {
      headers: {
        'cookie': cookie,
        'Content-Type': 'application/json',
      },
      credentials: 'include',  
    });
    
    if (!res.ok) {
      url.pathname = "/login";
      return Response.redirect(url.toString(), 302);
    }
    const data = await res.json();
    const rolPrincipal = data.rolPrincipal.toUpperCase();
    console.log("rol "+rolPrincipal)
    const rutaActual = url.pathname;
    const rutasPermitidas = rutasPorRol[rolPrincipal] || [];
    if (rutaPermitida(rutasPermitidas, rutaActual)) {
      return next();
    } else {
      console.log("eroro: "+rutaActual)
      url.pathname = "/404";
      return Response.redirect(url.toString(), 302);
    }

  } catch (error) {
    console.error('[MIDDLEWARE] Error:', error);
    url.pathname = "/";
    return Response.redirect(url.toString(), 302);
  }
}
