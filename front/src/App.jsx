import { BrowserRouter, Routes, Route } from "react-router-dom"
import AdminDashboard from "./pages/AdminDashboard"
import './App.css'

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
      </Routes>
    </BrowserRouter>
  )
}

export default App