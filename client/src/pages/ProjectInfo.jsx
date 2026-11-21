import { useNavigate, useParams } from "react-router-dom"
import { useFetchData, useFetchDataMutation } from "../hooks/useFetchData"
import { useState } from "react"
import TaskCard from "../components/Tasks/TaskCard"
import TaskForm from "../components/Tasks/TaskForm"
import ProjectForm from "../components/Projects/ProjectForm"
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
        <div className={format.pages.root}>
            <h1 className={format.pages.title}>{project.name}</h1>
            <p className={format.date}>{format.IsoDateFormatter(project.due_date)}</p>
            <p className={format.pages.description}>
                {project.description}
            </p>

            <ul className={format.cards.tags}>
                {project.tags.map(tag => (
                    <li key={tag.id}>#{tag.name}</li>
                ))}
            </ul>

            <h3 className={format.pages.section}>Tasks:</h3>
            <div className={format.cards.group}>
                {project.tasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                ))}
            </div>

            <p onClick={() => {
                setShowTaskForm(true)
                setShowUpdateForm(false)
            }
            } className={format.buttons.button}>Add Task</p>
            {showTaskForm &&
                (<TaskForm project={project} onTaskCreated={() => {
                    refetch()
                    setShowTaskForm(false)
                }} />)
            }

            <div className={format.buttons.container}>
                <button onClick={handleDelete} type="button" className={format.buttons.button}>
                    Delete Project
                </button>

                <button onClick={() => {
                    setShowUpdateForm(true)
                    setShowTaskForm(false)
                }} type="button" className={format.buttons.button}>
                    Update Project
                </button>
            </div>

            {showUpdateForm && (
                <ProjectForm project={project} onProjectCreated={() => {
                    refetch()
                    setShowUpdateForm(false)
                }} />
            )}
        </div >
    )
}