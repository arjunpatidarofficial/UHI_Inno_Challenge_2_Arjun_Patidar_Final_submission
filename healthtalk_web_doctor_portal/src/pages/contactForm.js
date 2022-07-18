import React, { useRef } from "react";
import { Link } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { db } from "../firebase";

export const Contact = (props) => {
  var emailRef = useRef();
  var nameRef = useRef();
  var numberRef = useRef();
  var messageRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    let name = nameRef.current.value;
    let email = emailRef.current.value;
    let number = numberRef.current.value;
    let message = messageRef.current.value;

    if (!email || !name || !number || !message) {
      sendToast("all fields are mandatory", "info");
    } else {
      const reEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (number.length !== 10) sendToast("enter 10 digits number", "error");
      else if (!reEmail.test(String(email).toLowerCase()))
        sendToast("Enter valid Email", "error");
      else {
        db.collection("contactUs")
          .add({
            email: email,
            name: name,
            number: number,
            message: message,
          })
          .then(() => sendToast("successfully submited", "success"));
      }
    }
  };

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
      <div className="sm:flex justify-center py-5  bg-gray-100 h-screen">
        <div className='w-max '>
        <Link to ="/"
          className="bg-white rounded-full border-2 m-4 px-3 py-1 flex items-center">
        <i className="fas fa-times text-xl"></i>
      </Link>
        </div>
        <div className="md:w-6/12 m-5 mb-0 p-5  rounded-md shadow-md bg-white">
          <div className="flex flex-col justify-center items-center">
            <div className="m-1 min-w-max text-3xl font-semibold text-gray-700">
              Contact Us
            </div>
          </div>

          <div className="my-5 border-b-2 w-full h-1 border-gray-100"></div>
          <div>
            <div>Full Name</div>
            <input
              ref={nameRef}
              className="border my-3 py-1.5 w-full px-3 rounded-md"
              type="text"
            ></input>
          </div>
          <div>
            <div>Email Address</div>
            <input
              ref={emailRef}
              className="border my-3 py-1.5 w-full px-3 rounded-md"
              type="text"
            ></input>
          </div>
          <div>
            <div>Phone Number</div>
            <input
              ref={numberRef}
              className="border my-3 py-1.5 w-full px-3 rounded-md"
              type="text"
            ></input>
          </div>
          <div>
            <div>Your Message</div>
            <textarea
              ref={messageRef}
              className="border my-3 py-1.5 h-24 w-full px-3 rounded-md"
              type="text"
            ></textarea>
          </div>
          <div className='my-3'>
          <Link
            onClick={handleSubmit}
            className="bg-blue-800 rounded px-5 py-2 text-white"
          >
            Submit
          </Link>
          </div>
        </div>
      </div>
    </>
  );
};
