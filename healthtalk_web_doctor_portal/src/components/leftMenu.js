import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const Menu = (props) => {
  var activeComponent = props.activeComponent;
  let [menuState, setMenuState] = useState('invisible sm:visible');

  return (
    <div>
      <div>
        <Link
          onClick={(e) => {
            e.preventDefault();
            setMenuState('visible sm:visible');
          }}
          className={`${
            menuState === 'invisible sm:visible' ? '' : 'hidden '
          } sm:hidden absolute z-20 text-2xl mt-2 p-2`}
        >
          <i class='fas fa-bars'></i>
        </Link>
        <Link
          onClick={(e) => {
            e.preventDefault();
            setMenuState('invisible sm:visible');
          }}
          className={`${
            menuState === 'visible sm:visible' ? '' : 'hidden '
          } sm:hidden absolute z-20  text-2xl text-white p-2`}
        >
          <i class='fas fa-times'></i>
        </Link>
      </div>
      <div
        name='leftMenu'
        className={`${menuState} w-auto bg-gray-100 p-8 flex flex-col  items-center h-screen absolute sm:relative z-10 sm:z-0`}
      >
        <Link to='/' className=''>
          <div className=' flex justify-center'>
            <img src='/logo.svg' className='h-16 rounded-full shadow-md'></img>
          </div>
          <div className='font-bold hover:text-blue-400 text-2xl my-2 text-black'>
            Health<span className='text-green-500 font-semibold'>Talk</span>
          </div>
        </Link>
        <div className='text-gray-600'>
          <Link to='/docAppointments'>
            <div
              className={`${
                activeComponent === 'appointments'
                  ? 'bg-green-500 py-2 text-white'
                  : ''
              } px-4  rounded mt-7 mb-2 py-2 text-md flex justify-start items-center`}
            >
              <i class='far fa-calendar-check'></i>
              <div className='ml-4 w-max'>My Appointments</div>
            </div>
          </Link>
          <Link to='/docCalander'>
            <div
              className={`${
                activeComponent === 'calander'
                  ? 'bg-green-500 py-2 text-white'
                  : ''
              } px-4 rounded my-2 text-md py-2 flex justify-start items-center`}
            >
              <i class='far fa-calendar-alt'></i>
              <div className='ml-4'>My Calendar</div>
            </div>
          </Link>
          <Link to='/docHistory'>
            <div
              className={`${
                activeComponent === 'history'
                  ? 'bg-green-500 py-2 text-white'
                  : ''
              } my-2 px-4  rounded text-md py-2 flex justify-start items-center`}
            >
              <i className='fas fa-history'></i>
              <div className='ml-4'>My History</div>
            </div>
          </Link>
          {/* <Link to='/earnings'>
            <div
              className={`${
                activeComponent === 'earning' ? 'bg-green-600 py-2' : ''
              } px-4  rounded-full my-5 text-md flex justify-start items-center`}
            >
              <i class='fas fa-chart-line'></i>
              <div className='ml-4'>My Earning</div>
            </div>
          </Link>
          <Link to='/searchUser'>
            <div
              className={`${
                activeComponent === 'newUser' ? 'bg-green-600 py-2' : ''
              } px-4  rounded-full my-5  text-md flex justify-start items-center`}
            >
              <i class='fas fa-users'></i>
              <div className='ml-4'>Users</div>
            </div>
          </Link>
          <Link to='/camp'>
            <div
              className={`${
                activeComponent === 'camp' ? 'bg-green-600 py-2' : ''
              } px-4  rounded-full my-5  text-md flex justify-start items-center`}
            >
              <i class='fas fa-first-aid'></i>
              <div className='ml-4'>Camp</div>
            </div>
          </Link> */}
        </div>
      </div>
    </div>
  );
};
