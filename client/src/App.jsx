import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import RouteProtection from "./components/RouteProtection";
import Loading from "./components/Loading";

// Code splitting con React.lazy para carga bajo demanda de páginas
const AdminIndex = lazy(() => import("./page/admin/AdminIndex.jsx"));
const AdminUsuarios = lazy(() => import("./page/admin/AdminUsuarios.jsx"));
const AdminVacantes = lazy(() => import("./page/admin/AdminVacantes.jsx"));
const ListadoVacantes = lazy(() => import("./page/candidato/ListadoVacantes.jsx"));
const PerfilCandidatoPrivate = lazy(() => import("./page/candidato/PerfilCandidatoPrivate.jsx"));
const PerfilCandidatoEditar = lazy(() => import("./page/candidato/PerfilCandidatoEditar.jsx"));
const PostuladosPage = lazy(() => import("./page/candidato/Postulados.jsx"));
const Chat = lazy(() => import("./page/chat/Chat.jsx"));
const MisVacantes = lazy(() => import("./page/empresa/MisVacantes.jsx"));
const Postulados = lazy(() => import("./page/empresa/Postulados.jsx"));
const EmpresaPerfil = lazy(() => import("./page/empresa/PublicPerfilEmpresa.jsx"));
const Vacantes = lazy(() => import("./page/empresa/Vacantes.jsx"));
const EditarVacantes = lazy(() => import("./page/empresa/EditarVacantes.jsx"));
const NotFound = lazy(() => import("./page/invitado/404.jsx"));
const Index = lazy(() => import('./page/invitado/Index.jsx'));
const InfoVacante = lazy(() => import("./page/invitado/InfoVacante.jsx"));
const Login = lazy(() => import("./page/invitado/Login.jsx"));
const Registro = lazy(() => import("./page/invitado/Registro.jsx"));
const RegistroCandidato = lazy(() => import("./page/invitado/RegistroCandidato.jsx"));
const RegistroEmpresa = lazy(() => import('./page/invitado/RegistroEmpresa.jsx'));
const EditarPerfilEmpresa = lazy(() => import("./page/empresa/EditarPerfilEmpresa.jsx"));
const PrivatePerfilEmpresa = lazy(() => import("./page/empresa/PrivatePerfilEmpresa.jsx"));
const PerfilCandidatoPublic = lazy(() => import("./page/candidato/PerfilCandidatoPublic.jsx"));
const PoliticaPrivacidad = lazy(() => import("./page/invitado/PoliticaPrivacidad.jsx"));
const TerminosCondiciones = lazy(() => import("./page/invitado/TerminosCondiciones.jsx"));
const Notificaciones = lazy(() => import("./page/candidato/Notificaciones.jsx"));
const ShortsPage = lazy(() => import('./page/candidato/ShortsPage.jsx'));
const FormEducation = lazy(() => import("./page/candidato/FormEducation.jsx"));
const FormHistorial = lazy(() => import("./page/candidato/FormHistorial.jsx"));
const SubscriptionPage = lazy(() => import("./page/invitado/SubscriptionPage.jsx"))

function App() {

  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<RouteProtection accessRole={"CANDIDATO"} />}> 
            <Route path="/perfil/candidato" element={<PerfilCandidatoPrivate/>} />
            <Route path="/postulaciones" element={<PostuladosPage/>} />
            <Route path="/notificaciones" element={<Notificaciones/>} />
            <Route path="/perfil/candidato/editar/estudios/:id?" element={<FormEducation/>}/>
            <Route path="/perfil/candidato/editar/historial/:id?" element={<FormHistorial/>}/>
            <Route path="/shorts" element={<ShortsPage />} />
          </Route>
          <Route element={<RouteProtection accessRole={"EMPRESA"} />}> 
            <Route path="/empresa/vacantes" element={<Vacantes/>} />
            <Route path="/empresa/editar/vacantes/:nvacantes" element={<EditarVacantes/>} />
            <Route path="/empresa/listado/vacantes" element={<MisVacantes />} />
            <Route path="/perfil/empresa" element={<PrivatePerfilEmpresa/>} />
            <Route path="/perfil/empresa/editar" element={<EditarPerfilEmpresa />} />
          </Route>
          <Route element={<RouteProtection accessRole={["EMPRESA","CANDIDATO"]} />}> 
            <Route path="/chat/:id" element={<Chat/>} />
          </Route>
          <Route element={<RouteProtection accessRole={"ROLE_INVITADO"} />}> 
            <Route path="/registro" element={<Registro />} />
            <Route path="/registro/empresa" element={<RegistroEmpresa />} />
            <Route path="/registro/candidato" element={<RegistroCandidato />} />
          </Route>
          <Route element={<RouteProtection accessRole={["ADMIN","SUPER_ADMIN"]} />}> 
            <Route path="/admin/index" element={<AdminIndex/>} /> 
            <Route path="/admin/vacantes" element={<AdminVacantes/>} />
            <Route path="/admin/usuarios" element={<AdminUsuarios/>} />
          </Route>
          <Route element={<RouteProtection accessRole={["EMPRESA","CANDIDATO","ROLE_INVITADO"]} />}> 
            <Route path="/" element={<Index />} />
          </Route>
          <Route element={<RouteProtection accessRole={["EMPRESA","ADMIN","SUPER_ADMIN"]} />}> 
            <Route path="/empresa/postulados/:vacanteId" element={<Postulados/>} />
          </Route>
          <Route path="/login" element={<Login/>} />
          <Route path="/empleos/:id" element={<InfoVacante />} />
          <Route path="/empleos" element={<ListadoVacantes/>} />
          <Route path="/perfil/empresa/:id" element={<EmpresaPerfil/>} />
          <Route path="/perfil/candidato/:id" element={<PerfilCandidatoPublic/>} />
          <Route path="/perfil/candidato/editar" element={<PerfilCandidatoEditar/>}/>
          <Route path="/politicas/privacidad" element={<PoliticaPrivacidad/>}/>
          <Route path="/terminos/condiciones" element={<TerminosCondiciones/>}/>
          <Route path="/suscripciones" element={<SubscriptionPage/>}/>
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App;
