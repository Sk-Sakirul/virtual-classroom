import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RoleGuard = ({ children, requiredRole }) => {
  const { user, isLoading } = useSelector((state) => state.auth);

  // 1. Still checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="glass-effect rounded-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // 2. Not logged in → send to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Wrong role → send to correct home
  if (user.role !== requiredRole) {
    const homePath = user.role === "teacher" ? "/dashboard" : "/classroom";
    return <Navigate to={homePath} replace />;
  }

  // 4. Role matches → show content
  return children;
};

export default RoleGuard;
