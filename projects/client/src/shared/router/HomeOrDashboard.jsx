import jwt from "jwt-decode";
import Home from "../../pages/Home";
import Dashboard from "../../pages/tenant/Dashboard";
import useToken from "../hooks/useToken";

const HomeOrDashboard = () => {
  const { token } = useToken();

  // If not authenticated, show Home to guests.
  if (!token) return <Home />;

  const decodedToken = jwt(token);

  if (decodedToken.role === "USER") return <Home />;
  if (decodedToken.role === "TENANT") return <Dashboard />;

  // Default fallback to Home if role doesn't match any conditions
  return <Home />;
};

export default HomeOrDashboard;
