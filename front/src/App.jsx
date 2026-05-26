import { BrowserRouter, Routes, Route } from "react-router-dom"
import AdminDashboard from "./pages/AdminDashboard"
import './App.css'
import PublicRouter from "./pages/public/PublicRouter"
import UsersRouter from "./pages/users/UsersRouter"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/admin"
          element={
              <AdminDashboard />
          }
        />
        <Route path="/*" element={<PublicRouter />} />
        <Route path="/users*" element={<UsersRouter />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App