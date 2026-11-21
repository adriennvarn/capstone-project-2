import { useState, useRef } from "react"
import { useFetchData, useFetchDataMutation } from "../../hooks/useFetchData"
import TagForm from "../Tags/TagForm"
import * as format from "../../formats"

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

    if (tagsLoading || usersLoading) return <format.LoadingSpinner />
    if (tagsError || usersError || error) {
        return (
            <div>
                <p>Error: {tagsError ? tagsError : (usersError ? usersError : error)}</p>
            </div>
        )
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className={format.forms.containerVertical}>
                <div className="flex flex-col gap-y-3">
                    <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className={format.forms.input} />
                    <input type="text" name="description"
                        placeholder="Description" value={formData.description} onChange={handleChange} className={format.forms.input} />
                    <div>
                        <label className={format.forms.label}>Due Date</label>
                        <input type="date" name="due_date" value={formData.due_date} onChange={handleChange} className={format.forms.input} />
                    </div>
                </div>
                <fieldset>
                    <legend className={format.forms.checkboxLegend}>Assign Users:</legend>
                    {users.map((user) => (
                        <div key={user.id} className={format.forms.checkboxItem}>
                            <input id={`user-${user.id}`}
                                type="checkbox"
                                value={user.id}
                                checked={formData.user_ids.includes(user.id)}
                                onChange={handleUsersChange}
                                className={format.forms.checkboxInput}
                            />
                            <label htmlFor={`user-${user.id}`} className={format.forms.checkboxLabel} >
                                {user.name}
                            </label>
                        </div>
                    ))}
                </fieldset>
                <fieldset>
                    <legend className={format.forms.checkboxLegend}>Select Tags:</legend>
                    {tags.map((tag) => (
                        <div key={tag.id} className={format.forms.checkboxItem}>
                            <input id={`tag-${tag.id}`}
                                type="checkbox"
                                value={tag.id}
                                checked={formData.tag_ids.includes(tag.id)}
                                onChange={handleTagsChange}
                                className={format.forms.checkboxInput}
                            />
                            <label htmlFor={`tag-${tag.id}`} className={format.forms.checkboxLabel}>{tag.name}</label>
                        </div>
                    ))}
                </fieldset>

                <div>
                    <button type="button" onClick={() => setShowTagForm(true)} className={format.buttons.buttonSmall}>New Tag</button>
                    {showTagForm && (
                        <TagForm
                            onTagCreated={() => {
                                refetchTags()
                                setShowTagForm(false)
                            }}
                        />
                    )}
                </div>
                <button type="submit" className={format.buttons.button}>Submit</button>
            </form>
        </div >
    )
}