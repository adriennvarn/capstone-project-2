import { useState } from "react"
import ProjectCard from "./ProjectCard"
import ProjectForm from "./ProjectForm"
import * as format from "../../formats"
import { useFetchData } from "../../hooks/useFetchData"

export default function ProjectList() {

    const [showForm, setShowForm] = useState(false)
    const { data, loading, error, refetch } = useFetchData("/api/projects")

    const projects = data.items

    if (loading) return <format.LoadingSpinner />
    if (error) return <p>Error: {error}</p>

    return (
        <div>
            <h1 className={format.pages.title}>Projects</h1>

            <div className={format.cards.group}>
                {projects.map(project => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>

            <p onClick={() => setShowForm(true)} className={format.buttons.button}>Add Project</p>
            {showForm && (
                <ProjectForm onProjectCreated={() => {
                    refetch()
                    setShowForm(false)
                }} />
            )}
        </div>
    )
}