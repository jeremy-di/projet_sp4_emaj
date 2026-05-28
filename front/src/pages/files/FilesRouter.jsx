import React from 'react';
import { Route, Routes } from 'react-router-dom';
import FilesLayout from './FilesLayout';
import NewFile from './NewFile';
import HomeFiles from './HomeFiles';
import ViewContent from './ViewContent';

const FilesRouter = () => {
    return (
        <Routes>
            <Route element={<FilesLayout />}>
                <Route path="/" element={<HomeFiles />} />
                <Route path="new" element={<NewFile />} />
                <Route path="content/:_id" element={<ViewContent />} />
            </Route>
        </Routes>
    );
};

export default FilesRouter;