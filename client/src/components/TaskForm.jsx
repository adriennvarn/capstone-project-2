import { useState, useRef, useEffect } from "react"
import { useFetchData, useFetchDataMutation } from "../hooks/useFetchData"
import TagForm from "./TagForm"
import { inputFormatting, checkboxFormatting } from "../formats"

export default function TaskForm({ project, task, onTaskCreated }) {

    const template = {
        project_id: project?.id || task.project_id,
        name: task?.name || "",
        description: task?.description || "",
        due_date: task?.due_date ? task.due_date.split("T")[0] : "",
        tag_ids: task?.tags?.map((tag) => tag.id) || [],
        user_ids: task?.users?.map((user) => user.id) || [],
    }

    const [formData, setFormData] = useState(template)
    const [showTagForm, setShowTagForm] = useState(false)
    const inputRef = useRef()
    const { execute: sendData, error } = useFetchDataMutation()
    const { data: tags, loading: tagsLoading, error: tagsError, refetch: refetchTags } = useFetchData("/api/tags")
    const { data: users, loading: usersLoading, error: usersError } = useFetchData("/api/users")

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleUsersChange = (e) => {
        const { value, checked } = e.target
        const userId = Number(value)

        if (checked) {
            setFormData((prevData) => ({
                ...prevData,
                user_ids: [...prevData.user_ids, userId]
            }))
        } else {
            setFormData((prevData) => ({
                ...prevData,
                user_ids: prevData.user_ids.filter(id => id !== userId)
            }))
        }
    }

    const handleTagsChange = (e) => {
        const { value, checked } = e.target
        const tagId = Number(value)

        if (checked) {
            setFormData((prevData) => ({
                ...prevData,
                tag_ids: [...prevData.tag_ids, tagId]
            }))
        } else {
            setFormData((prevData) => ({
                ...prevData,
                tag_ids: prevData.tag_ids.filter(id => id !== tagId)
            }))
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault()
        if (task) {
            try {
                await sendData({
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                }, `/api/tasks/${task.id}`)
                if (onTaskCreated) onTaskCreated()
            }
            catch { }
        } else {
            try {
                await sendData({
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                }, `/api/tasks`)
                if (onTaskCreated) onTaskCreated()
            }
            // TODO actually implement error handling
            catch { }
        }
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
                                value={user.id}
                                checked={formData.user_ids.includes(user.id)}
                                onChange={handleUsersChange}
                                className={checkboxFormatting}
                            />
                            {user.name}
                        </label>
                    ))}
                </fieldset>
                <fieldset>
                    <legend>Select Tags:</legend>
                    {tags.map((tag) => (
                        <label key={tag.id}>
                            <input type="checkbox"
                                value={tag.id}
                                checked={formData.tag_ids.includes(tag.id)}
                                onChange={handleTagsChange}
                                className={checkboxFormatting}
                            />
                            {tag.name}
                        </label>
                    ))}
                </fieldset>
                <div>
                    <p onClick={() => setShowTagForm(true)}>Add Tag</p>
                    {showTagForm && (
                        <TagForm
                            onTagCreated={() => {
                                refetchTags()
                                setShowTagForm(false)
                            }}
                        />
                    )}
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}