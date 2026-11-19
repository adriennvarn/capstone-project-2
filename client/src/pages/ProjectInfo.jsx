import { useParams } from "react-router-dom"
import { useFetchDataMutation } from "../hooks/useFetchData"
import { useEffect, useState } from "react"
import TaskCard from "../components/TaskCard"
import TaskForm from "../components/TaskForm"

export default function ProjectInfo() {

    const { id } = useParams()
    const [showForm, setShowForm] = useState(false)
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
            <p className="my-2">{project.description}</p>

            <h3>Tasks:</h3>
            <div className="mb-2 grid grid-cols-2 md:grid-cols-4 justify-center items-center">
                {project.tasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                ))}
            </div>
            
            <p onClick={() => setShowForm(true)} className="semibold">Add Task</p>
            {showForm ? <TaskForm project={project} /> : ""}

            <ul className="mt-2 text-xs flex flex-wrap items-center justify-center gap-4">
                {project.tags.map(tag => (
                    <li key={tag.id}>#{tag.name}</li>
                ))}
            </ul>
        </div>
    )
}