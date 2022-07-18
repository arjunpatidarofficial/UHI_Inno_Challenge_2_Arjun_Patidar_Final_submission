import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuth } from '../contexts';
import { Navbar } from '../components/navbar';
import { Footer } from '../components/footer';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Signin = () => {
  //console.log(useAuth())
  let [loggedIn, setLoggedIn] = useState(useAuth());
  let [forgot, setForgot] = useState(false);

  var emailRef = useRef();
  var passRef = useRef();
  var forgetMailRef = useRef();

  const handleForgotPass = (e) => {
    e.preventDefault();
    let email = forgetMailRef.current.value;
    auth
      .sendPasswordResetEmail(email)
      .then((res) => {
        sendToast(`Password reset email sent on ${email}`, 'success');
        setForgot(false);
      })
      .catch((err) => {
        console.log(err);
        sendToast('something went wrong', 'error');
      });
  };

  const sendToast = (message, type) => {
    const tostMsg = {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    };
    if (type === 'error') toast.error(message, tostMsg);
    else if (type === 'info') toast.info(message, tostMsg);
    else if (type === 'success') toast.success(message, tostMsg);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const reEmail =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var email = emailRef.current.value;
    var pass = passRef.current.value;

    if (!email || !pass)
      sendToast('Fields marked with * are important!', 'info');
    else if (!reEmail.test(String(email).toLowerCase()))
      sendToast('Enter valid Email', 'error');
    // Sign
    else {
      auth
        .signInWithEmailAndPassword(email, pass)
        .then((res) => {
          sendToast('Successfully signed in!', 'success');
        })
        .then(() => (window.location.href = '/docAppointments'))
        .catch((error) => {
          console.log(error.code, error.message);
          if (error.code === 'auth/user-not-found')
            sendToast('Email not registered ', 'error');
          else if (error.code === 'auth/wrong-password')
            sendToast('Invalid Credentials', 'error');
          else if (error.code === 'auth/too-many-requests')
            sendToast(
              'Account has been temporarily disabled due to many failed login attempts ',
              'error'
            );
        });
    }
  };
  if (loggedIn.currentUser) {
    window.location.href = '/docAppointments';
    return <div></div>;
  } else if (!loggedIn.currentUser)
    return (
      <div>
        <ToastContainer
          position='top-right'
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Navbar />
        <div
          style={{
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            width: '100%',
          }}
          className='flex flex-col md:justify-between sm:pt-14 pt-14 pb-7 h-screen bg-gray-100'
        >
          {/* <div className='hidden sm:visible md:w-6/12 h-5/6 md:flex justify-center items-center'>
            <div className='p-2'>
              <img className='p-20' src='./doctor-login.png'></img>
            </div>
          </div> */}

          <div className='flex justify-center items-center mx-5 sm:mx-0 sm:pt-0 h-full w-full '>
            <div className='bg-white shadow-xl border border-gray-200 p-5 sm:mx-14 rounded-md w-96'>
              <div name='signin' className={`${forgot ? 'hidden' : ''}`}>
                <div>
                  <div className='text-gray-600 text-2xl font-semibold my-5 flex justify-start'>
                    Doctor Login
                  </div>
                </div>
                <div>
                  <p className='items-start'>
                    Email <span className='text-red-700'>*</span>
                  </p>
                  <input
                    placeholder='Enter your email'
                    ref={emailRef}
                    className='my-4 p-3 outline-none w-full border-2 border-gray-200 rounded-md'
                  ></input>
                  <p className='items-start'>
                    Password <span className='text-red-700'>*</span>
                  </p>
                  <input
                    placeholder='Enter your password'
                    ref={passRef}
                    className='my-4 p-3 outline-none w-full border-2 border-gray-200 rounded-md'
                  ></input>
                  <Link
                    className='text-blue-500'
                    onClick={(e) => {
                      e.preventDefault();
                      setForgot(true);
                    }}
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className='sm:flex justify-between items-center'>
                  <button
                    onClick={handleSubmit}
                    className='bg-green-500 rounded py-2 px-3 my-4 text-white'
                  >
                    Login
                  </button>

                  <div className='flex justify-start'>
                    <span className='text-black '>Not a member yet?</span>
                    <Link
                      to='/signup'
                      className='text-green-500 ml-2 font-bold'
                    >
                      {' '}
                      Sign Up
                    </Link>
                  </div>
                </div>
              </div>
              <div
                name='forgot password'
                className={`${forgot ? '' : 'hidden'}`}
              >
                <div className='text-gray-600 text-2xl font-semibold my-5 flex justify-start'>
                  Forgot Password ?
                </div>
                <div className='mt-3 mb-1'>Enter your registered email</div>
                <input
                  className='mt-2 p-3 mb-4 outline-none w-full border-2 border-gray-200 rounded-md'
                  ref={forgetMailRef}
                  placeholder='Enter your email'
                ></input>
                <div className='flex flex-col'>
                  <Link
                    className='bg-green-500 w-28 rounded py-2 px-4 mt-2 mb-4 text-white'
                    onClick={handleForgotPass}
                  >
                    Send mail
                  </Link>
                  <div className='mt-8 sm:mt-0'>
                    <span className='text-black mt-2'>Remember password?</span>
                    <Link
                      className='text-green-500 ml-2 font-bold'
                      onClick={(e) => {
                        e.preventDefault();
                        setForgot(false);
                      }}
                    >
                      Sign in
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className='text-center '>
            Design and developed by Arjun Patidar & Ishan Indraniya
          </p>
          <p className='text-center text-sm'> HealthTalk -- Version 1.0.0</p>
        </div>

        {/* <Footer /> */}
      </div>
    );
};
