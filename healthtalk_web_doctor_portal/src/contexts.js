import React, { useState, useEffect, useContext } from "react";
import { auth, db } from "./firebase";

import Lottie from "react-lottie";
var loader = require("./components/nuvoLoader.json");

const UserContext = React.createContext();

export const useAuth = (context) => {
  return useContext(UserContext);
};

export const AuthProvider = ({ children }) => {
  let [currentUser, setCurrentUser] = useState();
  let [userDetails, setUserDetails] = useState();
  let [loading, setloading] = useState(true);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loader,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid meet",
    },
  };

  useEffect(() => {
    const subscribe = auth.onAuthStateChanged(async function (user) {
       //console.log(user.displayName, user.uid)
      if (user && user.displayName==='doctor') {
        //console.log(user.displayName, user.uid)
        const res = await db.collection("doctors").doc(user.uid).get();
        if (res.exists) {
          //console.log(res.data());
          setUserDetails(res.data());
          //console.log(user.uid,userDetails)
        } else console.log("no data....");
	  }
    else if(user && user.displayName==='patient'){
      const res = await db.collection("patients").doc(user.uid).get();
        if (res.exists) {
          //console.log(res.data());
          setUserDetails(res.data());
          //console.log(user.uid,userDetails)
        } else console.log("no patient data....");
    }
    else if(user && user.displayName==='lab provider'){
      console.log('aya')
      const res = await db.collection("labs").doc(user.uid).get();
        if (res.exists) {
          //console.log(res.data());
          setUserDetails(res.data());
          //console.log(user.uid,userDetails)
        } else console.log("no lab data....");
    }
	  setCurrentUser(user);
	  setloading(false);
    });
    return subscribe;
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center w-screen h-screen absolute z-10">
        <div className="flex flex-col items-center justify-center h-64 w-64 rounded-full">
          <Lottie options={defaultOptions} height={130} width={130} />
          <div className='-mt-10 text-sm font-normal'>Please wait</div>
        </div>
      </div>
    );

  return (
    <UserContext.Provider
      value={{ currentUser: currentUser, userDetails: userDetails }}
    >
      {!loading && children}
    </UserContext.Provider>
  );
};

//export const TokenContext = React.createContext();
