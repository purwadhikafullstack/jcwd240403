import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from "../../store/auth/authSlice";
import AccessDenied from "../../pages/AccessDenied";

export const PrivateRoute = ({ component: RouteComponent, roles, path }) => {
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userHasRequiredRole = user && roles.includes(user.role) ? true : false;

  if (isAuthenticated && userHasRequiredRole) {
    // role Authorization and user authentication
    return <RouteComponent />;
  }

  if (isAuthenticated && !userHasRequiredRole) {
    return <AccessDenied />;
  }

  console.log("user", user);
  if (
    (path === "/" && !isAuthenticated) ||
    (path === "/" && user.role === "USER")
  ) {
    return <RouteComponent />;
  } else if (user.role === "TENANT") {
    return <Navigate to="/dashboard" />;
  }

  // if all false, return to home
  return <Navigate to="/" />;
};
