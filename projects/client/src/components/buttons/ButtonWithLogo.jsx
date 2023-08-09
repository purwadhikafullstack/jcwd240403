import React from "react";

function ButtonWithLogo() {
  return (
    <div className="flex flex-col items-center justify-center">
      <img
        alt="logo"
        src={"/assets/logo_white.png"}
        className="w-14 h-14 object-contain"
      />
      <span className="text-white text-2xl font-brand">innsight</span>
    </div>
  );
}

export default ButtonWithLogo;
