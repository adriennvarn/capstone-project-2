import * as format from "../../formats"
import { useFetchData } from "../../hooks/useFetchData"
import UserCard from "./UserCard"

export default function UserList() {

    const { data: users, loading, error, refetch } = useFetchData("/api/users")

    if (loading) return <format.LoadingSpinner />
    if (error) return <format.ErrorMessage error={error} />

    return (
        <div className={format.cards.container}>
            {users?.map(user => (
                <UserCard key={user.id} user={user} />
            ))}
        </div>
    )
}