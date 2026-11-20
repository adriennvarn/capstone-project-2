import { useState } from "react"
import * as format from "../../formats"
import TagForm from "./TagForm"
import { useFetchDataMutation } from "../../hooks/useFetchData"

export default function TagCard({ tag, reloadList }) {

    const [showForm, setShowForm] = useState(false)
    const { execute: sendData } = useFetchDataMutation(`/api/tags/${tag.id}`)

    const handleDelete = async () => {
        await sendData({
            method: "DELETE"
        })
        reloadList()
    }

    return (
        <div>
            <div className={format.cards.container}>
                <h1 className={format.cards.title}>#{tag.name}</h1>

                <div className={format.buttons.container}>
                    <button className={format.buttons.button}
                        onClick={() => setShowForm(true)}>
                        Update
                    </button>
                    <button className={format.buttons.button}
                        onClick={handleDelete}>
                        Delete
                    </button>
                </div>

                {showForm && (
                    <TagForm tag={tag} onTagCreated={() => {
                        reloadList()
                        setShowForm(false)
                    }} />
                )}
            </div>
        </div>
    )
}