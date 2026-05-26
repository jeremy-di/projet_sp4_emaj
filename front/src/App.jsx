import { BrowserRouter, Routes, Route } from "react-router-dom"
import AdminDashboard from "./pages/AdminDashboard"
import './App.css'
import PublicRouter from "./pages/public/PublicRouter"

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
      </Routes>
    </BrowserRouter>
  )
}

export default App