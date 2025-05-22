import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_Djx8uNVr.mjs';
import { manifest } from './manifest_COY9ZZQy.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/admin/analisis.astro.mjs');
const _page3 = () => import('./pages/admin/usuarios.astro.mjs');
const _page4 = () => import('./pages/admin/vacantes.astro.mjs');
const _page5 = () => import('./pages/admin.astro.mjs');
const _page6 = () => import('./pages/chat/_id_.astro.mjs');
const _page7 = () => import('./pages/dashboard/candidato.astro.mjs');
const _page8 = () => import('./pages/dashboard/empresa.astro.mjs');
const _page9 = () => import('./pages/empleos/editar/_nvacantes_.astro.mjs');
const _page10 = () => import('./pages/empleos/listadovacantes.astro.mjs');
const _page11 = () => import('./pages/empleos/vacantes.astro.mjs');
const _page12 = () => import('./pages/empleos/_id_.astro.mjs');
const _page13 = () => import('./pages/empleos.astro.mjs');
const _page14 = () => import('./pages/lista.astro.mjs');
const _page15 = () => import('./pages/login.astro.mjs');
const _page16 = () => import('./pages/perfil/candidato/editar.astro.mjs');
const _page17 = () => import('./pages/perfil/candidato/_id_.astro.mjs');
const _page18 = () => import('./pages/perfil/candidato.astro.mjs');
const _page19 = () => import('./pages/perfil/empresa/editar.astro.mjs');
const _page20 = () => import('./pages/perfil/empresa/_id_.astro.mjs');
const _page21 = () => import('./pages/perfil/empresa.astro.mjs');
const _page22 = () => import('./pages/postulados/_nvacantes_.astro.mjs');
const _page23 = () => import('./pages/postulados.astro.mjs');
const _page24 = () => import('./pages/registro/candidato.astro.mjs');
const _page25 = () => import('./pages/registro/empresa.astro.mjs');
const _page26 = () => import('./pages/registro/exito.astro.mjs');
const _page27 = () => import('./pages/registro.astro.mjs');
const _page28 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/node.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/admin/analisis.astro", _page2],
    ["src/pages/admin/usuarios.astro", _page3],
    ["src/pages/admin/vacantes.astro", _page4],
    ["src/pages/admin/index.astro", _page5],
    ["src/pages/chat/[id].astro", _page6],
    ["src/pages/dashboard/candidato.astro", _page7],
    ["src/pages/dashboard/empresa.astro", _page8],
    ["src/pages/empleos/editar/[nvacantes].astro", _page9],
    ["src/pages/empleos/listadoVacantes.astro", _page10],
    ["src/pages/empleos/Vacantes.astro", _page11],
    ["src/pages/empleos/[id].astro", _page12],
    ["src/pages/empleos/index.astro", _page13],
    ["src/pages/lista.astro", _page14],
    ["src/pages/login.astro", _page15],
    ["src/pages/perfil/candidato/editar.astro", _page16],
    ["src/pages/perfil/candidato/[id].astro", _page17],
    ["src/pages/perfil/candidato/index.astro", _page18],
    ["src/pages/perfil/empresa/editar.astro", _page19],
    ["src/pages/perfil/empresa/[id].astro", _page20],
    ["src/pages/perfil/empresa/index.astro", _page21],
    ["src/pages/postulados/[nvacantes].astro", _page22],
    ["src/pages/postulados/index.astro", _page23],
    ["src/pages/registro/candidato.astro", _page24],
    ["src/pages/registro/empresa.astro", _page25],
    ["src/pages/registro/exito.astro", _page26],
    ["src/pages/registro/index.astro", _page27],
    ["src/pages/index.astro", _page28]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "mode": "standalone",
    "client": "file:///C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/dist/client/",
    "server": "file:///C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/dist/server/",
    "host": false,
    "port": 4321,
    "assets": "_astro"
};
const _exports = createExports(_manifest, _args);
const handler = _exports['handler'];
const startServer = _exports['startServer'];
const options = _exports['options'];
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { handler, options, pageMap, startServer };
