import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import './App.css';
import AdminIndex from "./page/admin/AdminIndex";
import AdminUsuarios from "./page/admin/AdminUsuarios";
import AdminVacantes from "./page/admin/AdminVacantes";
import Index from './page/invitado/Index';
import InfoVacante from "./page/invitado/InfoVacante";
import Login from './page/invitado/login';
import Registro from "./page/invitado/Registro";
import RegistroCandidato from "./page/invitado/RegistroCandidato";
import RegistroEmpresa from './page/invitado/RegistroEmpresa';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/registro/empresa" element={<RegistroEmpresa />} />
        <Route path="/registro/candidato" element={<RegistroCandidato />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/empleos/1" element={<InfoVacante />} />
        <Route path="/admin/index" element={<AdminIndex/>} /> 
        <Route path="/admin/vacantes" element={<AdminVacantes/>} />
         <Route path="/admin/usuarios" element={<AdminUsuarios/>} />
      </Routes>
    </Router>
  )
}

export default App
