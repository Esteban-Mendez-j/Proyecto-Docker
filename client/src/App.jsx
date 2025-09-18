import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Login from './page/invitado/login';
import RegistroEmpresa from './page/invitado/RegistroEmpresa';
import Index from './page/invitado/Index';
import RegistroCandidato from "./page/invitado/RegistroCandidato";
import Registro from "./page/invitado/Registro";
import InfoVacante from "./page/invitado/InfoVacante";
import Vacantes from "./page/empresa/Vacantes.jsx";
import EditarVacantes from "./page/empresa/editarVacantes.jsx";
import ListadoVacantes from "./page/empresa/listadoVacantes.jsx";
import PerfilEmpresa from "./page/perfil/empresa/PerfilEmpresa.jsx";
import EditarPerfilEmpresa from "./page/perfil/empresa/editar.jsx";








function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro/empresa" element={<RegistroEmpresa />} />
        <Route path="/registro/candidato" element={<RegistroCandidato />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/empleos/1" element={<InfoVacante />} />
        <Route path="/empresa/vacantes" element={<Vacantes />} />
        <Route path="/empresa/editarvacantes" element={<EditarVacantes />} />
        <Route path="/empresa/listadovacantes" element={<ListadoVacantes />} />
         <Route path="/perfil/empresa/PerfilEmpresa" element={<PerfilEmpresa/>} />
         <Route path="/perfil/empresa/editar" element={<EditarPerfilEmpresa />} />
         





        
      </Routes>
    </Router>
  )
}

export default App
