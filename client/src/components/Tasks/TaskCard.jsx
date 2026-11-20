import { useNavigate } from "react-router-dom"
import * as format from "../../formats"

export default function TaskCard({ task }) {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(`/tasks/${task.id}`)
    }

    return (
        <div onClick={handleClick} className={format.cards.container}>
            <h1 className={format.cards.title}>{task.name}</h1>
            <p className={format.date}>{format.IsoDateFormatter(task.due_date)}</p>
            <p>{task.description}</p>
        </div>
    )
}