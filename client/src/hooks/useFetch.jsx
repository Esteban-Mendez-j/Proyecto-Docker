import { useEffect, useState } from "react"
import { API_CLIENT_URL } from "../services/Api"

export default function useFetch(url, method) {

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const fullUrl = `${API_CLIENT_URL}${url}`

    useEffect(() => {
        setLoading(true)
        fetch(`${ fullUrl }`, {
            method: `${ method }`,
            credentials: "include"
        })
        .then(res => res.json())
        .then(data => setData(data))
        .catch(error => setError(error))
        .finally(() => setLoading(false))
    }, [fullUrl, method])

    return { data, error, loading };
}