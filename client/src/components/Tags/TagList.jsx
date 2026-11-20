import { useState } from "react"
import * as format from "../../formats"
import { useFetchData } from "../../hooks/useFetchData"
import TagCard from "./TagCard"
import TagForm from "./TagForm"

export default function TagList() {

    const [showForm, setShowForm] = useState(false)
    const { data: tags, loading, error, refetch } = useFetchData("/api/tags")

    if (loading) return <format.LoadingSpinner />
    if (error) return <format.ErrorMessage error={error} />

    return (
        <div>
            <h1 className={format.pages.subtitle}>Tags</h1>

            <button type="button" onClick={() => setShowForm(true)}>
                Add Tag
            </button>
            {showForm && (
                <TagForm onTagCreated={() => {
                    refetch()
                    setShowForm(false)
                }} />
            )}


            <div className={format.cards.group}>
                {tags?.map(tag => (
                    <TagCard key={tag.id} tag={tag} reloadList={refetch} />
                ))}
            </div>
        </div>
    )
}