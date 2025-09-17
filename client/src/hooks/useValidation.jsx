import { useState, useEffect } from "react"

export default function useValidation(initialData) {

    const [dataFrom, setDataFrom] = useState(initialData);
    const [validarPassword, setValidarPassword] = useState(false);

    useEffect(() => {
        if (
            dataFrom.contrasena && 
            /[a-z]/.test(dataFrom.contrasena) &&
            /[A-Z]/.test(dataFrom.contrasena) &&
            /[0-9]/.test(dataFrom.contrasena) &&
            dataFrom.contrasena.length >= 8 &&
            dataFrom.contrasena.length <= 15 &&
            dataFrom.contrasena === dataFrom.contraseñaVerificada
        ){
            setValidarPassword(true);
        }else{
            setValidarPassword(false);
        }

    }, [dataFrom.contrasena, dataFrom.contraseñaVerificada]);

    return { validarPassword, dataFrom, setDataFrom }
}