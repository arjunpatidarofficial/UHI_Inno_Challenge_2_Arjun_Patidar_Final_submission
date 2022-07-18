import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../firebase";
import { useAuth } from "../../contexts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const PatientNav = (props) => {
  let [barDiv, setBarDiv] = useState({
    appearance: "hidden",
    symbol: "bars",
  });

  const handleBarClick = (e) => {
    e.preventDefault();
    if (barDiv.appearance === "hidden")
      setBarDiv({
        appearance: "visible",
        symbol: "fa fa-times",
      });
    else if (barDiv.appearance === "visible")
      setBarDiv({
        appearance: "hidden",
        symbol: "fa fa-bars",
      });
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className=" flex bg-white shadow-md px-3 justify-between h-16 w-screen text-white text-lg overflow-x-hidden overflow-y-hidden">
        <div className=" flex items-center">
          <Link
            to="/patientHome"
            className="flex items-center justify-center w-full sm:w-max"
          >
            <img
              className=" w-12 mx-2 md:ml-10 my-2"
              src="https://firebasestorage.googleapis.com/v0/b/nuvoclinic-ad7c7.appspot.com/o/logo.svg?alt=media&token=9094262f-aa48-4d4f-91fd-db7e1704a83d"
            ></img>
            <div className="text-xl hover:opacity-80 text-black font-bold">
              Nuvocliniq
            </div>
          </Link>
        </div>
        <RightOfNav />
      </div>
    </>
  );
};

const RightOfNav = (props) => {
  let [loggedIn, setLoggedIn] = useState(useAuth());
  let [userPopup, setUserPopup] = useState("invisible");

  const sendToast = (message, type) => {
    const tostMsg = {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    };
    if (type === "error") toast.error(message, tostMsg);
    else if (type === "info") toast.info(message, tostMsg);
    else if (type === "success") toast.success(message, tostMsg);
  };

  const UserIcon = () => {
    if (loggedIn.userDetails.img)
      return (
        <img
          className="h-8 w-8 mr-5 rounded-full outline-none"
          src={loggedIn.userDetails.img}
        ></img>
      );
    else
      return (
        <div className="h-8 w-8 mr-5 rounded-full text-black">
          <i style={{ fontSize: "30px" }} class="fas fa-user-circle"></i>
        </div>
      );
  };

  const handleLogout = (e) => {
    e.preventDefault();
    auth
      .signOut()
      .then((res) => (window.location.href = "/"))
      .catch((err) => console.log("false"));
  };

  const handleUserPopupClick = (e) => {
    e.preventDefault();
    let newPopupState = userPopup === "visible" ? "invisible" : "visible";
    setUserPopup(newPopupState);
  };

  const Menu = () => {
    let [menuState, setMenuState] = useState("hidden");
    return (
      <div className="flex flex-col">
        <div className="w-full flex justify-end">
          <Link
            onClick={(e) => {
              e.preventDefault();
              setMenuState("visible");
            }}
            className={`${
              menuState === "visible" ? "hidden" : ""
            }  text-2xl p-2 text-black -mt-2`}
          >
            <img
              src="https://nuvocliniq-test.firebaseapp.com/bar.svg"
              className="w-9 h-9 bg-gray-100 rounded-full p-2"
            ></img>
          </Link>
        </div>

        <div
          name="leftMenu"
          style={{ backgroundColor: "#ffffff" }}
          className={`${menuState} w-auto  px-8 flex flex-col  items-center text-white text-base border-l-2 border-blue-100 h-screen fixed top-0 right-0 z-20`}
         >
          <div className="mt-7 text-black px-3" style={{ fontSize: "15dp" }}>
            <div className="w-full flex justify-end  ">
              <Link
                onClick={(e) => {
                  e.preventDefault();
                  setMenuState("hidden");
                }}
                className={`${
                  menuState === "visible" ? "" : "hidden"
                }  fixed z-30  text-2xl text-white p-2 -mt-6`}
              >
                <img
                  src="https://nuvocliniq-test.firebaseapp.com/close.svg"
                  className="w-8 h-8"
                ></img>
              </Link>
            </div>
            <div className="flex flex-col">
              <img
                src={
                  loggedIn.userDetails.img
                    ? loggedIn.userDetails.img
                    : "https://nuvocliniq-test.firebaseapp.com/man.png"
                }
                className="w-16 h-16 rounded-full shadow"
              ></img>
              <div className="text-black font-semibold mt-4">
                {loggedIn.userDetails.name}
              </div>
              <div className="text-black ">{loggedIn.userDetails.number}</div>
            </div>

            <Link to="/appointments">
              <div
                className={`hover:text-blue-400  mt-4 mb-3   flex justify-start items-center`}
              >
                <i className="far fa-calendar-check text-blue-700 p-1 rounded-md"></i>
                <div className="ml-2 w-max">My Appointments</div>
              </div>
            </Link>
            <Link to="/consultations">
              <div
                className={`hover:text-blue-400 my-5  flex justify-start items-center`}
              >
                <i className="fas fa-history  text-green-500  p-1 rounded-md"></i>
                <div className="ml-2">My History</div>
              </div>
            </Link>
            <Link>
              <div
                className={`hover:text-blue-400 my-5  flex justify-start items-center`}
              >
                <i className="fas fa-bell  text-blue-500 p-1 rounded-md"></i>
                <div className="ml-2">Notifications</div>
              </div>
            </Link>
            <Link to="/userProfile">
              <div
                className={`hover:text-blue-400 my-5  flex justify-start items-center`}
              >
                <i className="fas fa-user-circle  text-yellow-500 p-1 rounded-md"></i>
                <div className="ml-2">Profile</div>
              </div>
            </Link>
            <Link onClick={handleLogout}>
              <div
                className={`hover:text-blue-400 my-5  flex justify-start items-center`}
              >
                <i className="fas fa-sign-out-alt  text-red-500 p-1 rounded-md"></i>
                <div className="ml-2">Logout</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  };

  if (!loggedIn.currentUser)
    return (
      <div className="hidden sm:visible sm:flex flex-row justify-between items-center">
        <div className="mx-1">
          <Link to="/login">Sign in</Link>
        </div>
        <div className="mx-6">
          <Link
            to="/login"
            style={{ backgroundColor: "#008713" }}
            className="w-36 rounded-md py-1 px-2 font-semibold text-white text-base"
          >
            Sign up
          </Link>
        </div>
      </div>
    );
  else if (loggedIn.currentUser)
    return (
      <div className="flex justify-between items-center overflow-x-hidden overscroll-x-none">
        <div>
          <div
            name="on big screen"
            className="hidden sm:visible sm:flex flex-row justify-between items-center"
          >
            <div className="font-normal" style={{ fontSize: "15px" }}>
              <Link
                to="/appointments"
                style={{ paddingTop: "6px", paddingBottom: "6px" }}
                className="outline-none  font-medium  bg-blue-100 rounded-full px-3  text-blue-800"
              >
                My appointments
              </Link>
              <Link
                to="/consultations"
                style={{ paddingTop: "6px", paddingBottom: "6px" }}
                className="mx-4 outline-none hover:text-green-800 font-medium  px-3  bg-green-100 rounded-full  text-green-800"
              >
                My history
              </Link>
            </div>
            <div className="flex ">
              <Link className="outline-none" onClick={handleUserPopupClick}>
                <UserIcon />
              </Link>
            </div>
            <div
              name="user popup"
              className={`${userPopup} z-10 absolute text-gray-600 flex flex-col bg-white shadow top-16 right-5 py-3 px-4 border-2 rounded-md `}
            >
              <Link to="/userprofile" className="flex my-2 items-center">
                <UserIcon />
                <div className="flex flex-col justify-start -ml-2">
                  <div className="text-base font-semibold">
                    {loggedIn.userDetails.name}
                  </div>
                  <div>
                    <div className="text-sm  text-green-600">view profile</div>
                  </div>
                </div>
              </Link>
              <div
                style={{ fontSize: "15px" }}
                className="flex flex-col space-y-2"
              >
                <Link //to='/docHome'
                >
                  Notifications
                </Link>
                <Link to="/userInput">Edit profile</Link>
                <Link onClick={handleLogout}>Logout</Link>
              </div>
            </div>
          </div>
        </div>
        <div name="on mobile" className="sm:hidden">
          <Menu />
        </div>
      </div>
    );
};
