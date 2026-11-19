import { useParams } from "react-router-dom"
import { useFetchDataMutation } from "../hooks/useFetchData"
import { useEffect, useState } from "react"

export default function UserInfo() {

    const { id } = useParams()
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(true)
    const { execute: loadData, error } = useFetchDataMutation(`/api/users/${id}`)

    useEffect(() => {
        loadData()
            .then((data) => {
                if (data) setUser(data)
            })
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>


    return (
        <div className="align-center">
            <h1 className="text-xl">{user.name}</h1>
            <h2 className="">{user.role}</h2>
            <p className="italic">{user.email}</p>
        </div>
    )
}