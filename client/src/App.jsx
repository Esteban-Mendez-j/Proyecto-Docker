import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Login from "./page/invitado/Login";
import RegistroEmpresa from './page/invitado/RegistroEmpresa';
import Index from './page/invitado/Index';
import RegistroCandidato from "./page/invitado/RegistroCandidato";
import Registro from "./page/invitado/Registro";
import InfoVacante from "./page/invitado/InfoVacante";

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
      </Routes>
    </Router>
  )
}

export default App
