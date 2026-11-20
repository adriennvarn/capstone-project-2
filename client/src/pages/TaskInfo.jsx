import { useNavigate, useParams } from "react-router-dom"
import { useFetchData, useFetchDataMutation } from "../hooks/useFetchData"
import { useState } from "react"
import UserCard from "../components/Users/UserCard"
import TaskForm from "../components/Tasks/TaskForm"
import * as format from "../formats"

export default function TaskInfo() {

    const { id } = useParams()
    const navigate = useNavigate()
    const { data: task, loading, error, refetch } = useFetchData(`/api/tasks/${id}`)
    const { execute: sendData } = useFetchDataMutation(`/api/tasks/${id}`)
    const [showUpdateForm, setShowUpdateForm] = useState(false)

    const handleDelete = async () => {
        await sendData({
            method: "DELETE"
        })

        if (window.history.state?.idx > 0) {
            navigate(-1)
        } else {
            navigate("/projects", { replace: true })
        }
    }

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>

    return (
        <div className="align-center">
            <h1 className={format.pages.title}>{task.name}</h1>
            <p className={format.date}>
                {task?.due_date && format.IsoDateFormatter(task.due_date)}
            </p>

            <p className={format.cards.description}>{task.description}</p>

            <ul className={format.cards.tags}>
                {task.tags.map(tag => (
                    <li key={tag.id}>#{tag.name}</li>
                ))}
            </ul>

            <div className="my-2">
                <h3 className={format.pages.section}>Users:</h3>
                <div className={format.cards.group}>
                    {task.users.map(user => (
                        <UserCard key={user.id} user={user} />
                    ))}
                </div>
            </div>

            <div className={format.buttons.container}>
                <button onClick={handleDelete} type="button" className={format.buttons.button}>
                    Delete Task
                </button>

                <button onClick={() => { setShowUpdateForm(true) }} type="button" className={format.buttons.button}>
                    Update Task
                </button>
                {showUpdateForm && (
                    <TaskForm task={task} onTaskCreated={() => {
                        refetch()
                        setShowUpdateForm(false)
                    }} />
                )}
            </div>
        </div>
    )
}