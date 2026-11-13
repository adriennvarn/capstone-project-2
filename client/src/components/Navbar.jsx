import { NavLink } from "react-router-dom"
import { useFetchDataMutation } from "../hooks/useFetchData"

export default function Navbar() {
    const handleSignout = async () => {
        const { execute: logout } = useFetchDataMutation()

        try {
            const result = await logout({
                method: "POST",
            }, `/api/logout`)
        }
        // TODO actually implement error handling
        catch { }
    }

    return (
        <nav className="sticky mt-0 border-b border-gray-400 pb-2">
            <h1 className="text-xl">Navbar</h1>
            <ul className="flex gap-10 items-center justify-center">
                <li><NavLink to="/home">Home</NavLink></li>
                <li><NavLink to="/">Login</NavLink></li>
                <li><NavLink to="/" onClick={handleSignout}>Sign Out</NavLink></li>
                <li><NavLink to="/admin">Admin Dashboard</NavLink></li>
            </ul>
        </nav>
    )
}