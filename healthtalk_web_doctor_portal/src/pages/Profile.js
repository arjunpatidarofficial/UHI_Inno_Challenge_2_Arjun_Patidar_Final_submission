import React, { useState, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
//import { auth, db, storage } from "../firebase";
//import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../contexts';
import { DocNav } from './doctor/docNav';
import { DoctorDetailsInput } from './doctor/docDetails';

import { CropperPopup } from '../components/cropper';

export const DocProfile = (props) => {
  let [loggedIn, setLoggedIn] = useState(useAuth());
  //console.log(loggedIn.userDetails.profilePic);
  var imageRef = useRef();
  var initialPic = loggedIn.userDetails.img ? loggedIn.userDetails.img : '';
  let [image, setImage] = useState(initialPic);
  let [tempImage, setTempImage] = useState();
  let [popup, setPopup] = useState(false);
  var history = useHistory();

  const handleChangeImage = (e) => {
    const image = e.target.files[0];
    setTempImage(URL.createObjectURL(image));
    setPopup(true);
  };

  if (!loggedIn.currentUser) {
    history.push('/');
    return <div></div>;
  } else if (loggedIn)
    return (
      <div>
        <CropperPopup
          open={popup}
          close={() => setPopup(false)}
          src={tempImage}
          setImage={setImage}
          uid={loggedIn.currentUser.uid}
        />

        <DocNav />

        <div className='flex justify-center'>
          <div className='flex flex-col items-center p-4 shadow-lg'>
            <Link
              to='/docAppointments'
              className='bg-green-500 rounded p-1 outline-none relative right-44'
            >
              <button className='outline-none'>Home</button>
            </Link>

            <div name='profilePic' className=' flex mt-14 sm:w-80'>
              <div className=' shadow-xl rounded-full'>
                {image !== '' ? (
                  <img className='w-28 h-28 rounded-full' src={image}></img>
                ) : (
                  <div className=' rounded-full text-black'>
                    <i
                      style={{ fontSize: '120px' }}
                      class='fas fa-user-circle'
                    ></i>
                  </div>
                )}
              </div>
              <div className='my-2 z-10 absolute ml-20 '>
                <input
                  ref={imageRef}
                  type='file'
                  onChange={handleChangeImage}
                  style={{ display: 'none' }}
                ></input>
                <Link
                  onClick={() => imageRef.current.click()}
                  className='text-white p-1 h-10 w-10 rounded-full'
                  style={{ backgroundColor: '#008713' }}
                >
                  <i className='ml-1 h-10 w-6 fas fa-pen'></i>
                </Link>
              </div>
              <div className='ml-4 mt-2'>
                <div className='font-bold text-xl'>
                  {loggedIn.userDetails.name}
                </div>
                <div>{loggedIn.userDetails.city}</div>
              </div>
            </div>

            <div className='px-3 pb-5 my-5 w-full lg:w-10/12 border-b-2  border-gray-200 flex justify-end'>
              <Link
                to='/docDetails'
                className='text-sm bg-green-500 text-white px-2 rounded'
              >
                Edit Profile
              </Link>
            </div>

            <div name='profile fields' className='flex flex-col sm:w-96 my-5'>
              <div className='my-3'>
                <div>Phone Number</div>
                <div>{loggedIn.userDetails.number}</div>
              </div>
              <div className='my-3'>
                <div>Specialisation</div>
                <div>{loggedIn.userDetails.specialist}</div>
              </div>
              <div className='my-3'>
                <div>Address</div>
                <div>{loggedIn.userDetails.address}</div>
              </div>
              <div className='my-3'>
                <div>Email</div>
                <div>{loggedIn.userDetails.email}</div>
              </div>
              <div className='my-3'>
                <div>Brief Profile</div>
                <div>{loggedIn.userDetails.profile}</div>
              </div>
              <div className='my-3'>
                <div>Fee</div>
                <div>{loggedIn.userDetails.fee}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};
