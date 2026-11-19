import { useParams } from "react-router-dom"
import { useFetchData, useFetchDataMutation } from "../hooks/useFetchData"
import { useEffect, useState } from "react"
import UserForm from "../components/Users/UserForm"
import * as format from "../formats"

export default function UserInfo() {

    const { id } = useParams()
    const [showUpdateForm, setShowUpdateForm] = useState(false)
    const { data: user, loading, error, refetch } = useFetchData(`/api/users/${id}`)

    const handleDelete = async () => {

    }

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>

    return (
        <div>
            <div className="align-center">
                <h1 className={format.title}>{user.name}</h1>
                <h2 className="capitalize">{user.role}</h2>
                <p className="italic">{user.email}</p>
            </div>

            <div className={format.buttons.container}>
                <button onClick={handleDelete} type="button" className={format.buttons.button}>Delete User</button>

                <button onClick={() => { setShowUpdateForm(true) }} type="button" className={format.buttons.button}>Update User</button>
                {showUpdateForm && (
                    <UserForm user={user} onUserCreated={() => {
                        refetch()
                        setShowUpdateForm(false)
                    }} />
                )}
            </div>
        </div>
    )
}