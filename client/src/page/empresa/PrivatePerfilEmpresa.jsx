import { useEffect, useState } from "react";
import Layout from "../../layouts/Layout.jsx";
import PerfilEmpresa from "../../components/PerfilEmpresa.jsx";
import { useFetchV2 } from "../../hooks/useFetch.jsx";

const PrivatePerfilEmpresa = () => {

  const [empresa, setEmpresa] = useState({});

  const { data } = useFetchV2("/api/empresas/perfil", "GET")

  useEffect(() => {
    if(data){
      setEmpresa(data)
    }
  }, [data]);

  return (
    <Layout >
      <PerfilEmpresa empresa={empresa} isPublic={false}/>
    </Layout>
  );
};

export default PrivatePerfilEmpresa;
