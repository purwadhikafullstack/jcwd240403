import React from "react";

function MainContainer({ children }) {
  return (
    <div className="w-screen flex justify-center ">
      <div className="max-w-screen-2xl w-full">{children}</div>
    </div>
  );
}

export default MainContainer;
