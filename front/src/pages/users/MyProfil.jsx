import React, { useState } from 'react';
import { useEffect } from 'react';
import { userService } from '../../_services/user.service';

const MyProfil = () => {

    const [infos, setInfos] = useState(null)
    const [loaded, setLoaded] = useState(false)
    const [err, setErr] = useState(null)

    useEffect(() => {
        userService.getMe()
            .then(res => {
                console.log(res.data)
                setInfos(res.data)
                setLoaded(true)
            })
            .catch(error => {
                setErr(error)
                setLoaded(true)
            })
    }, [])

    if (!loaded) {
        return(
            <div className='flex justify-center mt-5'>
                <h2 className='text-4xl text-green-500'>Chargement...</h2>
            </div>
        )
    }
    else if (err) {
        return(
            <div className='flex justify-center mt-5'>
                <h2 className='text-4xl text-red-500'>Erreur : {err}</h2>
            </div>
        )
    }
    else {
        return (
            <div>
                <h2>Bienvenue sur votre profil {infos.username}</h2>
                <p>Votre Email : {infos.email}</p>
                <p>Votre rôle : {infos.role}</p>
                <div>
                    <li><a href="">Modifier mes informations</a></li>
                    <li><a href="">Modifier mon mot de passe</a></li>
                </div>
            </div>
        );
    }

};

export default MyProfil;