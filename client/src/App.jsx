import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import AdminIndex from "./page/admin/AdminIndex";
import AdminUsuarios from "./page/admin/AdminUsuarios";
import AdminVacantes from "./page/admin/AdminVacantes";
import ListadoVacantes from "./page/candidato/ListadoVacantes";
import PerfilCandidato from "./page/candidato/PerfilCandidato";
import NotFound from "./page/invitado/404";
import Index from './page/invitado/Index';
import InfoVacante from "./page/invitado/InfoVacante";
import Login from "./page/invitado/Login";
import Registro from "./page/invitado/Registro";
import RegistroCandidato from "./page/invitado/RegistroCandidato";
import RegistroEmpresa from './page/invitado/RegistroEmpresa';
import Vacantes from "./page/empresa/Vacantes.jsx";
import EditarVacantes from "./page/empresa/editarVacantes.jsx";
import ListadoVacantes from "./page/empresa/listadoVacantes.jsx";
import PerfilEmpresa from "./page/perfil/empresa/PerfilEmpresa.jsx";
import RouteProtection from "./components/RouteProtection";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RouteProtection accessRole={"CANDIDATO"} />}> 
          <Route path="/perfil/candidato" element={<PerfilCandidato/>} />
        </Route>
        <Route element={<RouteProtection accessRole={"EMPRESA"} />}> 
          <Route path="/empresa/vacantes" element={<Vacantes />} />
          <Route path="/empresa/editarvacantes" element={<EditarVacantes />} />
          <Route path="/empresa/listadovacantes" element={<ListadoVacantes />} />
          <Route path="/perfil/empresa/PerfilEmpresa" element={<PerfilEmpresa/>} />
          <Route path="/perfil/empresa/editar" element={<EditarPerfilEmpresa />} />
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
        <Route path="/login" element={<Login/>} />
        <Route path="/empleos/:id" element={<InfoVacante />} />
        <Route path="/empleos" element={<ListadoVacantes/>} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
