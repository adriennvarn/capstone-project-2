import { useEffect, useState } from "react"
import ProjectCard from "../components/ProjectCard"
import { useFetchDataMutation } from "../hooks/useFetchData"

export default function ProjectList() {

    const [projects, setProjects] = useState([])
    const { execute: loadProjects, loading, error } = useFetchDataMutation("/api/projects")

    useEffect(() => {
        loadProjects()
            .then((data) => {
                if (data) setProjects(data.items)
            })
    }, [])


    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-4">
            {projects.map(project => (
                <ProjectCard key={project.id} project={project} />
            ))}
        </div>
    )
}