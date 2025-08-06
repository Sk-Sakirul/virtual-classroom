import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import Login from './pages/Login';
import Register from './pages/Register';
import Classroom from './pages/Classroom';

const router = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='classroom' element={<Classroom />}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default router;