import { useState, useRef, useEffect } from "react"
import { useFetchData, useFetchDataMutation } from "../hooks/useFetchData"

export default function TaskForm({ project }) {

    const blankForm = {
        project_id: project.id,
        name: "",
        description: "",
        due_date: "",
        tag_ids: [],
        user_ids: [],
    }

    const [formData, setFormData] = useState(blankForm)
    const inputRef = useRef()
    const [loading, setLoading] = useState(true)
    const { execute: sendData, error } = useFetchDataMutation()
    const { data: tags, loading: tagsLoading, error: tagsError } = useFetchData("/api/tags")
    const { data: users, loading: usersLoading, error: usersError } = useFetchData("/api/users")

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target

        if (checked) {
            setFormData((prevData) => ({
                ...prevData,
                user_ids: prevData.user_ids.push(value.id)
            }))
        } else {
            setFormData((prevData) => ({
                ...prevData,
                user_ids: prevData.user_ids.filter(id => id !== value.id)
            }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await sendData({
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            }, `/api/tasks`)
        }
        // TODO actually implement error handling
        catch { }
    }

    if (tagsLoading || usersLoading) return <p>Loading...</p>
    if (tagsError || usersError) {
        console.error(tags)
        console.error(users)
        return (
            <div>
                <p>Error: {tagsError || usersError}</p>
            </div>
        )
    }

    const inputFormatting = ""
    const checkboxFormatting = ""

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputFormatting} />
                    Task Name
                </label>
                <label>
                    <input type="text" name="description" value={formData.description} onChange={handleChange} className={inputFormatting} />
                    Description
                </label>
                <label>
                    <input type="date" name="due_date" value={formData.due_date} onChange={handleChange} className={inputFormatting} />
                    Due Date
                </label>
                <fieldset className="align-center">
                    <legend className="align-center">Assign Users:</legend>
                    {users.map((user) => (
                        <label key={user.id}>
                            <input type="checkbox" 
                            value={user} 
                            checked={formData.user_ids.includes(user)}
                            onChange={handleCheckboxChange}
                            />
                            {user.name}
                        </label>
                    ))}
                </fieldset>
            </form>
        </div>
    )
}