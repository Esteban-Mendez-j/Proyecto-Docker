import { Navigate, Outlet } from "react-router-dom";
import NotFound from "../page/invitado/404"
import { RoleContext } from "../services/RoleContext";
import { useContext } from "react";


export default function RouteProtection ({redirectionTo = "/NotFound", accessRole}){

    const {rol , setRol} = useContext(RoleContext)

    if(!accessRole.includes(rol)){
        return <Navigate to={redirectionTo}/>
    }

    return(
        <Outlet/>
    );
}