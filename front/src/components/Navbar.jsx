import React from 'react';

const Navbar = () => {
    return (
        <header>
            <ul className="flex gap-5 justify-center">
                <li><a className='text-amber-600' href="/">Accueil</a></li>
                <li><a className='text-amber-600' href="/login">Connexion</a></li>
                <li><a className='text-amber-600' href="/register">Inscription</a></li>
                <li><a className='text-amber-600' href="/myprofil">Mon profil</a></li>
                <li><a className='text-amber-600' href="/admin">Dashboard admin</a></li>
            </ul>
        </header>
    );
};

export default Navbar;