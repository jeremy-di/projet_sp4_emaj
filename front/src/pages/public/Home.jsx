import React from 'react'
import { Link } from 'react-router-dom'
import { userService } from '../../_services/user.service'
import UsersHome from '../users/Home'

const Home = () => {
    if (userService.isLogged()) {
        return <UsersHome />
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
            <section className="w-full max-w-xl rounded-2xl bg-white p-10 text-center shadow-xl">
                <h1 className="text-4xl font-bold text-slate-800">
                    Espace collaboratif
                </h1>
                <p className="mt-3 text-slate-500">
                    <Link to="/login" className="font-semibold text-blue-600 hover:underline">
                        Connectez-vous
                    </Link>{" "}
                    pour accéder à vos documents
                </p>

            </section>
        </main>
    )
}

export default Home
