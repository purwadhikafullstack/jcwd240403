import React, { useState } from "react";
import ButtonWithLogo from "../components/buttons/ButtonWithLogo";

const socialLogin = [
  {
    icon: "/assets/social/x.png",
    name: "X",
    className: "w-14 h-14",
  },
  {
    icon: "/assets/social/facebook.png",
    name: "Facebook",
    className: "w-7 h-7",
  },
  {
    icon: "/assets/social/google.png",
    name: "Google",
    className: "w-10 h-10",
  },
];

function Login() {
  const [isUser, setIsUser] = useState(true);

  return (
    <div className="p-5 h-screen md:flex md:justify-center">
      <div className="w-full h-full items-center justify-center bg-gradient-to-br from-primary to-[#ccc] shadow-md md:shadow-lg max-w-5xl rounded-2xl p-5 flex md:flex-row flex-col relative md:px-20">
        <div className="absolute top-2 right-1 md:top-3 md:right-3 flex flex-row gap-3 items-center scale-90">
          <span className="text-xs text-white">switch to</span>
          <button
            onClick={() => setIsUser(!isUser)}
            className="text-white bg-blue-700/60 shadow-lg w-fit px-2 py-1 rounded text-sm"
          >
            {isUser ? "Tenant" : "User"} Login
          </button>
        </div>
        <div className="mb-5 pt-14 md:pt-0 md:mb-0 md:flex md:flex-1 md:justify-center">
          <ButtonWithLogo />
        </div>

        {/* LOGIN FORM */}
        <div className="md:flex md:flex-col md:justify-center md:shrink-0 md:flex-1 md:items-center">
          <div className="bg-white p-4 shadow-2xl rounded-lg w-full max-w-[300px]">
            <p className="text-black text-lg font-semibold mb-5">
              {isUser ? "Start your journey!" : "Let's manage your properties!"}
            </p>

            <form className="space-y-3" action="#" method="POST">
              <div>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="address@email.com"
                    required
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end">
                <div className="text-sm leading-6">
                  <button className="font-semibold text-black hover:text-black/80">
                    Forgot password?
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Sign in
                </button>
              </div>
            </form>

            <div>
              <div className="relative mt-5">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-gray-200" />
                </div>
                {isUser ? (
                  <div className="relative flex justify-center text-sm font-medium leading-6">
                    <span className="bg-white px-6 text-gray-900">
                      Or continue with
                    </span>
                  </div>
                ) : null}
              </div>

              {isUser ? (
                <div className="mt-5 grid grid-cols-3 gap-5">
                  {socialLogin.map((item) => (
                    <button
                      key={item.name}
                      href="#"
                      className="flex w-full items-center justify-center gap-3 border rounded-md bg-[#FFF] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFF]"
                    >
                      <img
                        src={item.icon}
                        alt={item.name}
                        className={item.className + "object-contain"}
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <p className="mt-5 text-center text-sm text-gray-500">
              Not a member?{" "}
              <button
                href="#"
                className="font-semibold leading-6 text-primary hover:text-black/80"
              >
                Register here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
