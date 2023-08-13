import React, { useState } from "react";
import AuthLayout from "../components/layouts/AuthLayout";
import LoginForm from "../components/forms/login/LoginForm";

function Login() {
  const [isUser, setIsUser] = useState(true);
  return (
    <AuthLayout
      page="login"
      isUser={isUser}
      setIsUser={setIsUser}
      title={isUser ? "Start your journey!" : "Let's manage your properties!"}
    >
      <LoginForm />
    </AuthLayout>
  );
}

export default Login;
