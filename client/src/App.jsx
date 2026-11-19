import "./App.css"
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom"
import Navbar from "./components/Navbar"
import LoginPage from "./pages/LoginPage"
import Home from "./pages/Home"
import ProjectInfo from "./pages/ProjectInfo"
import TaskInfo from "./pages/TaskInfo"
import UserInfo from "./pages/UserInfo"
import AdminDashboard from "./pages/AdminDashboard"
import { UserProvider } from "./contexts/UserContext"

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
        <UserProvider>
            <BrowserRouter>
                <Routes>
                    <Route element={<NavWrapper />}>
                        <Route path="/" element={<LoginPage />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/projects/<int:id>" element={<ProjectInfo />} />
                        <Route path="/tasks/<int:id>" element={<TaskInfo />} />
                        <Route path="/users/<int:id>" element={<UserInfo />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </UserProvider>
    )
}