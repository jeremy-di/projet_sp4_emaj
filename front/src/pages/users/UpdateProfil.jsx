import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../_services/user.service';

const UpdateProfil = () => {

    const navigate = useNavigate()

    const [infos, setInfos] = useState({
        username: "",
        email: ""
    })
    const [err, setErr] = useState(null)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        userService.getMe()
            .then(res => {
                setInfos({
                    username: res.data.username || "",
                    email: res.data.email || ""
                })
                setLoaded(true)
            })
            .catch(error => {
                setErr("Impossible de charger les informations")
                setLoaded(true)
            })
    }, [])

    const onChange = (e) => {
        setInfos({
            ...infos,
            [e.target.name]: e.target.value
        })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        userService.updateMe(infos)
            .then(res => {
                console.log(res.data)
                navigate("/users/myprofil")
            })
            .catch(error => {
                setErr(error.response?.data?.message || "Erreur serveur")
            })
    }

    if (!loaded) {
        return(
            <div className='flex justify-center mt-5'>
                <h2 className='text-4xl text-green-500'>Chargement...</h2>
            </div>
        )
    }
    else {
        return (
            <div>
                <h1>Modifications des informations de profil</h1>
                <form onSubmit={onSubmit}>
                    <div>
                        <label htmlFor="username">Login</label>
                        <input type="text" name="username" value={infos.username} onChange={onChange} id="username" required/>
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input type="text" name="email" value={infos.email} onChange={onChange} id="email" required/>
                    </div>
                    {err && <p className="text-red-500 mb-3">{err}</p>}
                    <button type="submit">Valider les changements</button>
                </form>
            </div>
        );
    }

};

export default UpdateProfil;