import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../shared/context/AuthContext";
import api from "../shared/api";
import { useDispatch } from "react-redux";
import { addUser, logout } from "../store/auth/authSlice";
import useToken from "../shared/hooks/useToken";

const PersistLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, login, persist } = useAuth();
  const { removeToken } = useToken();

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
          console.log("add user");
          dispatch(addUser(res.data.data));
        })
        .catch((err) => {
          console.log("keep login err", err);
          dispatch(logout());
          removeToken();
          navigate("/login");
        });
    }
  }, [isLoading, isAuthenticated, dispatch, navigate, removeToken]);

  return (
    <>{!persist ? <Outlet /> : isLoading ? <p>Loading...</p> : <Outlet />}</>
  );
};

export default PersistLogin;
