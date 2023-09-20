import Home from "../../pages/Home";
import PropertyList from "../../pages/tenant/property/PropertyList";
import useToken from "../hooks/useToken";
import { useSelector } from "react-redux";

const HomeOrDashboard = () => {
  const { token } = useToken();
  const { user } = useSelector((state) => state.auth);

  console.log("user", user);

  // If not authenticated, show Home to guests.
  if (!token) return <Home />;

  if (user?.role === "USER") return <Home />;
  if (user?.role === "TENANT") return <PropertyList />;

  // Default fallback to Home if role doesn't match any conditions
  return <Home />;
};

export default HomeOrDashboard;
