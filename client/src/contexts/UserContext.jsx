import { createContext, useEffect, useState } from "react"
import { useFetchDataMutation } from "../hooks/useFetchData"

// Provide access to user anywhere in application

export const UserContext = createContext()

export function UserProvider({ children }) {

    const [user, setUser] = useState({})
    const { execute: loadUser, data, loading, error } = useFetchDataMutation("/api/me")

    useEffect(() => {
        loadUser()
            .then((userData) => {
                if (userData) setUser(userData)
            })
    }, [])

    return (
        <UserContext value={{ user, setUser }} >
            {children}
        </UserContext>
    )
}