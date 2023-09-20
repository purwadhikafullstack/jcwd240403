import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../shared/context/AuthContext";
import api from "../shared/api";
import { useDispatch } from "react-redux";
import { addUser } from "../store/auth/authSlice";

const PersistLogin = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, login, persist } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const verifyStoredToken = () => {
      const storedToken = localStorage.getItem("token");

      if (storedToken && persist) {
        login(storedToken);
      }

      if (isMounted) {
        setIsLoading(false);
      }
    };

    if (!isAuthenticated && persist) {
      verifyStoredToken();
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, persist, login]);

  useEffect(() => {
    // get user data
    if (isAuthenticated) {
      api
        .get("/auth/keep-login")
        .then((res) => {
          dispatch(addUser(res.data.data));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [isLoading, isAuthenticated, dispatch]);

  return (
    <>{!persist ? <Outlet /> : isLoading ? <p>Loading...</p> : <Outlet />}</>
  );
};

export default PersistLogin;
