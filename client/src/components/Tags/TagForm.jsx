import { useState } from "react"
import { useFetchDataMutation } from "../../hooks/useFetchData"
import * as format from "../../formats"

export default function TagForm({ onTagCreated }) {

    const [name, setName] = useState("")
    const { execute: sendData, error } = useFetchDataMutation("/api/tags")

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name.trim()) return

        try {
            await sendData({
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ "name": name })
            })

            setName("")
            if (onTagCreated) onTagCreated()
        }
        catch { }
    }

    if (error) return <p>Error: {error}</p>

    return (
        <div>
            <label>
                <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)}
                    className={format.forms.input} />
                New Tag
            </label>
            <button type="button" onClick={handleSubmit}>Add Tag</button>
        </div>
    )
}