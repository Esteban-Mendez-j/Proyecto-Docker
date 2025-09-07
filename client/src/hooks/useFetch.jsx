import { useEffect, useState } from "react"
import { API_CLIENT_URL } from "../services/Api"

export function useFetch(url, method, body, headers= {"Content-Type" : `application/json`}) {

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const fullUrl = `${API_CLIENT_URL}${url}`
   
    useEffect(() => {
        setLoading(true)
        fetch(fullUrl, {
            method,
            headers,
            body: body ? JSON.stringify(body) : null,
            credentials: "include"
        })
        .then(res => {
            if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
            return res.json()
        })
        .then(json => setData(json))
        .catch(err => setError(err.message))
        .finally(() => setLoading(false))
        
    }, [fullUrl, method])

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
                headers,
                body: body ? JSON.stringify(body) :  undefined,
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