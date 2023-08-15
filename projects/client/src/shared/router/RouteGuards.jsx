import { Outlet, Navigate } from "react-router-dom";
import useToken from "../hooks/useToken";
import jwt from "jwt-decode";

export const AuthenticatedRoute = ({ roles }) => {
  const { token } = useToken();

  // Special condition for TENANT accessing the homepage
  if (
    window.location.pathname === "/" &&
    token &&
    jwt(token).role === "TENANT"
  ) {
    return <Navigate to="/dashboard" />;
  }

  if (token && roles.includes(jwt(token).role)) {
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
