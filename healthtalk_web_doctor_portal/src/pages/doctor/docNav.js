import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { useAuth } from '../../contexts';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { DelayList } from '../../components/dropdownList';

export const DocNav = (props) => {
  let [barDiv, setBarDiv] = useState({
    appearance: 'hidden',
    symbol: 'bars',
  });

  const handleBarClick = (e) => {
    e.preventDefault();
    if (barDiv.appearance === 'hidden')
      setBarDiv({
        appearance: 'visible',
        symbol: 'fa fa-times',
      });
    else if (barDiv.appearance === 'visible')
      setBarDiv({
        appearance: 'hidden',
        symbol: 'fa fa-bars',
      });
  };

  return (
    <>
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
      <div className=' flex flex-row h-16 overflow-x-hidden w-full justify-end text-white font-semibold text-lg'>
        <RightOfNav />
      </div>
    </>
  );
};

const RightOfNav = (props) => {
  let [loggedIn, setLoggedIn] = useState(useAuth());
  let [userPopup, setUserPopup] = useState('invisible');

  let [delayDrop, setDelayDrop] = useState({
    show: false,
    value: loggedIn.userDetails.delay,
  });
  //console.log(loggedIn.userDetails.delay, delayDrop.value);
  const sendToast = (message, type) => {
    const tostMsg = {
      position: 'bottom-right',
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

  const handleDelayTimeChange = (item) => {
    db.collection('doctors')
      .doc(loggedIn.currentUser.uid)
      .update({
        delay: item,
      })
      .then((res) => {
        sendToast('Successfully changed delay time', 'success');
        window.history.go(0);
      });
  };

  const UserIcon = () => {
    if (loggedIn.userDetails.img)
      return (
        <img
          className='h-8 w-8 mx-3 rounded-full'
          src={loggedIn.userDetails.img}
        ></img>
      );
    else
      return (
        <div className='h-8 w-8 mx-3 rounded-full text-black'>
          <i style={{ fontSize: '30px' }} class='fas fa-user-circle'></i>
        </div>
      );
  };

  const handleLogout = (e) => {
    e.preventDefault();
    auth
      .signOut()
      .then((res) => (window.location.href = '/'))
      .catch((err) => console.log('false'));
  };

  const handleUserPopupClick = (e) => {
    e.preventDefault();
    let newPopupState = userPopup === 'visible' ? 'invisible' : 'visible';
    setUserPopup(newPopupState);
  };

  if (!loggedIn.currentUser)
    return (
      <div className='hidden sm:visible sm:flex flex-row justify-between items-center'>
        <div className='mx-1'>
          <Link to='/signin'>Sign in</Link>
        </div>
        <div className='mx-6'>
          <Link
            to='/signup'
            style={{ backgroundColor: '#008713' }}
            className='w-36 rounded-md py-1 px-2 font-semibold text-white text-base'
          >
            Sign up
          </Link>
        </div>
      </div>
    );
  else if (loggedIn.currentUser)
    return (
      <div className='visible flex flex-row justify-between items-center'>
        <div className='flex items-center justify-end'>
          {/* <Link
            to='/docAppointments'
            className='text-base text-blue-600 mr-2 border-2 border-blue-100 px-2 py-1 rounded-md'
          >
            Home
          </Link> */}
          <div class='relative inline-block text-left my-2 '>
            <DelayList
              handleDelayTimeChange={handleDelayTimeChange}
              delayDrop={delayDrop}
              setDelayDrop={setDelayDrop}
            />
          </div>
          <Link className='mx-3' onClick={handleUserPopupClick}>
            <UserIcon />
          </Link>
        </div>
        <div
          className={`${userPopup} z-10 absolute text-gray-800 flex flex-col bg-white shadow top-16 right-5 py-3 px-1 border-2 rounded-md `}
        >
          <Link to='/docprofile' className='flex px-5 my-2 items-center'>
            <UserIcon />
            {/* <img
              className="w-8 h-8 mr-2 rounded-full"
              src={loggedIn.userDetails.img}
            ></img> */}
            <div className='flex flex-col justify-center'>
              <div className='h-5 text-base font-semibold'>
                {loggedIn.userDetails.name}
              </div>
              <div>
                <div
                  style={{ color: '#008713' }}
                  className=' text-sm font-light'
                >
                  view profile
                </div>
              </div>
            </div>
          </Link>
          <div className='font-normal flex flex-col text-base'>
            {/* <Link to="/docHome" className="px-5 my-2">
              Dashboard
            </Link> */}
            <Link to='/docDetails' className='px-5 my-2'>
              Edit profile
            </Link>
            <Link onClick={handleLogout} className='px-5 my-2 text-red-600'>
              Logout
            </Link>
          </div>
        </div>
      </div>
    );
};
