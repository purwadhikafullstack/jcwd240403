import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from "../../store/auth/authSlice";
import AccessDenied from "../../pages/AccessDenied";

export const PrivateRoute = ({ component: RouteComponent, roles }) => {
  const user = useSelector(selectCurrentUser);
  // const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAuthenticated = true;
  // const userHasRequiredRole = user && roles.includes(user.role) ? true : false;
  const userHasRequiredRole = true;

  // role Authorization and user authentication

  if (isAuthenticated && userHasRequiredRole) {
    return <RouteComponent />;
  }

  if (isAuthenticated && !userHasRequiredRole) {
    return <AccessDenied />;
  }

  // if all false, return to home
  return <Navigate to="/" />;
};
