import React from "react";
import MainContainer from "../../components/layouts/MainContainer";
import * as Yup from "yup";
import { useFormik } from "formik";
import api from "../../shared/api";
import { toast } from "react-hot-toast";

const validationSchema = Yup.object({
  oldPass: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .required("Old Pass is required"),
  newPass: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .required("New Pass is required"),
  confirmPass: Yup.string()
    .oneOf([Yup.ref("newPass"), null], "Passs must match")
    .min(8, "Password must be at least 8 characters long")
    .required("Confirm Pass is required"),
});

function ChangePass() {
  const formik = useFormik({
    initialValues: {
      oldPass: "",
      newPass: "",
      confirmPass: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log("Form values", values);

      try {
        await api.patch("/profile/change-password", values);
        formik.resetForm();
        toast.success("Change password success", {
          duration: 5000,
        });
      } catch (error) {
        toast.error(`Error: ${error.response.data.message}`, {
          duration: 5000,
        });
      }
    },
  });

  return (
    <MainContainer>
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center justify-center w-full max-w-md">
          <div className="flex flex-col items-center justify-center w-full">
            <h1 className="text-3xl font-bold text-center">Change Password</h1>
            <p className="text-center text-gray-500">
              Please enter your new password
            </p>
          </div>
          <div className="flex flex-col items-center justify-center w-full mt-10">
            <form
              className="flex flex-col items-center justify-center w-full space-y-4"
              onSubmit={formik.handleSubmit}
            >
              {/* Old Pass */}
              <div className="flex flex-col items-start justify-center w-full">
                <label className="text-sm font-bold text-gray-500">
                  Old Password
                </label>
                <input
                  type="password"
                  placeholder="Old Password"
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  {...formik.getFieldProps("oldPass")}
                />
                {formik.touched.oldPass && formik.errors.oldPass ? (
                  <div className="text-red-500">{formik.errors.oldPass}</div>
                ) : null}
              </div>
              <div className="flex flex-col items-start justify-center w-full">
                <label className="text-sm font-bold text-gray-500">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  {...formik.getFieldProps("newPass")}
                />
                {formik.touched.newPass && formik.errors.newPass ? (
                  <div className="text-red-500">{formik.errors.newPass}</div>
                ) : null}
              </div>
              <div className="flex flex-col items-start justify-center w-full">
                <label className="text-sm font-bold text-gray-500">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  {...formik.getFieldProps("confirmPass")}
                />
                {formik.touched.confirmPass && formik.errors.confirmPass ? (
                  <div className="text-red-500">
                    {formik.errors.confirmPass}
                  </div>
                ) : null}
              </div>
              <div className="flex flex-col items-center justify-center w-full pt-5">
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-sm font-bold text-white bg-primary rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  Change Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainContainer>
  );
}

export default ChangePass;
