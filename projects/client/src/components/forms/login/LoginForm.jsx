import React from "react";
import Button from "../../buttons/Button";

function LoginForm() {
  return (
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
        <Button label={'Sign In'} />
      </div>
    </form>
  );
}

export default LoginForm;
