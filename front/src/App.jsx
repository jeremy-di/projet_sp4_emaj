import { BrowserRouter, Routes, Route } from "react-router-dom"
import AdminDashboard from "./pages/AdminDashboard"
import CreateUser from "./pages/CreateUser"
import './App.css'
import PublicRouter from "./pages/public/PublicRouter"
import UsersRouter from "./pages/users/UsersRouter"
import ProtectedRoute from "./components/ProtectedRoute"
import FilesRouter from "./pages/files/FilesRouter"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/create-user" element={
          <ProtectedRoute>
            <CreateUser />
          </ProtectedRoute>
        } />
        <Route path="/*" element={<PublicRouter />} />
        <Route path="/users/*" element={<UsersRouter />} />
        <Route path="/files/*" element={<FilesRouter />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App