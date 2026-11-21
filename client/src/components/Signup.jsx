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
    }, [data, error, navigate, setUser])

    if (error) return <p>Error: {error}</p>

    return (
        <div>
            <form onSubmit={handleSubmit} className={format.forms.containerVertical}>
                <div className="flex flex-col gap-y-3">
                    <label>
                        <input type="text" name="name" placeholder="Name" autoComplete="name"
                            onChange={handleChange} className={format.forms.input} />
                    </label>
                    <label>
                        <input type="email" name="email" placeholder="Email Address" autoComplete="email"
                            onChange={handleChange} className={format.forms.input} />
                    </label>

                    <label>
                        <input type="password" name="password" placeholder="Password" autoComplete="new-password"
                            onChange={handleChange} className={format.forms.input} />
                    </label>
                </div>

                <fieldset className="mx-auto mt-1 mb-2">
                    <legend className={format.forms.radioLegend}>Select Role</legend>
                    <div className={format.forms.radioContainer}>
                        <div className={format.forms.radioItem}>
                            <input type="radio" name="user" onChange={handleRadio} checked={formData.role == "user"}
                                className={format.forms.radioInput} />
                            <label className={format.forms.radioLabel}>User</label>
                        </div>
                        <div className={format.forms.radioItem}>
                            <input type="radio" name="manager" onChange={handleRadio} checked={formData.role == "manager"}
                                className={format.forms.radioInput} />
                            <label className={format.forms.radioLabel}>Manager</label>
                        </div>
                        <div className={format.forms.radioItem}>
                            <input type="radio" name="admin" onChange={handleRadio} checked={formData.role == "admin"}
                                className={format.forms.radioInput} />
                            <label className={format.forms.radioLabel}>Admin</label>
                        </div>
                    </div>
                </fieldset>
                <button type="submit" className={`w-fit mx-auto ${format.buttons.button}`}>Sign Up</button>
            </form>

            <div className={`${!loading ? "hidden" : ""}`}>
                <format.LoadingSpinner />
            </div>
        </div>
    )
}