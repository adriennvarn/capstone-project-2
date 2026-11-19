import { createContext, useEffect, useState } from "react"
import { useFetchDataMutation } from "../hooks/useFetchData"

// Provide access to user anywhere in application

export const UserContext = createContext()

export function UserProvider({ children }) {

    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(true)
    const { execute: loadUser } = useFetchDataMutation("/api/me")

    useEffect(() => {
        loadUser()
            .then((userData) => {
                if (userData) setUser(userData)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    return (
        <UserContext value={{ user, setUser, loading }} >
            {children}
        </UserContext>
    )
}