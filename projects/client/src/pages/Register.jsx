import React, { useState } from "react";
import AuthLayout from "../components/layouts/AuthLayout";
import { useLocation } from "react-router-dom";
import { ArrowSmallLeftIcon } from "@heroicons/react/24/solid";
import TenantAuthSteps from "../components/steps/TenantAuthSteps";
import { classNames } from "../shared/utils";
import RegisterForm from "../components/forms/register/RegisterForm";
import IdentityForm from "../components/forms/register/IdentityForm";
import Button from "../components/buttons/Button";

function Register() {
  const { search } = useLocation();
  const type = new URLSearchParams(search).get("type");

  const [isUser, setIsUser] = useState(type === "user");
  const [steps, setSteps] = useState([
    { name: "Information", status: "current" },
    { name: "Identity", status: "upcoming" },
  ]);

  const buttonText = isUser
    ? "Sign Up"
    : steps[0].status === "current"
    ? "Next"
    : "Sign Up";

  const handleNextStep = () => {
    const newSteps = [...steps];
    newSteps[0].status = "complete";
    newSteps[1].status = "current";
    setSteps(newSteps);
  };

  const handleBackStep = () => {
    const newSteps = [...steps];
    newSteps[0].status = "current";
    newSteps[1].status = "upcoming";
    setSteps(newSteps);
  };

  const handleRegister = () => {
    if (isUser) {
      // Register User
    } else if (steps[0].status === "current") {
      // Check if all fields are filled
      return handleNextStep();
    } else {
      // Register Tenant
    }
  };

  return (
    <AuthLayout
      page="register"
      isUser={isUser}
      setIsUser={setIsUser}
      title={`New ${isUser ? "User" : "Tenant"} Registration`}
    >
      <div className={isUser ? "hidden" : "block"}>
        <button
          disabled={steps[0].status === "current"}
          onClick={handleBackStep}
          className="flex flex-row items-center gap-1 mb-3 text-primary disabled:text-gray-400"
        >
          <ArrowSmallLeftIcon className="mx-auto h-5 w-5" aria-hidden="true" />
          <p className="text-sm">Back</p>
        </button>
        <TenantAuthSteps steps={steps} />
      </div>
      <div className={classNames(isUser ? "" : "mt-10")}>
        <RegisterForm status={steps[0].status} 
        isUser={isUser}
        steps={steps}
        handleRegister={handleRegister}
        />
        <IdentityForm isHidden={isUser || steps[0].status === "current"} />
        <Button
          onClick={handleRegister}
          label={buttonText}
          className={classNames("mt-5", isUser || steps[0].status === 'current' ? 'hidden' : 'block')}
        />
      </div>
    </AuthLayout>
  );
}

export default Register;
