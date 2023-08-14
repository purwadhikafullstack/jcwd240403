import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Book from "./pages/user/Book";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import useToken from "./shared/hooks/useToken";
import { useDispatch } from "react-redux";
import { addUser } from "./store/auth/authSlice";
import jwt from "jwt-decode";
import {
  AuthenticatedRoute,
  NonAuthenticatedRoute,
  OpenRoute,
} from "./shared/router/RouteGuards";
import HomeOrDashboard from "./shared/router/HomeOrDashboard";

function App() {
  const { token } = useToken();
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      const decode = jwt(token);
      dispatch(addUser(decode));
    }
  }, [token, dispatch]);

  return (
    <Routes>
      {/* Route for the base path to decide between Home and Dashboard */}
      <Route path="/">
        <Route index element={<HomeOrDashboard />} />
      </Route>

      {/* Other Authenticated Routes */}
      <Route path="book" element={<AuthenticatedRoute roles={["USER"]} />}>
        <Route index element={<Book />} />
      </Route>

      {/* Non-authenticated Routes */}
      <Route path="/login" element={<NonAuthenticatedRoute />}>
        <Route index element={<Login />} />
      </Route>
      <Route path="/register" element={<NonAuthenticatedRoute />}>
        <Route index element={<Register />} />
      </Route>
      <Route path="/verify/:token" element={<NonAuthenticatedRoute />}>
        <Route index element={<VerifyOTP />} />
      </Route>

      {/* Open Routes */}
      <Route path="*" element={<OpenRoute />}>
        <Route index element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
