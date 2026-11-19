import { useNavigate } from "react-router-dom"

export default function TaskCard({ task }) {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(`/tasks/${task.id}`)
    }

    return (
        <div onClick={handleClick} className="border border-lg">
            <h1>{task.name}</h1>
            <h2>{task.due_date}</h2>
            <p>{task.description}</p>
        </div>
    )
}