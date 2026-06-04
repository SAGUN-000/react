import { Navigate } from "react-router-dom";

const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return !payload.exp || payload.exp < currentTime;
  } catch (err) {
    return true;
  }
};

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("jwt_token");

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("jwt_token");
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;