import { Outlet, Navigate } from "react-router-dom";
import useToken from "../hooks/useToken";
import { useSelector } from "react-redux";

export const AuthenticatedRoute = ({ roles }) => {
  const { token } = useToken();
  const { user } = useSelector((state) => state.auth);

  // Special condition for TENANT accessing the homepage
  if (window.location.pathname === "/" && token && user?.role === "TENANT") {
    return <Navigate to="/" />;
  }

  if (token && roles.includes(user?.role)) {
    return <Outlet />;
  }

  return <Navigate to="/login" />;
};

export const NonAuthenticatedRoute = () => {
  const { token } = useToken();

  // Allow unauthenticated users to see the homepage
  if (window.location.pathname === "/" && !token) {
    return <Outlet />;
  }

  if (!token) {
    return <Outlet />;
  }

  return <Navigate to="/" />;
};

export const OpenRoute = () => <Outlet />;
