import {useState , useEffect} from "react"

export default function useValidation (initialData){

    const [dataFrom, setDataFrom] = useState(initialData);
    const [validarPassword, setValidarPassword] = useState(false);

    // valida el input de la contraseña
    useEffect(() => {
        if (
            /[a-z]/.test(dataFrom.contrasena) &&
            dataFrom.contrasena &&
            /[A-Z]/.test(dataFrom.contrasena) &&
            /[0-9]/.test(dataFrom.contrasena) &&
            dataFrom.contrasena.length >= 8 &&
            dataFrom.contrasena.length <= 15 &&
            dataFrom.contrasena === dataFrom.contraseñaVerificada
        ) {
            setValidarPassword(true);
            return;
        }

        setValidarPassword(false);
    }, [dataFrom.contrasena]);

    return {validarPassword, dataFrom, setDataFrom}
}