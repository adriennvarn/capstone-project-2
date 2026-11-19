import { useContext } from "react"
import { UserContext } from "./contexts/UserContext"
import { Navigate, Outlet } from "react-router-dom"

export default function ProtectedRoute({ allowedRoles }) {
    const { user, loading } = useContext(UserContext)

    // Automatically redirect any wrapped page that isn't included in public path
    //  if the user isn't logged in.

    if (loading) return <p>Loading...</p>

    const isLoggedIn = user && Object.keys(user).length > 0

    if (!isLoggedIn) {
        return <Navigate to="/" replace />
    }

    // If allowedRoles is passed, verify user's role is permitted
    //  Otherwise, return to homepage
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/home" replace />
    }

    return (
        <Outlet />
    )
}