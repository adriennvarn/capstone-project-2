import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useFetchDataMutation } from "../hooks/useFetchData"
import { UserContext } from "../contexts/UserContext"
import * as format from "../formats"

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
        catch { }
    }

    useEffect(() => {
        if (data && !error) {
            setUser(data)
            navigate("/home")
        }
    }, [data, error, navigate, setUser])

    if (error) return <p>Error: {error}</p>

    return (
        <div>
            <form onSubmit={handleSubmit} className={format.forms.containerVertical}>
                <div className="flex flex-col gap-y-3">
                    <label>
                        <input type="email" name="email" placeholder="Email Address" autoComplete="email"
                            onChange={handleChange} className={format.forms.input} />
                    </label>
                    <label>
                        <input type="password" name="password" placeholder="Password" autoComplete="current-password"
                            onChange={handleChange} className={format.forms.input} />
                    </label>
                    <button type="submit" className={`w-fit mx-auto ${format.buttons.button}`}>Login</button>
                </div>
            </form>

            <div className={`${!loading ? "hidden" : ""}`}>
                <format.LoadingSpinner />
            </div>
        </div>
    )
}