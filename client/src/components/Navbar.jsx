import { Link } from "react-router-dom"

export default function Navbar() {
    const handleSignout = () => {

    }

    return (
        <nav className="sticky mt-0 border-b border-gray-400 pb-2">
            <h1 className="text-xl">Navbar</h1>
            <ul className="flex gap-10 items-center justify-center">
                <li><Link to="/home">Home</Link></li>
                <li><Link to="/">Login</Link></li>
                <li><Link to="/" onClick={handleSignout}>Sign Out</Link></li>
                <li><Link to="/admin">Admin Dashboard</Link></li>
            </ul>
        </nav>
    )
}