import { useState } from "react"
import UserList from "../components/Users/UserList"
import * as format from "../formats"

export default function AdminDashboard() {

    const [showForm, setShowForm] = useState(false)

    return (
        <div>
            <UserList />
        </div>
    )
}