import { useEffect, useState } from "react";
import Layout from "../../layouts/Layout.jsx";
import PerfilEmpresa from "../../components/PerfilEmpresa.jsx";
import { useFetch } from "../../hooks/useFetch.jsx";

const PrivatePerfilEmpresa = () => {

  const [empresa, setEmpresa] = useState({});

  const { data } = useFetch("/api/empresas/perfil", "GET")

  useEffect(() => {
    if(data){
      setEmpresa(data.empresa)
    }
  }, [data]);

  return (
    <Layout >
      <PerfilEmpresa empresa={empresa} isPublic={false}/>
    </Layout>
  );
};

export default PrivatePerfilEmpresa;
