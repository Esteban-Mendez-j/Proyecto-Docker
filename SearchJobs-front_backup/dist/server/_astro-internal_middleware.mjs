import { A as API_URL } from './chunks/Api_4ZQkpW66.mjs';
import 'es-module-lexer';
import './chunks/astro-designed-error-pages_DDI2CgXU.mjs';
import 'kleur/colors';
import './chunks/astro/server_BYoYEapS.mjs';
import 'clsx';
import 'cookie';
import { s as sequence } from './chunks/index_CJHwGcsP.mjs';

const rutasPorRol = {
  'ROLE_INVITADO': ['/', '/login','/empleos/*', '/registro','/perfil/empresa/*', '/registro/candidato','/registro/empresa', '/404'],
  'CANDIDATO': [ '/login','/perfil/empresa/*','/dashboard/candidato','/empleos/*', '/perfil/candidato/*', '/logout', '/chat/candidato/*', '/postulados', '/404'],
  'EMPRESA': [ '/dashboard/empresa', '/perfil/empresa/*', '/logout','/postulados/*', '/chat/empresa/*', '/404', "/empleos/*"],
  'ADMIN': [ '/admin/*','/perfil/*', '/logout', '/404', '/empleos/*','/postulados/*'],
  'SUPER_ADMIN': ['/admin/*', '/perfil/*','/logout', '/404', '/empleos/*','/postulados/*' ]
};

async function onRequest$1(context, next) {
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
    
    console.log(`${API_URL}/api/usuarios/rol`);
    const cookie = request.headers.get('cookie');
    const res = await fetch(`${API_URL}/api/usuarios/rol`, {
      headers: {
        'cookie': cookie,
        'Content-Type': 'application/json',
      },
      credentials: 'include',  
    });
    console.log("peticion "+res.ok);
    if (!res.ok) {
      url.pathname = "/login";
      return Response.redirect(url.toString(), 302);
    }
    const data = await res.json();
    const rolPrincipal = data.rolPrincipal.toUpperCase();
    console.log("rol "+rolPrincipal);
    const rutaActual = url.pathname;
    const rutasPermitidas = rutasPorRol[rolPrincipal] || [];
    if (rutaPermitida(rutasPermitidas, rutaActual)) {
      return next();
    } else {
      url.pathname = "/404";
      return Response.redirect(url.toString(), 302);
    }

  } catch (error) {
    console.error('[MIDDLEWARE] Error:', error);
    url.pathname = "/login";
    return Response.redirect(url.toString(), 302);
  }
}

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
