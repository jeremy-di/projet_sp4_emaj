import { useEffect, useState } from "react"
import API from "../services/api"
import { Link } from "react-router-dom"

export default function AdminDashboard(){

    const [users, setUsers] = useState([])

    const [form, setForm] = useState({
        email: "",
        password: "",
        username: ""
    })

    const fetchUsers = async () => {
        try {
            const res = await API.get("/users/all")
            setUsers(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const toggleBlocked = async(user) => {
        try {
            await API.put(`/users/${user._id}`, {
                isBlocked: !user.isBlocked
            })
            fetchUsers()
        } catch (error) {
            console.log(error)
        }
    }

    return(
        <div className="py-8 px-16 grid grid-cols-1 gap-4">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <Link
                    to="/admin/create-user"
                    className="cursor-pointer border-2 px-4 py-3 rounded-lg hover:bg-black hover:text-white transition"
                >
                    Ajouter un compte
                </Link>
            </div>
            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-200">
                        <th>Email</th>
                        <th>Username</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id} className="border">
                            <td>{user.email}</td>
                            <td>{user.username}</td>
                            <td>
                                {user.isBlocked
                                    ? "Inactive"
                                    : "Active"}
                            </td>
                            <td>
                                <button
                                    onClick={() => toggleBlocked(user)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    {user.isBlocked
                                        ? "Activer"
                                        : "Désactiver"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
