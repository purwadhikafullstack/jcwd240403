import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { classNames } from "../../../shared/utils";
import Button from "../../buttons/Button";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  phone: Yup.string()
    .matches(
      /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
      "Phone number is not valid"
    )
    .required("Phone number is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters long")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

function RegisterForm({ status, isUser, steps, handleRegister }) {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
      // Handle form submission logic here
      handleRegister();
    },
  });

  const buttonText = isUser
    ? "Sign Up"
    : steps[0].status === "current"
    ? "Next"
    : "Sign Up";

  return (
    <div
      className={classNames(
        "space-y-4",
        status === "current" ? "block" : "hidden"
      )}
    >
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Name"
            required
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
          />
          {formik.touched.name && formik.errors.name ? (
            <span className="text-red-500 text-sm">{formik.errors.name}</span>
          ) : null}
        </div>

        <div className="space-y-2">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="address@email.com"
            required
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
          />
          {formik.touched.email && formik.errors.email ? (
            <span className="text-red-500 text-sm">{formik.errors.email}</span>
          ) : null}
        </div>

        <div className="space-y-2">
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="phone"
            placeholder="0812345678"
            required
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
          />
          {formik.touched.phone && formik.errors.phone ? (
            <span className="text-red-500 text-sm">{formik.errors.phone}</span>
          ) : null}
        </div>

        <div className="space-y-2">
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            required
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
          />
          {formik.touched.password && formik.errors.password ? (
            <span className="text-red-500 text-sm">
              {formik.errors.password}
            </span>
          ) : null}
        </div>

        <div className="space-y-2">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            autoComplete="current-password"
            required
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <span className="text-red-500 text-sm">
              {formik.errors.confirmPassword}
            </span>
          ) : null}
        </div>
        <Button
          type="submit"
          label={buttonText}
          className={classNames("mt-5")}
        />
      </form>
    </div>
  );
}

export default RegisterForm;
