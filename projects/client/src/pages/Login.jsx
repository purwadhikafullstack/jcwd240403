import React, { useState } from "react";
import AuthLayout from "../components/layouts/AuthLayout";
import LoginForm from "../components/forms/login/LoginForm";
import api from "../shared/api";
import { useDispatch } from "react-redux";
import { addUser } from "../store/auth/authSlice";
import useToken from "../shared/hooks/useToken";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [isUser, setIsUser] = useState(true);
  const { saveToken } = useToken();
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = (values) => {
    setErrorMessage("");
    api
      .post("/auth/login", {
        ...values,
        role: isUser ? "USER" : "TENANT",
      })
      .then(({ data }) => {
        const isRoleUser = data.role === "USER";
        if (isRoleUser === isUser) {
          dispatch(addUser(data));
          saveToken(data.accessToken);
          navigate(data.role === "USER" ? "/" : "/dashboard");
        } else {
          setErrorMessage("You are not allowed, please make sure your role");
        }
      })
      .catch((err) => {
        console.log("login err", err);
        if (err.response) {
          const { message, errors } = err.response.data;
          setErrorMessage(message ? message : errors[0].msg);
        }
      });
  };

  return (
    <AuthLayout
      page="login"
      isUser={isUser}
      setIsUser={setIsUser}
      title={isUser ? "Start your journey!" : "Let's manage your properties!"}
    >
      {errorMessage && (
        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
      )}
      <LoginForm handleLogin={handleLogin} />
    </AuthLayout>
  );
}

export default Login;
