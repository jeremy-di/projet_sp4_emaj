import { Link } from "react-router-dom"
import { jwtDecode } from "jwt-decode"

const Navbar = () => {

    const token = localStorage.getItem("token")
    let user = null

    if(token){
        try {
            user = jwtDecode(token)
        } catch (error) {
            console.log(error)
        }
    }

    const logout = () => {
        localStorage.removeItem("token")
        window.location.href = "/login"
    }

    return (
        <header className="py-4 border-b">
            <ul className="flex gap-5 justify-center items-center">
                <li>
                    <Link className="text-amber-600" to="/">
                        Accueil
                    </Link>
                </li>
                {!token && (
                    <>
                        <li>
                            <Link className="text-amber-600" to="/login">
                                Connexion
                            </Link>
                        </li>
                        <li>
                            <Link className="text-amber-600" to="/register">
                                Inscription
                            </Link>
                        </li>
                    </>
                )}
                {token && (
                    <>
                        <li>
                            <Link className="text-amber-600" to="/myprofil">
                                Mon profil
                            </Link>
                        </li>
                        <li>
                            <Link className="text-amber-600" to="/files">
                                Documents importés
                            </Link>
                        </li>
                        {user?.role === "admin" && (
                            <li>
                                <Link className="text-amber-600" to="/admin">
                                    Dashboard admin
                                </Link>
                            </li>
                        )}
                        <li>
                            <button onClick={logout} className="text-red-500 cursor-pointer">
                                Déconnexion
                            </button>
                        </li>
                    </>
                )}
            </ul>
        </header>
    )
}

export default Navbar