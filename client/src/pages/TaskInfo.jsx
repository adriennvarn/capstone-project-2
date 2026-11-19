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
            <h1 className={format.title}>{task.name}</h1>
            <p className={format.date}>
                {task?.due_date && task.due_date.slice(0, 10).split("-").slice(1).concat(task.due_date.slice(0, 4)).join("-")}
            </p>

            <p className={format.description}>{task.description}</p>

            <div className="my-2">
                <h3 className="m-1">Users:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 justify-center items-center">
                    {task.users.map(user => (
                        <UserCard key={user.id} user={user} />
                    ))}
                </div>
            </div>


            <ul className="mt-2 mb-1 text-xs flex flex-wrap items-center justify-center gap-3">
                {task.tags.map(tag => (
                    <li key={tag.id}>#{tag.name}</li>
                ))}
            </ul>

            <div className={format.buttons.container}>
                <button onClick={handleDelete} type="button">Delete Task</button>
                
                <button onClick={() => { setShowUpdateForm(true) }} type="button">Update Task</button>
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