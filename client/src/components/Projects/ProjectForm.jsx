import { useState, useRef } from "react"
import { useFetchData, useFetchDataMutation } from "../../hooks/useFetchData"
import TagForm from "../Tags/TagForm"
import * as format from "../../formats"

export default function ProjectForm({ project, onProjectCreated }) {

    const template = {
        name: project?.name || "",
        description: project?.description || "",
        due_date: project?.due_date ? project.due_date.split("T")[0] : "",
        tag_ids: project?.tags?.map(tag => tag.id) || []
    }

    const [formData, setFormData] = useState(template)
    const [showTagForm, setShowTagForm] = useState(false)
    const inputRef = useRef()
    const { execute: sendData, error } = useFetchDataMutation()
    const { data: tags, loading: tagsLoading, error: tagsError, refetch: refetchTags } = useFetchData("/api/tags")

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
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
        if (project) {
            try {
                await sendData({
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                }, `/api/projects/${project.id}`)
                if (onProjectCreated) onProjectCreated()
            }
            catch {}
        } else {
            try {
                await sendData({
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                }, `/api/projects`)

                setFormData(blankForm)
                if (onProjectCreated) onProjectCreated()
            }
            // TODO actually implement error handling
            catch { }
        }
    }

    if (tagsLoading) return <format.LoadingSpinner />
    if (tagsError) return <p>Error: {tagsError}</p>

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className={format.forms.input} />
                    Project Name
                </label>
                <label>
                    <input type="text" name="description" value={formData.description} onChange={handleChange} className={format.forms.input} />
                    Description
                </label>
                <label>
                    <input type="date" name="due_date" value={formData.due_date} onChange={handleChange} className={format.forms.input} />
                    Due Date
                </label>

                <fieldset>
                    <legend>Select Tags:</legend>
                    {tags.map((tag) => (
                        <label key={tag.id}>
                            <input type="checkbox"
                                value={tag.id}
                                checked={formData.tag_ids.includes(tag.id)}
                                onChange={handleTagsChange}
                                className={format.forms.checkbox}
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