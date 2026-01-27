import { useContext, useEffect, useState } from "react"
import { API_CLIENT_URL } from "../services/Api"
import { manejarRespuesta } from "../services/ManejarRespuesta";

export function useFetchV2(url, method, body, headers= {"Content-Type" : `application/json`}) {

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const fullUrl = `${API_CLIENT_URL}${url}`

    async function peticion() {
        setLoading(true)
        try {
            const res = await fetch(fullUrl, {
                method,
                headers,
                body: body ? JSON.stringify(body) : null,
                credentials: "include"
            })

            const json = await res.json();
            if(!res.ok){ throw json.error}

            setData(json.data)
        } catch (error) {
            setError(error)
        }finally{
            setLoading(false)
        }
    }
    
    useEffect(() => {
        peticion()
    }, [fullUrl])
    return { data, error, loading }
}


export function useFetch(url, method, body, headers= {"Content-Type" : `application/json`}) {

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const fullUrl = `${API_CLIENT_URL}${url}`

    async function peticion() {
        setLoading(true)
        try {
            const res = await fetch(fullUrl, {
                method,
                headers,
                body: body ? JSON.stringify(body) : null,
                credentials: "include"
            })

            const json = await manejarRespuesta( res );
            setData(json)
        } catch (error) {
            setError(error.message)
        }finally{
            setLoading(false)
        }
    }
    
    useEffect(() => {
        peticion()
    }, [fullUrl])
    return { data, error, loading }
}


export function useSendForm() {

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)

    async function send(url, method, body, headers = { "Content-Type": "application/json" }) {
        const fullUrl = `${API_CLIENT_URL}${url}`;
        setLoading(true);
        try {
            const res = await fetch(fullUrl, {
                method,
                headers: headers ? headers : {},
                body: body ? body :  undefined,
                credentials: "include"
            });

            const json = await res.json();
            if (res.ok) {
                setData(json); 
                setError(null); 
            } else {
                setError(json.errors || "Error desconocido");
                setData(null);
            }
            
            return json;
        } catch (err) {
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    }

    return {send, data, error, setError, loading}
}

export function useSendFormV2() {

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null)
    const [meta, setMeta] = useState(null)
    const [error, setError] = useState(null)

    async function send(url, method, body, headers = { "Content-Type": "application/json" }) {
        const fullUrl = `${API_CLIENT_URL}${url}`;
        setLoading(true);
        try {
            const res = await fetch(fullUrl, {
                method,
                headers: headers ? headers : {},
                body: body ? body :  undefined,
                credentials: "include"
            });

            if(res.status == 204){ 
                setData(null);
                return; 
            }

            const text = await res.text();
            const json = text ? JSON.parse(text) : null;

            if (!res.ok) {
                throw json.error
            } 
            
            setData(json.data)
            setMeta(json?.meta)
            return json;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    return {send, data, error, setError, loading, meta}
}