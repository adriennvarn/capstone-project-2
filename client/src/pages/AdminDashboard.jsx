import UserList from "../components/Users/UserList"
import TagList from "../components/Tags/TagList"

export default function AdminDashboard() {

    return (
        <div className="flex flex-col gap-y-30">
            <UserList />
            <TagList />
        </div>
    )
}