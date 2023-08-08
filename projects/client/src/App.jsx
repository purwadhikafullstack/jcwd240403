import { Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { PrivateRoute } from "./shared/router/PrivateRoute";
import Home from "./pages/Home";
import Book from "./pages/user/Book";
import Dashboard from "./pages/tenant/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
      <Route
        path="dashboard"
        element={<PrivateRoute roles={["TENANT"]} component={Dashboard} />}
      />
      <Route
        path="book"
        element={<PrivateRoute roles={["USER"]} component={Book} />}
      />
    </Routes>
  );
}

export default App;
