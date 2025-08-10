import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Classroom from "./pages/Classroom.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import RoleGuard from "./components/Auth/RoleGuard.jsx";

const AppRouter = () => {
  const { user, isLoading } = useSelector((state) => state.auth);
  // console.log(user);

  // Show global loading screen while Firebase checks auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="glass-effect rounded-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Virtual Classroom...</p>
        </div>
      </div>
    );
  }

  // Not logged in → only show login/register
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Catch-all → send to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Logged in → send to correct home based on role
  return (
    <Routes>
      <Route path="/classroom" element={<Classroom />} />
      <Route
        path="/dashboard"
        element={
          <RoleGuard requiredRole="teacher">
            <Dashboard />
          </RoleGuard>
        }
      />
      {/* Home route */}
      <Route
        path="/"
        element={
          user.role === "teacher" ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/classroom" replace />
          )
        }
      />
      {/* Catch-all → go to role's home */}
      <Route
        path="*"
        element={
          <Navigate
            to={user.role === "teacher" ? "/dashboard" : "/classroom"}
            replace
          />
        }
      />
    </Routes>
  );
};

export default AppRouter;
