import "./App.css"
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom"
import Navbar from "./components/Navbar"
import Login from "./pages/Login"
import Home from "./pages/Home"
import ProjectInfo from "./pages/ProjectInfo"
import TaskInfo from "./pages/TaskInfo"
import UserInfo from "./pages/UserInfo"
import AdminDashboard from "./pages/AdminDashboard"

function NavWrapper() {
    return (
        <>
        <Navbar />
        <main>
            <Outlet />
        </main>
        </>
    )
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Page without Navbar */}
                <Route path="/" element={<Login />} />

                {/* Pages with Navbar */}
                <Route element={<NavWrapper />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/projects/<int:id>" element={<ProjectInfo />} />
                    <Route path="/tasks/<int:id>" element={<TaskInfo />} />
                    <Route path="/users/<int:id>" element={<UserInfo />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}