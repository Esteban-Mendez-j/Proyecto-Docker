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

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/registro/empresa" element={<RegistroEmpresa />} />
        <Route path="/registro/candidato" element={<RegistroCandidato />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/empleos/:id" element={<InfoVacante />} />
        <Route path="/admin/index" element={<AdminIndex/>} /> 
        <Route path="/admin/vacantes" element={<AdminVacantes/>} />
        <Route path="/admin/usuarios" element={<AdminUsuarios/>} />
        <Route path="/empleos" element={<ListadoVacantes/>} />
        <Route path="/perfil/candidato" element={<PerfilCandidato/>} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
