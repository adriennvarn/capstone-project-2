import { useNavigate, useParams } from "react-router-dom"
import { useFetchDataMutation } from "../hooks/useFetchData"
import { useEffect, useState } from "react"
import UserCard from "../components/UserCard"

export default function TaskInfo() {

    const { id } = useParams()
    const navigate = useNavigate()
    const [task, setTask] = useState({})
    const [loading, setLoading] = useState(true)
    const { execute: loadData, error } = useFetchDataMutation(`/api/tasks/${id}`)

    useEffect(() => {
        loadData()
            .then((data) => {
                if (data) setTask(data)
            })
            .finally(() => setLoading(false))
    }, [])

    const handleDelete = async () => {
        await loadData({
            method: "DELETE"
        })

        if (window.history.state?.idx > 0) {
            navigate(-1)
        } else {
            navigate("/projects", { replace: true })
        }
    }

    const handleUpdate = () => {

    }

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>

    return (
        <div className="align-center">
            <h1 className="text-xl">{task.name}</h1>
            <p className="text-xs">{task.due_date}</p>
            <p>{task.description}</p>
            <br />
            <ul className="text-xs flex flex-wrap items-center justify-center gap-4">
                {task.tags.map(tag => (
                    <li key={tag.id}>#{tag.name}</li>
                ))}
            </ul>

            <h3>Users:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 justify-center items-center">
                {task.users.map(user => (
                    <UserCard key={user.id} user={user} />
                ))}
            </div>

            <button onClick={handleDelete} type="button">Delete Task</button>
            <button onClick={handleUpdate} type="button">Update Task</button>
        </div>
    )
}