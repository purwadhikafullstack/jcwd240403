import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Book from "./pages/user/Book";
// import Dashboard from "./pages/tenant/Dashboard";
import Profiling from "./pages/user/Profiling";
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
import DashboardSideBar from "./components/sidebar/DashboardSideBar";
import CategoryArea from "./pages/tenant/CategoryArea";
import ChangePassword from "./pages/user/ChangePassword";
import PropertyEdit from "./pages/tenant/property/PropertyEdit";
import PropertyAdd from "./pages/tenant/property/PropertyAdd";
import RoomList from "./pages/tenant/room/RoomList";

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
      <Route path="/" element={<DashboardSideBar />}>
        <Route index element={<HomeOrDashboard />} />
      </Route>

      {/* USER Authenticated Routes */}
      <Route path="book" element={<AuthenticatedRoute roles={["USER"]} />}>
        <Route index element={<Book />} />
      </Route>
      <Route path="profile" element={<AuthenticatedRoute roles={["USER"]} />}>
        <Route index element={<Profiling />} />
      </Route>
      <Route path="password" element={<AuthenticatedRoute roles={["USER"]} />}>
        <Route index element={<ChangePassword />} />
      </Route>

      {/* TENANT Authenticated Routes */}
      <Route
        path="property"
        element={<AuthenticatedRoute roles={["TENANT"]} />}
      >
        <Route path=":propertyId" element={<DashboardSideBar />}>
          <Route index element={<PropertyEdit />} />
        </Route>
        <Route path="add" element={<DashboardSideBar />}>
          <Route index element={<PropertyAdd />} />
        </Route>
      </Route>

      <Route path="room" element={<AuthenticatedRoute roles={["TENANT"]} />}>
        <Route path="*" element={<DashboardSideBar />}>
          <Route index element={<RoomList />} />
        </Route>
      </Route>

      <Route
        path="category-area"
        element={<AuthenticatedRoute roles={["TENANT"]} />}
      >
        <Route path="*" element={<DashboardSideBar />}>
          <Route index element={<CategoryArea />} />
        </Route>
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
