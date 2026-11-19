import { useState, useRef } from "react"
import { useFetchData, useFetchDataMutation } from "../hooks/useFetchData"
import TagForm from "./TagForm"
import { inputFormatting, checkboxFormatting } from "../formats"

export default function ProjectForm({ onProjectCreated }) {

    const blankForm = {
        name: "",
        description: "",
        due_date: "",
        tag_ids: []
    }

    const [formData, setFormData] = useState(blankForm)
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

    if (tagsLoading) return <p>Loading...</p>
    if (tagsError) return <p>Error: {tagsError}</p>

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputFormatting} />
                    Project Name
                </label>
                <label>
                    <input type="text" name="description" value={formData.description} onChange={handleChange} className={inputFormatting} />
                    Description
                </label>
                <label>
                    <input type="date" name="due_date" value={formData.due_date} onChange={handleChange} className={inputFormatting} />
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