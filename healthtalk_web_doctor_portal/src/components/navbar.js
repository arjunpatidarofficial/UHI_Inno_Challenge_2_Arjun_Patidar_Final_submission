import React, { useState } from 'react';
import { Link } from 'react-router-dom';
//import { auth } from "../firebase";
//import { useAuth } from "../contexts";

export const Navbar = (props) => {
  const Menu = () => {
    let [menuState, setMenuState] = useState('hidden');
    return (
      <div className='flex flex-col'>
        <div className='w-full flex justify-end'>
          <Link
            onClick={(e) => {
              e.preventDefault();
              setMenuState('visible');
            }}
            className={`${
              menuState === 'visible' ? 'hidden' : ''
            } text-2xl mr-3 text-black`}
          >
            <img
              src='https://nuvocliniq-test.firebaseapp.com/bar.svg'
              className='w-9 h-9 bg-gray-100 rounded-full p-2'
            ></img>
          </Link>
        </div>
        <div
          name='leftMenu'
          style={{ backgroundColor: '#ffffff', position: 'fixed', zIndex: 3 }}
          className={`${menuState} w-auto flex flex-col  items-center text-white text-base border-l-2 border-blue-100 h-screen fixed top-0 right-0 `}
        >
          <div className='w-full flex justify-end mr-7 mt-5'>
            <Link
              onClick={(e) => {
                e.preventDefault();
                setMenuState('hidden');
              }}
              className={`${
                menuState === 'visible' ? '' : 'hidden'
              } text-2xl text-white`}
            >
              <img
                src='https://nuvocliniq-test.firebaseapp.com/close.svg'
                className='w-8 h-8'
              ></img>
            </Link>
          </div>
          <div className=' mt-24 text-blue-600 px-10 space-y-3'>
            <div>
              <Link to='/login' className=' w-max'>
                For Patients
              </Link>
            </div>
            <div>
              <Link to='/signin' className=''>
                For Doctors
              </Link>
            </div>
            <div>
              <Link to='/form' className=''>
                Covid-19
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='bg-white shadow-sm fixed flex justify-between w-full items-center text-gray-800 overflow-x-hidden '>
      <Link to='/' className='flex items-center justify-start w-max sm:w-max'>
        <img
          className='w-12 ml-5 mr-2 md:ml-10 my-2 rounded-full shadow-md'
          src='/logo.svg'
        ></img>
        <div className='text-xl font-bold hover:opacity-80'>
          Health<span className='text-green-500 font-semibold'>Talk</span>
        </div>
      </Link>
      <div
        name='on big screen'
        style={{ fontSize: '15px' }}
        className='sm:flex flex-wrap hidden sm:visible font-medium px-5 items-center justify-around w-full sm:w-max'
      >
        {/* <Link
          style={{ paddingTop: '6px', paddingBottom: '6px' }}
          className=' hover:opacity-80 text-blue-800 bg-blue-100 rounded-full md:px-3 px-2'
          to='/form'
        >
          <span className='mr-2'>
            <i className='fas fa-virus text-blue-500'></i>
          </span>
          Covid-19
        </Link>
        <Link
          to='/login'
          className='mx-4 hover:opacity-80 text-green-800 hover:text-green-800'
        >
          For Patients
        </Link>
        <Link
          to='/signin'
          className='hover:opacity-80 sm:mr-3 w-max text-blue-600 hover:text-blue-800'
        >
          For Doctors
        </Link> */}
      </div>
      <div name='on mobile' className='sm:hidden mx-2'>
        <Menu />
      </div>
    </div>
  );
};
