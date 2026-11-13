import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useFetchDataMutation } from "../hooks/useFetchData"

export default function Login() {

    const { execute: sendData, data, loading, error } = useFetchDataMutation()
    const navigate = useNavigate()

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
            const result = await sendData({
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
            navigate("/home")
        }
    }, [data, error])

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