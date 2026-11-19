import { useEffect, useState } from "react"
import ProjectCard from "../components/ProjectCard"
import ProjectForm from "./ProjectForm"
import { useFetchData, useFetchDataMutation } from "../hooks/useFetchData"

export default function ProjectList() {

    const [showForm, setShowForm] = useState(false)
    const { data, loading, error, refetch } = useFetchData("/api/projects")

    const projects = data.items

    if (loading) return <p>Loading...</p>
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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-4">
                {projects.map(project => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </div>
    )
}