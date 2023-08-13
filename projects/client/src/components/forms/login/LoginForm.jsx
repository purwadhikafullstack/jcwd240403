import React from "react";
import Button from "../../buttons/Button";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters long")
    .required("Password is required"),
});

function LoginForm() {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
      // Here you can handle form submission, like sending the data to the server.
    },
  });
  return (
    <form className="space-y-3" onSubmit={formik.handleSubmit}>
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
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
          ) : null}
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
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-end">
        <div className="text-sm leading-6">
          <button
            type="button"
            className="font-semibold text-black hover:text-black/80"
          >
            Forgot password?
          </button>
        </div>
      </div>

      <div>
        <Button label={"Sign In"} type="submit" />
      </div>
    </form>
  );
}

export default LoginForm;
