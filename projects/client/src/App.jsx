import React, { useEffect } from "react";
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
import api from "./shared/api";
import useToken from "./shared/hooks/useToken";
import { useDispatch } from "react-redux";
import { addUser } from "./store/auth/authSlice";

function App() {
  const { token } = useToken();
  const dispatch = useDispatch();
  useEffect(() => {
    if (token) {
      api
        .get("/auth/loginWithToken")
        .then(({ data }) => {
          dispatch(addUser(data.data));
        })
        .catch((err) => console.log("err", err));
    }
  }, [token, dispatch]);

  return (
    <Routes>
      <Route
        path="/"
        element={<PrivateRoute path="/" roles={["USER"]} component={Home} />}
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
        path="/verify/:token"
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
        element={
          <PrivateRoute
            path="dashboard"
            roles={["TENANT"]}
            component={Dashboard}
          />
        }
      />
      <Route
        path="book"
        element={<PrivateRoute path="book" roles={["USER"]} component={Book} />}
      />
    </Routes>
  );
}

export default App;
