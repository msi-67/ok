import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Upload from "./components/upload";
import './App.css';

function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route index element={<Upload/>} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
