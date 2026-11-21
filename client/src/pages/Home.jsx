import ProjectList from "../components/Projects/ProjectList"
import * as format from "../formats"

export default function Home() {

    return (
        <div className={format.pages.root}>
            <ProjectList />
        </div>
    )
}