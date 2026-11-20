import { useState } from "react"
import UserList from "../components/Users/UserList"
import * as format from "../formats"
import TagList from "../components/Tags/TagList"

export default function AdminDashboard() {

    const [showForm, setShowForm] = useState(false)

    return (
        <div className="flex flex-col gap-y-30">
            <UserList />
            <TagList />
        </div>
    )
}