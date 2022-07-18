import React, { useState, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { auth, db } from '../firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../contexts';
import { Navbar } from '../components/navbar';
import { Footer } from '../components/footer';
import axios from 'axios';

export const Signup = (props) => {
  let [loggedIn, setLoggedIn] = useState(useAuth());

  var emailRef = useRef(null);
  var passRef = useRef(null);
  var nameRef = useRef(null);
  var checkboxRef = useRef();
  var history = useHistory();

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
    //console.log(checkboxRef.current.checked)
    const reEmail =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var email = emailRef.current.value;
    var pass = passRef.current.value;
    var name = nameRef.current.value;

    if (!email || !pass || !name)
      sendToast('Fields marked with * are important!', 'info');
    else if (!reEmail.test(String(email).toLowerCase()))
      sendToast('Enter valid Email', 'error');
    // else if (!checkboxRef.current.checked)
    //   sendToast('Please accept our privacy policies', 'error');
    else {
      auth
        .createUserWithEmailAndPassword(email, pass)
        .then((res) => {
          db.collection('doctors')
            .doc(res.user.uid)
            .set({
              name: name,
              email: email,
              delay: 'On time',
              hostStatus: '00',
              img: 'https://firebasestorage.googleapis.com/v0/b/arjunpatidar-709f4.appspot.com/o/healthtalk.png?alt=media&token=af3794b5-3c96-424c-8e25-bdd213c581ba',
              verify: false,
            })
            .then((result) => {
              res.user
                .updateProfile({
                  displayName: 'doctor',
                })
                .then(async () => {
                  try {
                    console.log('res.user', res.user);
                    await axios({
                      method: 'post',
                      url: 'https://214419b53fb54fed.api-us.cometchat.io/v3/users',
                      data: {
                        uid: res.user.uid,
                        name: name,
                      },
                      headers: {
                        Accept: 'application/json',
                        apiKey: 'f1de48af8c33f088e537486817f83aa72d56013f',
                      },
                    });
                    history.push('/docDetails');
                    sendToast('Successfully created your account!', 'success');
                  } catch (error) {
                    sendToast('Please Check', 'warning');
                    console.log(error);
                  }
                });
            })
            .catch((err) => console.log(err));
        })
        .catch((error) => {
          console.log(error.code, error.message);
          if (error.code === 'auth/email-already-in-use')
            sendToast('Email already in use', 'error');
        });
    }
  };
  if (loggedIn.currentUser) {
    history.push('/');
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
          className='flex flex-col md:justify-between sm:pt-14 pt-14 pb-7 bg-gray-100 h-screen'
        >
          <div className='flex justify-center items-center w-full pt-5'>
            <div className='p-5 w-96 rounded-md bg-white shadow-xl border border-gray-200'>
              <div>
                <div className='text-black text-2xl font-semibold pb-5 flex justify-start'>
                  Doctor Signup
                </div>
              </div>
              <div className=''>
                <div className='items-start'>
                  Name <span className='text-red-700 ml-1'>*</span>
                </div>
                <input
                  placeholder='Enter your name'
                  ref={nameRef}
                  className='my-4 p-3 outline-none w-full border-2 border-gray-200 rounded-md'
                ></input>
              </div>
              <div>
                <p className=' items-start'>
                  Email <span className='ml-1 text-red-700'>*</span>
                </p>
                <input
                  placeholder='Enter your email'
                  ref={emailRef}
                  className='my-4 p-3 outline-none w-full border-2 border-gray-200 rounded-md'
                ></input>
                <p className='items-start'>
                  Password <span className='text-red-700 ml-1'>*</span>
                </p>
                <input
                  placeholder='Enter password'
                  ref={passRef}
                  className='my-4 p-3 outline-none w-full border-2 border-gray-200 rounded-md'
                ></input>
              </div>

              <div className='sm:flex justify-between items-center'>
                <button
                  onClick={handleSubmit}
                  className='bg-green-500 rounded px-4 py-2 mt-2 mb-4 text-white'
                >
                  Create Account
                </button>
              </div>

              <div className='flex justify-start'>
                <span className='text-black'>Already a member?</span>
                <Link to='/signin' className='text-green-500 ml-2 font-bold'>
                  {' '}
                  Sign In
                </Link>
              </div>
            </div>
          </div>

          <div>
            <p className='text-center '>
              Design and developed by Arjun Patidar & Ishan Indraniya
            </p>
            <p className='text-center text-sm'> HealthTalk -- Version 1.0.0</p>
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    );
};
