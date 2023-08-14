import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import AuthLayout from "../components/layouts/AuthLayout";
import Button from "../components/buttons/Button";
import api from "../shared/api";
import { useNavigate, useParams } from "react-router-dom";
import useToken from "../shared/hooks/useToken";
import { useDispatch } from "react-redux";
import { addUser } from "../store/auth/authSlice";

const otpValidationSchema = Yup.object().shape({
  otp: Yup.array()
    .of(
      Yup.string()
        .required("Required")
        .matches(/^[0-9]$/, "Must be a number")
    )
    .required("All OTP fields are required")
    .test("length", "Must provide 4 digits", (val) => val && val.length === 4),
});

function VerifyOTP() {
  const [errorMessage, setErrorMessage] = useState("");
  const { saveToken } = useToken();
  const dispatch = useDispatch();
  const navigate = useNavigate("/");
  const { token } = useParams();
  const formik = useFormik({
    initialValues: {
      otp: Array(4).fill(""),
    },
    validationSchema: otpValidationSchema,
    onSubmit: (values) => {
      setErrorMessage("");
      const otpValue = values.otp.join("");
      console.log("Submitted OTP:", otpValue);
      api
        .patch("/auth/verification/" + token, {
          otp: otpValue,
        })
        .then(({ data }) => {
          dispatch(addUser(data));
          saveToken(data.accessToken);
          navigate(data.role === "USER" ? "/" : "/dashboard");
        })
        .catch((err) => {
          if (err.response) {
            const { message } = err.response.data;
            setErrorMessage(message);
          }
        });
    },
  });

  return (
    <AuthLayout page="otp" title={"OTP Verification"}>
      {errorMessage && (
        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
      )}
      <form onSubmit={formik.handleSubmit}>
        <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs mt-5">
          {formik.values.otp.map((_, index) => (
            <div className="w-14 h-14" key={index}>
              <input
                className="w-full shadow h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                type="tel"
                maxLength={1}
                value={formik.values.otp[index]}
                onChange={(event) => {
                  const updatedOtp = [...formik.values.otp];
                  updatedOtp[index] = event.target.value;
                  formik.setFieldValue("otp", updatedOtp);
                }}
                onBlur={formik.handleBlur}
              />
            </div>
          ))}
        </div>
        {formik.errors.otp && formik.touched.otp ? (
          <div className="mt-2 text-red-500">{formik.errors.otp}</div>
        ) : null}
        <div className="mt-5 md:mt-10">
          <p className="mb-3 text-sm">
            If you do not receive OTP code, please click{" "}
            <span className="text-primary font-bold cursor-pointer hover:text-primary/80">
              here
            </span>{" "}
            to resend OTP again.
          </p>
          <Button label={"Verify"} type="submit" />
        </div>
      </form>
    </AuthLayout>
  );
}

export default VerifyOTP;
