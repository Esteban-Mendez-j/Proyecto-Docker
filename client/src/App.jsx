import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import RouteProtection from "./components/RouteProtection";
import AdminIndex from "./page/admin/AdminIndex";
import AdminUsuarios from "./page/admin/AdminUsuarios";
import AdminVacantes from "./page/admin/AdminVacantes";
import ListadoVacantes from "./page/candidato/ListadoVacantes";
import PerfilCandidatoPrivate from "./page/candidato/PerfilCandidatoPrivate";
import PerfilCandidatoEditar from "./page/candidato/PerfilCandidatoEditar.jsx";
import PostuladosPage from "./page/candidato/Postulados.jsx";
import Chat from "./page/chat/chat";
import MisVacantes from "./page/empresa/MisVacantes.jsx";
import Postulados from "./page/empresa/Postulados.jsx";
import EmpresaPerfil from "./page/empresa/PublicPerfilEmpresa.jsx";
import Vacantes from "./page/empresa/Vacantes.jsx";
import EditarVacantes from "./page/empresa/EditarVacantes.jsx";
import NotFound from "./page/invitado/404";
import Index from './page/invitado/Index';
import InfoVacante from "./page/invitado/InfoVacante";
import Login from "./page/invitado/Login";
import Registro from "./page/invitado/Registro";
import RegistroCandidato from "./page/invitado/RegistroCandidato";
import RegistroEmpresa from './page/invitado/RegistroEmpresa';
import EditarPerfilEmpresa from "./page/empresa/EditarPerfilEmpresa.jsx";
import PrivatePerfilEmpresa from "./page/empresa/PrivatePerfilEmpresa.jsx";
import PerfilCandidatoPublic from "./page/candidato/PerfilCandidatoPublic.jsx"
import PoliticaPrivacidad from "./page/invitado/PoliticaPrivacidad.jsx";
import TerminosCondiciones from "./page/invitado/TerminosCondiciones.jsx";
import Notificaciones from "./page/candidato/Notificaciones.jsx";
import ShortsPage from './page/candidato/ShortsPage.jsx';
import FormEducation from "./page/candidato/FormEducation.jsx";
import FormHistorial from "./page/candidato/FormHistorial.jsx";


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RouteProtection accessRole={"CANDIDATO"} />}> 
          <Route path="/perfil/candidato" element={<PerfilCandidatoPrivate/>} />
          <Route path="/postulaciones" element= {<PostuladosPage/>} />
          <Route path= "/notificaciones" element= {<Notificaciones/>} />
          <Route path= "/perfil/candidato/editar/estudios/:id?" element={<FormEducation/>}/>
          <Route path= "/perfil/candidato/editar/historial/:id?" element={<FormHistorial/>}/>
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
        <Route element={<RouteProtection accessRole={["CANDIDATO","ROLE_INVITADO"]} />}> 
          <Route path="/shorts" element={<ShortsPage />} />
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
        <Route path="*" element={<NotFound/>} />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
