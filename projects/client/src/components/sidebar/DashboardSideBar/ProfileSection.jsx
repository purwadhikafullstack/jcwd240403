import React, { Fragment } from "react";
import useToken from "../../../shared/hooks/useToken";
import { Popover, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";

function ProfileSection() {
  const navigate = useNavigate("/");
  const { removeToken } = useToken();

  const onLogout = () => {
    removeToken();
    navigate("/login");
  };
  return (
    <div className="fixed lg:top-[92vh] lg:left-6 right-0 top-0 w-fit h-14 max-w-sm p-2">
      <div className="flex relative justify-end items-center lg:items-end lg:justify-start h-full">
        <button onClick={onLogout} className="text-white underline px-5 py-2">
          Logout
        </button>
      </div>
    </div>
  );
}

export default ProfileSection;
