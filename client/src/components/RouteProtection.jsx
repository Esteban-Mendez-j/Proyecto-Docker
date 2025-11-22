import { Navigate, Outlet } from "react-router-dom";
import { RoleContext } from "../services/RoleContext";
import { useContext } from "react";
import Loading from "./Loading";


export default function RouteProtection ({redirectionTo = "/", accessRole}){

    const {rol, loading} = useContext(RoleContext)
    if(!rol || loading){return <Loading/>}

    if(!accessRole.includes(rol)){

        if(["ADMIN","SUPER_ADMIN"].includes(rol)){ redirectionTo = "/admin/index"}

        return <Navigate to={redirectionTo}/>
    }

    return(
        <Outlet/>
    );
}