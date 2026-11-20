import { useNavigate } from "react-router-dom"
import * as format from "../../formats"

export default function ProjectCard({ project }) {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(`/projects/${project.id}`)
    }

    return (
        <div onClick={handleClick} className="border border-lg">
            <h1 className={format.cards.title}>{project.name}</h1>
            <p className={format.date}>{format.IsoDateFormatter(project.due_date)}</p>
            <p>{project.description}</p>

            <p>Tasks: {project.tasks.length}</p>

            <ul className="text-xs flex flex-wrap items-center justify-center gap-4">
                {project.tags.map(tag => (
                    <li key={tag.id}>#{tag.name}</li>
                ))}
            </ul>
        </div>
    )
}