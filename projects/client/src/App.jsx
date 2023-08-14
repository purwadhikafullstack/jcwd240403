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
    <Routes>
      <Route
        path="/"
        element={
          <MainContainer>
            <Home />
          </MainContainer>
        }
      />
      <Route
        path="/login"
        element={
          <MainContainer>
            <Login />
          </MainContainer>
        }
      />
      <Route
        path="/register"
        element={
          <MainContainer>
            <Register />
          </MainContainer>
        }
      />
      <Route
        path="/otp"
        element={
          <MainContainer>
            <VerifyOTP />
          </MainContainer>
        }
      />
      <Route
        path="*"
        element={
          <MainContainer>
            <NotFound />
          </MainContainer>
        }
      />
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
