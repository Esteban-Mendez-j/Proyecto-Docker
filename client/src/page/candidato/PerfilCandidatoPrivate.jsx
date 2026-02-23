import { useContext, useEffect, useState } from "react";
import Loading from "../../components/Loading.jsx";
import { useFetchV2 } from "../../hooks/useFetch.jsx";
import Layout from "../../layouts/Layout.jsx";
import PerfilCandidato from "../../components/PerfilCandidato.jsx";
import exceptionControl from "../../services/exceptionControl.js";
import { useNavigate } from "react-router-dom";
import { RoleContext } from "../../services/RoleContext.jsx";


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
  const { logout } = useContext(RoleContext);
  const navigate = useNavigate();
  const { data, error, loading } = useFetchV2("/api/candidatos/perfil", "GET");

  useEffect(() => {
    exceptionControl(error, logout, navigate, "Error  al cargar el perfil");
  }, [error])

  if (!data || loading || error) {
    return <Loading />;
  }

  return (
    <Layout>
      <PerfilCandidato
        candidato={data.candidato}
        estudios={data.estudios}
        historialLaboral={data.historialLaboral}
        isPublic={false}
      />
    </Layout>
  );
}

export default PerfilCandidatoPrivate;
