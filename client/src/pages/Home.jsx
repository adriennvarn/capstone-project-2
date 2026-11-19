import { useContext } from "react"
import { UserContext } from "../contexts/UserContext"

export default function Home() {
    const { user } = useContext(UserContext)

    return (
        <div>
            <p>User: {user.name}</p>
        </div>
    )
}