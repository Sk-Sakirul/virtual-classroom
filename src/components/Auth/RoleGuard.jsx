import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RoleGuard = ({ children, allowedRoles }) => {
  const { user, role } = useSelector((state) => state.auth);

  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(role)) return <Navigate to="/" />;

  return children;
};

export default RoleGuard;
