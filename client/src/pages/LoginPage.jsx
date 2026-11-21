import { useState } from "react"
import Login from "../components/Login"
import Signup from "../components/Signup.jsx"
import * as format from "../formats"

export default function LoginPage() {
    const [newUser, setNewUser] = useState(null)

    return (
        <div>
            <div className={format.buttons.container}>
                <button onClick={() => setNewUser(false)} className={format.buttons.button}>Login</button>
                <button onClick={() => setNewUser(true)} className={format.buttons.button}> Sign up</button>
            </div>
            {newUser == null ? "" : (newUser ? <Signup /> : <Login />)}
        </div>
    )
}