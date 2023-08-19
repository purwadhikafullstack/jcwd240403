import React from "react";
import NavBar from "../navbar/NavBar";
import { Toaster, ToastIcon, resolveValue } from "react-hot-toast";
import { duration } from "moment";
import { Transition } from "@headlessui/react";



function MainContainer({ children }) {
  return (
    <div className="w-screen h-screen flex flex-col ">
      <Toaster position="top-center" toastOptions={
        { duration: 3000 }
      }>
        {(t) => (
          <Transition
            appear
            show={t.visible}
            className="transform px-6 py-3 flex bg-white rounded-md gap-2 shadow-md "
            enter="transition-all duration-200"
            enterFrom=" opacity-0 scale-90"
            enterTo="opacity-100 scale-100"
            leave="transition-all duration-200"
            leaveFrom=" opacity-100 scale-100"
            leaveTo="opacity-0 scale-0"

          >
            <ToastIcon toast={t} />
            <p>{resolveValue(t.message)}</p>
          </Transition>

        )}
      </Toaster>
      <NavBar />
      <div className="w-full">{children}</div>

    </div>
  );
}

export default MainContainer;
