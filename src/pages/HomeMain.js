import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";

import Home from "./Home";
import Login from "./Login";
import { loginUser } from "../actions/userSessionActions";
import { setToHome } from "../actions/feedStatusActions";

export default function HomeMain() {
  const dispatch = useDispatch();
  const [isAuth, authModify] = useState(false);
  const [tokenSet, tokenSetModify] = useState(false);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuth === false) {
      const cookies = new Cookies();
      const timerId = setInterval(() => {
        const token = cookies.get("idToken");
        if (token) {
          tokenSetModify(true);
          clearInterval(timerId);
        }
      }, 100);
    }
  }, [isAuth]);
  useEffect(() => {
    const makeUserAuthRequest = async () => {
      if (tokenSet) {
        const token = new Cookies().get("idToken");
        tokenSetModify(false);
        const res = await fetch("/googleAuth", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        const data = await res.json();
        if(!data.error)
        {
            const { firstName, lastName, email, id, tags } = data.user;
            dispatch(loginUser(firstName, lastName, email, id, tags));
            dispatch(setToHome());
            authModify(true);
        }
      }
    };
    makeUserAuthRequest();
  }, [tokenSet]);
  return isAuth === false ? <Login /> : <Home />;
}
