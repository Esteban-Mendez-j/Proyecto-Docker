import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import Layout from "../../layouts/Layout";
import { API_CLIENT_URL} from "../../services/Api";
import { manejarRespuesta } from "../../services/ManejarRespuesta";
import PerfilEmpresa from "../../components/PerfilEmpresa";

export default function EmpresaPerfil() {
  const { id } = useParams();
  const [empresa, setEmpresa] = useState({});

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        const apiUrl = `${API_CLIENT_URL}/api/empresas/perfil?idUsuario=${id}`;
        const res = await fetch(apiUrl, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await manejarRespuesta(res);
        setEmpresa(data.empresa || {});
      } catch (error) {
        console.error("Error al cargar el perfil de la empresa:", error);
      }
    };

    fetchEmpresa();
  }, [id]);

  return (
    <Layout>
      <PerfilEmpresa empresa={empresa} isPublic={true}/>
    </Layout>
  );
}
