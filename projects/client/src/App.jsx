import React from "react";
import { Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { PrivateRoute } from "./shared/router/PrivateRoute";
import Home from "./pages/Home";
import Book from "./pages/user/Book";
import Dashboard from "./pages/tenant/Dashboard";
import Login from "./pages/Login";
import MainContainer from "./components/layouts/MainContainer";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";

function App() {
  return (
    <MainContainer>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<VerifyOTP />} />
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
    </MainContainer>
  );
}

export default App;
