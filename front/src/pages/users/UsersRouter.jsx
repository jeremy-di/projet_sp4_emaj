import React from 'react';
import { Route, Routes } from 'react-router-dom';
import UsersLayout from './UsersLayout';
import MyProfil from './MyProfil';

const UsersRouter = () => {
    return (
        <Routes>
            <Route element={<UsersLayout />}>
                <Route path='/myprofil' element={<MyProfil />} />
            </Route>
        </Routes>
    );
};

export default UsersRouter;