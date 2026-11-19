import { useEffect, useState } from "react"
import ProjectCard from "./ProjectCard"
import ProjectForm from "./ProjectForm"
import * as format from "../../formats"
import { useFetchData, useFetchDataMutation } from "../../hooks/useFetchData"

export default function ProjectList() {

    const [showForm, setShowForm] = useState(false)
    const { data, loading, error, refetch } = useFetchData("/api/projects")

    const projects = data.items

    if (loading) return <format.LoadingSpinner />
    if (error) return <p>Error: {error}</p>

    return (
        <div>
            <p onClick={() => setShowForm(true)}>Add Project</p>
            {showForm && (
                <ProjectForm onProjectCreated={() => {
                    refetch()
                    setShowForm(false)
                }}/>
            )}

            <div className={format.cards.container}>
                {projects.map(project => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </div>
    )
}