import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import { useAuth } from '../../contexts';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const DoctorDetailsInput = (props) => {
  let [loggedIn, setLoggedIn] = useState(useAuth());
  let [initialData, setInitialData] = useState({});

  var numberRef = useRef();
  var addressRef = useRef();
  var cityRef = useRef();
  var specialRef = useRef();
  var profileRef = useRef();
  var feeRef = useRef();
  var nameRef = useRef();
  var regisNumRef = useRef();

  useEffect(() => {
    db.collection('doctors')
      .doc(loggedIn.currentUser.uid)
      .get()
      .then((res) => {
        setInitialData(res.data());
        console.log(res.data());
      });
  }, []);

  const handleSubmit = (e) => {
    console.log('aya');
    e.preventDefault();
    let number = numberRef.current.value;
    let address = addressRef.current.value;
    let city = cityRef.current.value;
    let special = specialRef.current.value;
    let profile = profileRef.current.value;
    let fee = feeRef.current.value;
    let name = initialData.name; //nameRef.current.value;
    let regisNum = regisNumRef.current.value;

    if (
      !number ||
      !regisNum ||
      !address ||
      !city ||
      !profile ||
      !fee ||
      !name ||
      !special
    )
      sendToast('Fields marked with * are important', 'info');
    else {
      if (number.length !== 10) sendToast('enter 10 digit number', 'error');
      else {
        console.log('coll');
        db.collection('doctors')
          .doc(loggedIn.currentUser.uid)
          .update({
            number: `+91${number}`,
            address: address,
            city: city,
            regNumber: regisNum,
            specialist: special,
            profile: profile,
            fee: fee,
            name: name,
            verify: true,
          })
          .then((res) => {
            sendToast('successfully updated', 'success');
            window.location.href = '/docAppointments';
          });
      }
    }
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
      <div>
        <div className='p-5'>
          <Link
            className={`${
              !initialData.number || !initialData.city || !initialData.address
                ? 'hidden'
                : ''
            } `}
            to='/docAppointments'
          >
            <i className='fa fa-times ' style={{ fontSize: '30px' }}></i>
          </Link>
        </div>
        <div className='flex justify-center w-full pb-10 px-5'>
          <div className='flex flex-col md:w-1/2 shadow-lg px-3'>
            <div className='text-black font-bold text-2xl flex justify-start mb-7 mt-2'>
              <span>Doctor's Details</span>
            </div>
            <div>
              <p className='font-semibold items-start'>
                Name <span className='text-red-700'>*</span>
              </p>
              <input
                ref={nameRef}
                defaultValue={initialData.name}
                className='my-4 p-3 w-full  bg-gray-200 rounded-md'
              ></input>
            </div>
            <div>
              <p className='font-semibold items-start'>
                Number <span className='text-red-700'>*</span>
              </p>
              <div className='w-full flex items-center'>
                <div className='border-2 rounded-md p-3 mr-2 '>+91</div>
                <input
                  ref={numberRef}
                  defaultValue={
                    initialData.number ? initialData.number.slice(3, 12) : ''
                  }
                  className='my-4 p-3 bg-gray-200 rounded-md'
                ></input>
              </div>
            </div>
            <div>
              <p className='font-semibold items-start'>
                Registration number <span className='text-red-700'>*</span>
              </p>
              <input
                ref={regisNumRef}
                defaultValue={initialData.regNumber}
                className='my-4 p-3   bg-gray-200 rounded-md'
              ></input>
            </div>
            <div>
              <p className='font-semibold items-start'>
                Address <span className='text-red-700'>*</span>
              </p>
              <input
                ref={addressRef}
                defaultValue={initialData.address}
                className='my-4 p-3 w-full  bg-gray-200 rounded-md'
              ></input>
            </div>
            <div>
              <p className='font-semibold items-start'>
                City <span className='text-red-700'>*</span>
              </p>
              <input
                ref={cityRef}
                defaultValue={initialData.city}
                className='my-4 p-3   bg-gray-200 rounded-md'
              ></input>
            </div>
            <div>
              <p className='flex flex-col font-semibold items-start'>
                Specialisation
              </p>
              <select
                ref={specialRef}
                defaultValue={initialData.specialist}
                className='my-4 p-3 w-full  bg-gray-200 rounded-md'
              >
                <option>General physician</option>
                <option>Health advisor</option>
                <option>Cardiologist</option>
                <option>Audiologist</option>
                <option>Dentist</option>
                <option>Dentist</option>
                <option>ENT Specialist</option>
                <option>Gynaecologist</option>
                <option>Orthopaedic surgeon</option>
                <option>Paediatrician</option>
                <option>Psychiatrists</option>
                <option>Veterinarian</option>
                <option>Radiologist</option>
                <option>Pulmonologist</option>
                <option>Endocrinologist</option>
                <option>Oncologist</option>
                <option>Neurologist</option>
                <option>Cardiothoracic surgeon</option>
                <option>Oncologist</option>
              </select>
            </div>
            <div>
              <p className='font-semibold items-start'>
                Brief profile <span className='text-red-700'>*</span>
              </p>
              <input
                ref={profileRef}
                defaultValue={initialData.profile}
                className='my-4 p-3 w-full  bg-gray-200 rounded-md'
              ></input>
            </div>
            <div className={`${initialData.fee ? 'hidden' : ''}`}>
              <p className='my-4 font-semibold items-start'>
                Fee in ₹ <span className='text-red-700'>*</span>
              </p>
              <input
                ref={feeRef}
                defaultValue={initialData.fee}
                className={
                  'mt-4 p-3 flex flex-col font-semibold items-start bg-gray-200 border-2 rounded-md'
                }
              ></input>
            </div>
            <div className='flex justify-start'>
              <button
                onClick={handleSubmit}
                className='bg-green-500 w-4/12 rounded-md p-2 font-semibold my-7 text-white'
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
