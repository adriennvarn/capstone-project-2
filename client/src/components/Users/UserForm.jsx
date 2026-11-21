import { useState, useRef } from "react"
import { useFetchDataMutation } from "../../hooks/useFetchData"
import * as format from "../../formats"

const OPTIONS = ["user", "manager", "admin"]

export default function UserForm({ user, onUserCreated }) {

    const template = {
        name: user?.name || "",
        email: user?.email || "",
        password: "",
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
                    <legend className={format.forms.radioLegend}>Role:</legend>

                    <div className={format.forms.radioContainer}>
                        {OPTIONS.map((role) => (
                            <div key={role} className={format.forms.radioItem}>
                                <input type="radio"
                                    name="role"
                                    value={role}
                                    checked={formData.role === role}
                                    onChange={handleChange}
                                    className={format.forms.radioInput} />
                                <label className={`capitalize ${format.forms.radioLabel}`}>{role}</label>
                            </div>
                        ))}
                    </div>
                </fieldset>


                <button type="submit" className={`w-fit mx-auto ${format.buttons.button}`}>Submit</button>
            </form>
        </div>
    )
} 