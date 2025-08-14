import { API_CLIENT_URL } from './Api.js';
import { useState, useEffect } from 'react';

export function autenticacion(username, password){
    const [loading , setLoading] = useState(false)
    const [data , setData] = useState(null)
    const [error , setError] = useState(null)

    useEffect (() =>{
        if(!username || !password){return}
        setLoading(true)
        fetch(`${API_CLIENT_URL}/api/usuarios/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                username: username,
                password: password,
            }),
            credentials: "include"
        })
        .then(res => res.json())
        .then(data => {setData(data);})
        .catch(error => setError(error))
        .finally(() => setLoading(false))

    }, [username, password])

    return {data, loading, error};
}
    