import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useFetchDataMutation } from "../hooks/useFetchData"
import { UserContext } from "../contexts/UserContext"
import * as format from "../formats"

export default function Signup() {

    const { execute: sendData, data, loading, error } = useFetchDataMutation()
    const navigate = useNavigate()
    const { setUser } = useContext(UserContext)

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "user",
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleRadio = (e) => {
        const { name } = e.target
        setFormData((prevData) => ({
            ...prevData,
            role: name
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await sendData({
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            }, `/api/signup`)
        }
        // TODO actually implement error handling
        catch { }
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
                <input type="text" name="name" placeholder="Name" onChange={handleChange} />
                <input type="email" name="email" placeholder="Email Address" onChange={handleChange} />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} />
                <div id="role">
                    <label>
                        <input type="radio" name="user" onChange={handleRadio} checked={formData.role == "user"} />
                        User</label>
                    <label>
                        <input type="radio" name="manager" onChange={handleRadio} checked={formData.role == "manager"} />
                        Manager</label>
                    <label>
                        <input type="radio" name="admin" onChange={handleRadio} checked={formData.role == "admin"} />
                        Admin</label>
                </div>
                <button type="submit">Sign Up</button>
            </form>

            <div className={`${!loading ? "hidden" : ""}`}>
                <format.LoadingSpinner />
            </div>
        </div>
    )
}