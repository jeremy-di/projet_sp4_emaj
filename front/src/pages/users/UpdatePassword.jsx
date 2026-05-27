import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../_services/user.service';

const UpdatePassword = () => {

    const navigate = useNavigate()

    const [password, setPassword] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    })
    const [err, setErr] = useState(null);
    const [ message, setMessage ] = useState("")

    const onChange = (e) => {
        setPassword({
        ...password,
        [e.target.name]: e.target.value
        });
    }

    const onSubmit = (e) => {
        e.preventDefault()
        userService.updateMyPassword(password)
            .then(res => {
                setMessage(res.data.message)
                navigate('/users/myprofil')
            })
            .catch(error => {
                setErr(error.response?.data?.message || "Erreur serveur");
            });
    }

    return (
        <div>
            {message && (
            <div>
                <p>{message || ""}</p>
            </div>
            )}
            <h1>Modifier mon mot de passe</h1>
            <form onSubmit={onSubmit}>
                <div>
                    <label for="oldPassword">Ancien mot de passe</label>
                    <input type="password" name="oldPassword" value={password.oldPassword} onChange={onChange} id="oldPassword" required />
                </div>
                <div>
                    <label for="newPassword">Nouveau mot de passe</label>
                    <input type="password" name="newPassword" value={password.newPassword} onChange={onChange} id="newPassword" required />
                </div>
                <div>
                    <label for="confirmPassword">Confirmer le nouveau mot de passe</label>
                    <input type="password" name="confirmPassword" value={password.confirmPassword} onChange={onChange} id="confirmPassword" required />
                </div>
                <button type="submit">Valider</button>
            </form>
        </div>
    );
};

export default UpdatePassword;