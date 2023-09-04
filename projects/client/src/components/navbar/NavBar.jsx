import React, { Fragment, useEffect, useState } from "react";
import ButtonWithLogo from "../buttons/ButtonWithLogo";
import { KeyIcon, UserIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";
import useToken from "../../shared/hooks/useToken";
import { Menu, Transition } from "@headlessui/react";
import { TbDoorExit } from "react-icons/tb";
import jwtDecode from "jwt-decode";

const NavBar = () => {
  const { token, removeToken } = useToken();
  const navigateTo = useNavigate();
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (token) {
      const decode = jwtDecode(token);
      setEmail(decode.email);
    }
  }, [token]);
  return (
    <>
      <div className="sticky z-30 bg-white border-b border-gray-300 max-w-7xl md:mx-auto top-0 w-full flex items-center justify-between flex-row px-10 py-3 md:px-5">
        <ButtonWithLogo
          onClick={() => {
            navigateTo("/");
          }}
          align="row"
          imageSize="h-12 w-12"
          textSize="text-xl"
          type="dark"
        />
        {token ? (
          <div className="">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                  <div className="flex flex-row items-center gap-3">
                    <div className="rounded-xl p-2 border border-primary text-primary">
                      {email}
                    </div>
                  </div>
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1 ">
                    <Menu.Item>
                      <button
                        onClick={() => {
                          navigateTo("/profile");
                        }}
                        className={`group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        <UserIcon
                          className="mr-2 h-5 w-5 group-hover:text-primary"
                          aria-hidden="true"
                        />
                        <span className="group-hover:text-primary">
                          Edit Profile
                        </span>
                      </button>
                    </Menu.Item>
                  </div>

                  <div className="px-1 py-1 ">
                    <Menu.Item>
                      <button
                        onClick={() => {
                          navigateTo("/change-password");
                        }}
                        className={`group flex w-full items-center rounded-md px-2 py-2 text-sm `}
                      >
                        <KeyIcon
                          className="mr-2 h-5 w-5 group-hover:text-primary"
                          aria-hidden="true"
                        />
                        <span className="group-hover:text-primary">
                          Change Password
                        </span>
                      </button>
                    </Menu.Item>
                  </div>
                  <div className="px-1 py-1 ">
                    <Menu.Item>
                      <button
                        onClick={() => {
                          removeToken();
                          navigateTo("/login");
                        }}
                        className={`group flex w-full items-center rounded-md px-2 py-2 text-sm `}
                      >
                        <TbDoorExit
                          className="mr-2 h-5 w-5 group-hover:text-primary"
                          aria-hidden="true"
                        />
                        <span className="group-hover:text-primary">Logout</span>
                      </button>
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        ) : (
          <div className="flex flex-row space-x-4">
            <Link to="/login" className="text-primary underline">
              Login
            </Link>
            <Link to="/register" className="text-primary underline">
              Register
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default NavBar;
