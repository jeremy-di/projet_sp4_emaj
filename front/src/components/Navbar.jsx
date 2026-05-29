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
        <header className="py-4 border-b flex justify-center">
            <div>
                <img className="w-20 p-2" src="/emaj_logo.png" alt="" />
            </div>
            <ul className="flex gap-5 justify-center items-center">
                <li>
                    <Link className="text-emerald-600 text-xl hover:text-blue-800 transition delay-150 duration-300" to="/">
                        Accueil
                    </Link>
                </li>
                {!token && (
                    <>
                        <li>
                            <Link className="text-emerald-600 text-xl hover:text-blue-800 transition delay-150 duration-300" to="/login">
                                Connexion
                            </Link>
                        </li>
                    </>
                )}
                {token && (
                    <>
                        <li>
                            <Link className="text-emerald-600 text-xl hover:text-blue-800 transition delay-150 duration-300" to="/myprofil">
                                Mon profil
                            </Link>
                        </li>
                        <li>
                            <Link className="text-emerald-600 text-xl hover:text-blue-800 transition delay-150 duration-300" to="/files">
                                Documents importés
                            </Link>
                        </li>
                        {user?.role === "admin" && (
                            <li>
                                <Link className="text-emerald-600 text-xl hover:text-blue-800 transition delay-150 duration-300" to="/admin">
                                    Dashboard admin
                                </Link>
                            </li>
                        )}
                        <li>
                            <button onClick={logout} className="text-violet-500 cursor-pointer text-xl hover:text-violet-900 transition delay-150 duration-300">
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