import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import LoginPage from "./pages/LoginPage"
import Home from "./pages/Home"
import ProjectInfo from "./pages/ProjectInfo"
import TaskInfo from "./pages/TaskInfo"
import UserInfo from "./pages/UserInfo"
import AdminDashboard from "./pages/AdminDashboard"
import { UserProvider } from "./contexts/UserContext"
import ProtectedRoute from "./ProtectedRoute"



export default function App() {
    return (
        <UserProvider>
            <BrowserRouter>
                <Routes>
                    <Route element={<Navbar />}>

                        {/* Public route */}
                        <Route path="/" element={<LoginPage />} />

                        {/* Available to any logged in user */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/home" element={<Home />} />
                            <Route path="/projects/<int:id>" element={<ProjectInfo />} />
                            <Route path="/tasks/<int:id>" element={<TaskInfo />} />
                            <Route path="/users/<int:id>" element={<UserInfo />} />
                        </Route>

                        {/* Only available to admins */}
                        <Route element={<ProtectedRoute allowedRoles={["admin"]} />} >
                            <Route path="/admin" element={<AdminDashboard />} />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </UserProvider>
    )
}