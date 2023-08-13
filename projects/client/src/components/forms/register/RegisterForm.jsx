import React from "react";
import { classNames } from "../../../shared/utils";

function RegisterForm({ status }) {
  return (
    <div
      className={classNames(
        "space-y-4",
        status === "current" ? "block" : "hidden"
      )}
    >
      <input
        id="name"
        name="name"
        type="text"
        autoComplete="name"
        placeholder="Name"
        required
        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
      />
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="address@email.com"
        required
        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
      />

      <input
        id="phone"
        name="phone"
        type="tel"
        autoComplete="phone"
        placeholder="0812345678"
        required
        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
      />

      <input
        id="password"
        name="password"
        type="password"
        placeholder="Password"
        autoComplete="current-password"
        required
        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
      />

      <input
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        autoComplete="current-password"
        required
        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
      />
    </div>
  );
}

export default RegisterForm;
