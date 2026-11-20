import { useState } from "react"
import * as format from "../../formats"
import { useFetchData } from "../../hooks/useFetchData"
import UserCard from "./UserCard"
import UserForm from "./UserForm"

export default function UserList() {

    const { data: users, loading, error, refetch } = useFetchData("/api/users")
    const [showForm, setShowForm] = useState(false)

    if (loading) return <format.LoadingSpinner />
    if (error) return <format.ErrorMessage error={error} />

    return (
        <div>
            <button type="button" className={format.buttons.button} onClick={() => { setShowForm(true) }}>
                Add User
            </button>
            {showForm && (
                <UserForm onUserCreated={() => {
                    refetch()
                    setShowForm(false)
                }} />
            )}


            <div className={format.cards.group}>
                {users?.map(user => (
                    <UserCard key={user.id} user={user} />
                ))}
            </div>
        </div>
    )
}