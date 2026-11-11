import { useState, useEffect, useCallback } from "react"

function useFetchData(url, options = {}) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // get data automatically on useFetchData call
    const fetchData = useCallback(() => {
        setLoading(true)
        console.log("Fetching data from: ", url)

        fetch(url, options)
            .then(r => {
                if (r.ok) return r.json()
                else throw new Error("Failed fetching resource")
            })
            .then(posts => setData(posts))
            .catch(err => {
                console.error(err)
                setError(err.message)
            })
            .finally(() => setLoading(false))
    }, [url, options])

    // fetch data on component load
    useEffect(() => fetchData(), [fetchData])

    return { data, loading, error, refetch: fetchData }
}

// used to execute more specific functions that can be called from within functions in InventoryContext
function useFetchDataMutation(url) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // This is the trigger function you call inside event handlers
    const execute = async (options = {}, dynamicUrl = null) => {
        setLoading(true)
        setError(null)
        const targetUrl = dynamicUrl || url

        return fetch(targetUrl, options)
            .then(r => {
                if (!r.ok) throw new Error("fetch failed:", r.status)
                return r.status === 204 ? null : r.json()
            })
            .then(result => {
                setData(result)
                return result
            })
            .catch(err => {
                console.error(err)
                setError(err.message)
                throw err
            })
            .finally(() => setLoading(false))
    }

    return { execute, data, loading, error }
}

export { useFetchData, useFetchDataMutation }