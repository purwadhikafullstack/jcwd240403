import React from "react";
import { classNames } from "../../shared/utils";

function ButtonWithLogo({ imageSize = "w-14 h-14", textSize = "text-2xl" }) {
  return (
    <div className={classNames("flex items-center flex-col justify-center")}>
      <img
        alt="logo"
        src={"/assets/logo_white.png"}
        className={classNames("object-contain", imageSize)}
      />
      <span className={classNames("text-white font-brand", textSize)}>
        innsight
      </span>
    </div>
  );
}

export default ButtonWithLogo;
