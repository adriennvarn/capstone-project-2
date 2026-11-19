import { useContext, useEffect } from "react"
import { UserContext } from "../contexts/UserContext"
import { Navigate } from "react-router-dom"

export default function Home() {
    const { user } = useContext(UserContext)

    // On page load, verify user is logged in
    if (!user || Object.keys(user).length === 0) {
        return <Navigate to="/" replace />
    }

    return (
        <div>
        </div>
    )
}