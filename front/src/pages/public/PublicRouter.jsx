import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PublicLayout from './PublicLayout';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Activation from './Activation';
import MyProfil from '../users/MyProfil';

const PublicRouter = () => {
    return (
        <Routes>
            <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/activation" element={<Activation />} />
                <Route path="/myprofil" element={<MyProfil />} />
            </Route>
        </Routes>
    );
};

export default PublicRouter;