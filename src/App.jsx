
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase.js";
import { setUser, setLoading } from "./features/auth/authSlice.js";
import AppRouter from "./router.jsx";
import RegisterPage from "./pages/Register.jsx";
import LoginPage from "./pages/Login.jsx";
import Classroom from "./pages/Classroom.jsx";
import './App.css';

function App() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email?.split("@")[0],
            photoURL: user.photoURL,
            role: "student", // Default role, can be updated from database
          })
        );
      } else {
        dispatch(setUser(null));
      }
      dispatch(setLoading(false));
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="glass-effect rounded-3xl p-12 text-center card-hover">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-spin">
            <i className="fas fa-graduation-cap text-white text-2xl"></i>
          </div>
          <div className="animate-pulse">
            <div className="h-4 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-full w-48 mx-auto mb-3"></div>
            <div className="h-3 bg-gradient-to-r from-secondary-500/20 to-primary-500/20 rounded-full w-32 mx-auto"></div>
          </div>
          <p className="text-gray-600 mt-4 font-medium">
            Loading Virtual Classroom...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      {/* <RegisterPage/>
      <LoginPage />
      <Classroom /> */}
      <AppRouter />
    </Router>
  );
}

export default App;

// import React from 'react';
// import "./App.css";
// import { Link } from 'react-router-dom';

// const App = () => {
//   return <div >
//     <h2>Home</h2>
//     <Link to="/register" className='text-blue-600 cursor-pointer mr-2'>Register</Link>
//     <Link to="/login"  className='text-blue-600 cursor-pointer '>Login</Link>
//   </div>;
// }

// export default App;