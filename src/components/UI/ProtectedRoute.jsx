import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);
console.log("ProtectedRoute - isLoggedIn:", isLoggedIn);
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
