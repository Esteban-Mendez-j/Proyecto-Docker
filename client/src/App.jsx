import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Login from "./page/invitado/Login";
import RegistroEmpresa from './page/invitado/RegistroEmpresa';
import Index from './page/invitado/Index';
import RegistroCandidato from "./page/invitado/RegistroCandidato";
import Registro from "./page/invitado/Registro";
import InfoVacante from "./page/invitado/InfoVacante";
import NotFound from "./page/invitado/404";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro/empresa" element={<RegistroEmpresa />} />
        <Route path="/registro/candidato" element={<RegistroCandidato />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/empleos/:id" element={<InfoVacante />} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
