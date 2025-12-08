import { useEffect, useState } from "react";
import Loading from "../../components/Loading.jsx";
import { useFetch } from "../../hooks/useFetch.jsx";
import Layout from "../../layouts/Layout.jsx";
import PerfilCandidato from "../../components/PerfilCandidato.jsx";


function PerfilCandidatoPrivate() {
  const initialData = {
    nombre: "",
    apellido: "",
    correo: "",
    contrasena: "",
    telefono: "",
    identificacion: "",
    contraseñaVerificada: "",
    nivelEducativo: "",

  }
  const [candidato, setCandidato] = useState(null);
  const [estudios, setEstudios] = useState([]);
  const [historialLaboral, setHistorialLaboral] = useState([]);
  const { data, error, loading } = useFetch("/api/candidatos/perfil", "GET");

  useEffect(() => {

    if (!data) { return }
    setCandidato(data.candidato);
    setEstudios(data.estudios || []);
    setHistorialLaboral(data.historialLaboral || []);

  }, [data, error]);
  
  if (!data || !candidato || !estudios || !historialLaboral || loading || error) {
    return <Loading />;
  }

  return (
    <Layout>
      <PerfilCandidato
        candidato={candidato}
        estudios={estudios}
        historialLaboral={historialLaboral}
        isPublic={false}
      />
    </Layout>
  );
}

export default PerfilCandidatoPrivate;
