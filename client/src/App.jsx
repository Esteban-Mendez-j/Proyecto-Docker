import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Login from './page/invitado/login';
import RegistroEmpresa from './page/invitado/RegistroEmpresa';
import Index from './page/invitado/Index';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro/empresa" element={<RegistroEmpresa />} />
      </Routes>
    </Router>
  )
}

export default App
