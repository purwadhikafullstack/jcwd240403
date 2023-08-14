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
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                className={`
                ${open ? "" : "text-opacity-90"}
                group inline-flex items-center rounded-md bg-white text-primary lg:px-3 lg:py-2 py-1 px-3 gap-3 text-base font-medium hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
              >
                <img
                  className="h-8 w-8 rounded-full bg-primary"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
                <span className="sr-only">Your profile</span>
                <span aria-hidden="true">User</span>
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute left-0 lg:left-0 lg:right-0 lg:-top-16 top-10 z-10 mt-3 w-fit max-w-sm px-4 sm:px-0 lg:max-w-3xl">
                  <div className="overflow-hidden rounded-md shadow-lg ring-1 ring-black ring-opacity-5 bg-white">
                    <button
                      onClick={onLogout}
                      className="text-black underline px-5 py-2"
                    >
                      Logout
                    </button>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  );
}

export default ProfileSection;
