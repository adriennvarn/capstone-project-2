import { useState } from "react"
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
            catch { }
        } else {
            try {
                await sendData({
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                }, `/api/projects`)

                setFormData(template)
                if (onProjectCreated) onProjectCreated()
            }
            // TODO actually implement error handling
            catch { }
        }
    }

    if (tagsLoading) return <format.LoadingSpinner />
    if (tagsError) return <p>Error: {tagsError}</p>
    if (error) return <p>Error: {error}</p>

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
        </div>
    )
}