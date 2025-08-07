import React from 'react';
import "./App.css";
import { Link } from 'react-router-dom';

const App = () => {
  return <div >
    <h2>Home</h2>
    <Link to="/register" className='text-blue-600 cursor-pointer mr-2'>Register</Link>
    <Link to="/login"  className='text-blue-600 cursor-pointer '>Login</Link>
  </div>;
}

export default App;