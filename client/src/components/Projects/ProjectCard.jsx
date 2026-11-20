import { useNavigate } from "react-router-dom"
import * as format from "../../formats"

export default function ProjectCard({ project }) {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(`/projects/${project.id}`)
    }

    return (
        <div onClick={handleClick} className={format.cards.container}>
            <h1 className={format.cards.title}>{project.name}</h1>
            <p className={format.date}>{format.IsoDateFormatter(project.due_date)}</p>
            <p className={format.cards.description}>{project.description}</p>

            <div className={format.cards.footer}>
                <p className="italic">Tasks: {project.tasks.length}</p>

                <ul className={format.cards.tags}>
                    {project.tags.map(tag => (
                        <li key={tag.id}>#{tag.name}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}