import { useState } from "react"
import Login from "../components/Login"
import Signup from "../components/Signup.jsx"

export default function LoginPage() {
    const [newUser, setNewUser] = useState(null)

    return (
        <div>
            <p><span onClick={() => setNewUser(false)}>Login</span> or 
                <span onClick={() => setNewUser(true)}> Sign up</span>?</p>
            {newUser == null ? "" : (newUser ? <Signup /> : <Login />)}
        </div>
    )
}