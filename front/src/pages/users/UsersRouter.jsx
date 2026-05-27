import React from 'react';
import { Route, Routes } from 'react-router-dom';
import UsersLayout from './UsersLayout';
import MyProfil from './MyProfil';
import Home from './Home';
import DocumentEditor from './DocumentEditor';
import UpdateProfil from './UpdateProfil';
import UpdatePassword from './UpdatePassword';

const UsersRouter = () => {
    return (
        <Routes>
            <Route element={<UsersLayout />}>
                <Route path='/home' element={<Home />} />
                <Route path='/documents/:id' element={<DocumentEditor />} />
                <Route path='/myprofil' element={<MyProfil />} />
                <Route path='/updateprofil' element={<UpdateProfil />} />
                <Route path='/updatepassword' element={<UpdatePassword />} />
            </Route>
        </Routes>
    );
};

export default UsersRouter;