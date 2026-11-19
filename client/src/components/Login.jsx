import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useFetchDataMutation } from "../hooks/useFetchData"
import { UserContext } from "../contexts/UserContext"

export default function Login() {

    const { execute: sendData, data, loading, error } = useFetchDataMutation()
    const navigate = useNavigate()
    const { setUser } = useContext(UserContext)

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await sendData({
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            }, `/api/login`)
        }
        // TODO actually implement error handling
        catch {}
    }

    useEffect(() => {
        if (data && !error) {
            setUser(data)
            navigate("/home")
        }
    }, [data, error, navigate])

    return (
        <div>
            <form onSubmit={handleSubmit} className="mt-5">
                <input type="email" name="email" placeholder="Email Address" onChange={handleChange} />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} />
                <button type="submit">Login</button>
            </form>

            <div className={`${!loading ? "hidden" : ""}`}>
                <p>Loading...</p>
            </div>
        </div>
    )
}