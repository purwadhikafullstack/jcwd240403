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

  // Point 1: Determine if the user has the required role.
  const userHasRequiredRole = user && roles.includes(user.role) ? true : false;

  // Point 2: If the TENANT tries to access the homepage, redirect to /dashboard.
  if (path === "/" && isAuthenticated && user.role === "TENANT") {
    return <Navigate to="/dashboard" />;
  }

  // Point 3: If a USER tries to access the dashboard, redirect to homepage.
  if (path === "/dashboard" && isAuthenticated && user.role === "USER") {
    return <Navigate to="/" />;
  }

  // Check for role Authorization and user authentication.
  if (isAuthenticated && userHasRequiredRole) {
    return <RouteComponent />;
  }

  // If the user is authenticated but doesn't have the required role, show access denied.
  if (isAuthenticated && !userHasRequiredRole) {
    return <AccessDenied />;
  }

  // Point 4: If the path is the homepage and the user is not authenticated (guest),
  // allow them to see the homepage. Otherwise, redirect logged-out users.
  if (path === "/" && !isAuthenticated) {
    return <RouteComponent />;
  }

  // If all other conditions aren't met, return to home.
  return <Navigate to="/" />;
};
