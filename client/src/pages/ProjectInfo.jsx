import { useNavigate, useParams } from "react-router-dom"
import { useFetchData, useFetchDataMutation } from "../hooks/useFetchData"
import { useState } from "react"
import TaskCard from "../components/TaskCard"
import TaskForm from "../components/TaskForm"
import ProjectForm from "../components/ProjectForm"
import * as format from "../formats"

export default function ProjectInfo() {

    const { id } = useParams()
    const [showTaskForm, setShowTaskForm] = useState(false)
    const [showUpdateForm, setShowUpdateForm] = useState(false)
    const { data: project, loading, error, refetch } = useFetchData(`/api/projects/${id}`)
    const { execute: sendData } = useFetchDataMutation(`/api/projects/${id}`)
    const navigate = useNavigate()

    const handleDelete = () => {
        sendData({
            method: "DELETE"
        })
        navigate("/home")
    }

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>

    return (
        <div className="align-center">
            <h1 className={format.title}>{project.name}</h1>
            <p className={format.date}>{project.due_date}</p>
            <p className={format.description}>
                {project?.due_date && project.due_date.slice(0, 10).split("-").slice(1).concat(project.due_date.slice(0, 4)).join("-")}
            </p>

            <h3>Tasks:</h3>
            <div className="mb-2 grid grid-cols-2 md:grid-cols-4 justify-center items-center">
                {project.tasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                ))}
            </div>

            <p onClick={() => setShowTaskForm(true)} className="semibold">Add Task</p>
            {showTaskForm &&
                (<TaskForm project={project} onTaskCreated={() => {
                    refetch()
                    setShowTaskForm(false)
                }} />)
            }

            <ul className="mt-2 text-xs flex flex-wrap items-center justify-center gap-4">
                {project.tags.map(tag => (
                    <li key={tag.id}>#{tag.name}</li>
                ))}
            </ul>

            <div className={format.buttonGroup}>
                <button onClick={handleDelete} type="button">Delete Project</button>

                <button onClick={() => { setShowUpdateForm(true) }} type="button">Update Project</button>
                {showUpdateForm && (
                    <ProjectForm project={project} onProjectCreated={() => {
                        refetch()
                        setShowUpdateForm(false)
                    }} />
                )}
            </div>
        </div >
    )
}