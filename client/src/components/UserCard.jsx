import { useNavigate } from "react-router-dom"

export default function UserCard({ user }) {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(`/users/${user.id}`)
    }

    return (
        <div onClick={handleClick} className="border border-sm">
            <h1>{user.name}</h1>
        </div>
    )
}