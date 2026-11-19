import { useState, useRef } from "react"
import { useFetchDataMutation } from "../../hooks/useFetchData"
import * as format from "../../formats"

const OPTIONS = ["user", "manager", "admin"]

export default function UserForm({ user, onUserCreated }) {

    const template = {
        name: user?.name || "",
        email: user?.email || "",
        password: null,
        role: user?.role || "",
    }

    const [formData, setFormData] = useState(template)
    const inputRef = useRef()
    const { execute: sendData, error } = useFetchDataMutation()

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (user) {
            try {
                await sendData({
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                }, `/api/users/${user.id}`)
                if (onUserCreated) onUserCreated()
            }
            catch { }
        } else {
            try {
                await sendData({
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                }, `/api/users`)
                if (onUserCreated) onUserCreated()
            }
            catch { }
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="mt-5">
                <label>
                    <input type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={format.input} />
                    Name
                </label>
                <label>
                    <input type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={format.input} />
                    Email
                </label>

                <fieldset>
                    <legend>Role:</legend>

                    {OPTIONS.map((role) => (
                        <label key={role}>
                            <input type="radio"
                                name="role"
                                value={role}
                                checked={formData.role === role}
                                onChange={handleChange} />
                            <span className="capitalize">{role}</span>
                        </label>
                    ))}
                </fieldset>

                <button type="submit">Submit</button>
            </form>
        </div>
    )
} 