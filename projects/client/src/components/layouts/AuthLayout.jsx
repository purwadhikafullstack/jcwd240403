import React from "react";
import ButtonWithLogo from "../buttons/ButtonWithLogo";
import { useNavigate } from "react-router-dom";
import { classNames } from "../../shared/utils";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase/firebase";

const socialLogin = [
  {
    icon: "/assets/social/x.png",
    name: "X",
    className: "w-14 h-14",
    type: "twitter",
  },
  {
    icon: "/assets/social/facebook.png",
    name: "Facebook",
    className: "w-7 h-7",
    type: "facebook",
  },
  {
    icon: "/assets/social/google.png",
    name: "Google",
    className: "w-10 h-10",
    type: "google",
  },
];

function AuthLayout({ title, isUser, setIsUser, children, page }) {
  const navigate = useNavigate();
  const isNonRole =
    page === "otp" || page === "Forgot Password" || page === "Reset Password";

  const handleNavigate = () => {
    switch (page) {
      case "login":
        return navigate(`/register?type=${isUser ? "user" : "tenant"}`);
      default:
        return navigate("/login");
    }
  };

  const handleLoginSocial = (type) => {
    switch (type) {
      case "google":
        signInWithPopup(auth, googleProvider)
          .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            console.log("user", user);
            console.log("token", token);
          })
          .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);

            // handle error
            console.log("error", error);
            console.log("errorCode", errorCode);
            console.log("errorMessage", errorMessage);
            console.log("email", email);
            console.log("credential", credential);
          });
        break;
      default:
        break;
    }
  };

  return (
    <div className="p-3 h-screen md:flex md:justify-center">
      <div className="w-full h-full items-center justify-start md:justify-center bg-gradient-to-br from-primary to-[#ccc] shadow-md md:shadow-lg max-w-[1920px] rounded-2xl p-5 flex md:flex-row flex-col relative md:px-20">
        <div
          className={classNames(
            page === "login"
              ? "mb-5 pt-14 md:pt-0 md:mb-0 md:flex md:flex-1 md:justify-center"
              : "absolute left-5 top-2 md:top-5 md:left-5"
          )}
        >
          <ButtonWithLogo
            onClick={() => navigate("/")}
            imageSize={
              page === "login" ? "w-14 h-14" : "h-8 w-8 md:w-10 md:h-10"
            }
            textSize={page === "login" ? "text-2xl" : "text-sm md:text-xl"}
          />
        </div>

        <div
          className={classNames(
            isNonRole
              ? "hidden"
              : "absolute top-2 right-1 md:top-3 md:right-3 flex flex-row gap-2 items-center scale-90"
          )}
        >
          <span className="text-xs text-white">switch as</span>
          <button
            onClick={() => setIsUser(!isUser)}
            className="text-white bg-blue-700/60 shadow-lg w-fit px-2 py-1 rounded text-sm font-bold"
          >
            {isUser ? "Tenant" : "User"}
          </button>
        </div>

        {/* FORM */}
        <div
          className={classNames(
            "md:flex md:flex-col md:justify-center md:shrink-0 w-full md:flex-1 md:items-center justify-center"
          )}
        >
          <div
            className={classNames(
              "bg-white p-4 shadow-2xl rounded-lg w-full overflow-hidden overflow-y-auto max-h-[700px]",
              page === "login" ? "max-w-[350px]" : "mt-16 max-w-[450px]"
            )}
          >
            <p className="text-black text-lg font-semibold mb-5">{title}</p>

            {/* FORM COMPONENT */}
            {children}

            <div className={isNonRole ? "hidden" : "block"}>
              <div className="relative mt-5">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div
                  className={classNames(
                    isUser
                      ? "relative flex justify-center text-sm font-medium leading-6"
                      : "hidden"
                  )}
                >
                  <span className="bg-white px-6 text-gray-900">
                    Or continue with
                  </span>
                </div>
              </div>

              <div
                className={classNames(
                  isUser ? "mt-5 grid grid-cols-3 gap-5" : "hidden"
                )}
              >
                {socialLogin.map((item) => (
                  <button
                    key={item.name}
                    href="#"
                    onClick={() => handleLoginSocial(item.type)}
                    className="flex w-full items-center justify-center gap-3 border rounded-md bg-[#FFF] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFF]"
                  >
                    <img
                      src={item.icon}
                      alt={item.name}
                      className={item.className + "object-contain"}
                    />
                  </button>
                ))}
              </div>
            </div>
            <p
              className={classNames(
                isNonRole ? "hidden" : "pt-4 text-center text-sm text-gray-500"
              )}
            >
              {page === "login" ? `Not a member? ` : `Have an account? `}
              <button
                onClick={handleNavigate}
                className="font-semibold leading-6 text-primary hover:text-black/80"
              >
                {page === "login" ? "Register" : "Login"} here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
