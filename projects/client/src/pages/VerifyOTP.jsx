import React, { useState } from "react";
import AuthLayout from "../components/layouts/AuthLayout";
import Button from "../components/buttons/Button";

function VerifyOTP() {
  const [otp, setOtp] = useState([
    { id: 1, value: "" },
    { id: 2, value: "" },
    { id: 3, value: "" },
    { id: 4, value: "" },
  ]);

  return (
    <AuthLayout page="otp" title={"OTP Verification"}>
      <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs mt-5">
        {otp.map((otp) => (
          <div className="w-14 h-14" key={otp.id}>
            <input
              className="w-full shadow h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
              type="tel"
              maxLength={1}
              min={1}
              onKeyDown={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
            />
          </div>
        ))}
      </div>
      <div className="mt-5 md:mt-10">
        <p className="mb-3 text-sm">
          If you do not receive OTP code, please click{" "}
          <span className="text-primary font-bold cursor-pointer hover:text-primary/80">here</span> to
          resend OTP again.
        </p>
        <Button label={"Verify"} />
      </div>
    </AuthLayout>
  );
}

export default VerifyOTP;
