import React from 'react';
import Navbar from '../../components/Navbar';
import { Outlet } from 'react-router-dom'

const FilesLayout = () => {
    return (
        <div>
            <Navbar />
            <Outlet />
        </div>
    );
};

export default FilesLayout;