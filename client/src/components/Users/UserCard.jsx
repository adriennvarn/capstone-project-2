import { useNavigate } from "react-router-dom"
import * as format from "../../formats"

export default function UserCard({ user }) {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(`/users/${user.id}`)
    }

    return (
        <div onClick={handleClick} className="border border-sm">
            <h1 className={format.cards.title}>{user.name}</h1>
        </div>
    )
}