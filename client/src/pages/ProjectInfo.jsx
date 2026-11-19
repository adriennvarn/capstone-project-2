import { useParams } from "react-router-dom"
import { useFetchDataMutation } from "../hooks/useFetchData"
import { useEffect, useState } from "react"
import TaskCard from "../components/TaskCard"

export default function ProjectInfo() {

    const { id } = useParams()
    const [project, setProject] = useState({})
    const [loading, setLoading] = useState(true)
    const { execute: loadData, error } = useFetchDataMutation(`/api/projects/${id}`)

    useEffect(() => {
        loadData()
            .then((data) => {
                if (data) setProject(data)
            })
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>


    return (
        <div className="align-center">
            <h1 className="text-xl">{project.name}</h1>
            <p className="text-xs">{project.due_date}</p>
            <p>{project.description}</p>

            <h3>Tasks:</h3>
            <ul>
                {project.tasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                ))}
            </ul>

            <ul className="text-xs flex flex-wrap items-center justify-center gap-4">
                {project.tags.map(tag => (
                    <li key={tag.id}>#{tag.name}</li>
                ))}
            </ul>
        </div>
    )
}