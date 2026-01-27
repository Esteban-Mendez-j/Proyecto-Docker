import { useContext, useEffect, useState } from "react";
import Loading from "../../components/Loading.jsx";
import { useFetchV2 } from "../../hooks/useFetch.jsx";
import Layout from "../../layouts/Layout.jsx";
import { useNavigate, useParams } from "react-router-dom";
import PerfilCandidato from "../../components/PerfilCandidato.jsx";
import exceptionControl from "../../services/exceptionControl.js";
import { RoleContext } from "../../services/RoleContext.jsx";

function PerfilCandidatoPublic() {
  const initialData = {
    nombre: "",
    apellido: "",
    correo: "",
    contrasena: "",
    telefono: "",
    identificacion: "",
    contraseñaVerificada: ""
  }
  const {id} = useParams();
  const { logout } = useContext(RoleContext);
  const navigate = useNavigate();
  const { data , error , loading } = useFetchV2(`/api/candidatos/perfil?idUsuario=${id}`, "GET");

  useEffect(()=>{
    exceptionControl(error, logout ,navigate, "Error  al cargar el perfil");
  },[ error ])

  if (!data || loading) {
    return <Loading/>;
  }

  return (
    <Layout>
      <PerfilCandidato
        candidato={data.candidato}
        estudios={data.estudios}
        historialLaboral={data.historialLaboral}
        isPublic={true}
      />
    </Layout>
  );
}

export default PerfilCandidatoPublic;
