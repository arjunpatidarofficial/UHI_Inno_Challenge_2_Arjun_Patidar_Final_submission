import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, storage } from '../../firebase';
import { useAuth } from '../../contexts';
import { DocNav } from './docNav';
import { Menu } from '../../components/leftMenu';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HistoryComp = (props) => {
  let [loggedIn, setLoggedIn] = useState(useAuth());
  let [appArray, setAppArray] = useState();
  let [currentComp, setCurrentComp] = useState('appoList');
  let [currentItem, setCurrentItem] = useState();
  let [pdfLink, setPdfLink] = useState();

  var storageRef = storage.ref();

  useEffect(() => {
    const initialCredentials = async () => {
      if (!appArray) {
        const first = db
          .collection('appointment')
          .where('doctorId', '==', loggedIn.currentUser.uid)
          .where('status', '==', 'Complete')
          .orderBy('appointInt');
        const docSnap = await first.onSnapshot((snapshot) => {
          const lastItem = snapshot.docs[snapshot.docs.length - 1];
          //console.log(snapshot.docs[0].data());
          setAppArray(snapshot.docs);
          // console.log(snapshot.docs)
        });
      }
    };
    return initialCredentials();
  }, []);

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

  const handleViewPdf = (e) => {
    e.preventDefault();

    db.collection('appointment')
      .doc(currentItem.appId)
      .get()
      .then((res) => {
        if (!res.data() || !res.data().presCreateAt)
          sendToast('Prescription not generated yet', 'info');
        else
          storageRef
            .child(`prescriptionPdf/${currentItem.appId}.pdf`)
            .getDownloadURL()
            .then((result) => {
              setPdfLink(result);
              document.getElementById('openPdf').click();
            });
      });
  };

  const AppointmentCard = (props) => {
    var item = props.item;
    let [fetched, setFecthed] = useState();
    useEffect(() => {
      //console.log(props.item.data().patientId);
      db.collection('patients')
        .doc(item.data().patientId)
        .get()
        .then((res) => {
          let data = res.data();
          setFecthed(data);
        });
    }, []);

    const handleSingleAppointment = (e) => {
      e.preventDefault();
      let data = {
        appId: item.id,
        appo: item.data(),
        patient: fetched,
      };
      //console.log(item.data())
      setCurrentItem(data);
      setCurrentComp('singleAppo');
    };

    if (!fetched) return <div></div>;
    else if (fetched)
      return (
        <Link
          onClick={handleSingleAppointment}
          className='rounded-md border-2 border-gray-100 shadow-md m-1 sm:m-3 pb-2'
        >
          <div className='w-52 sm:w-72 p-3'>
            <div className='sm:flex  w-max sm:mr-5 ml-20 sm:ml-0'>
              <img
                className=' w-10 h-10 rounded-full mr-3'
                src={fetched.img ? fetched.img : 'man.png'}
              ></img>

              <div className='flex flex-col justify-center w-60 '>
                <div className='font-semibold w-max max-w-full text-base'>
                  {fetched.name}
                </div>
                <div className='text-sm'>{fetched.number}</div>
              </div>
            </div>
          </div>
          <div className='flex px-3 my-1'>
            <div
              style={{ paddingBottom: '2px', paddingTop: '2px' }}
              className=' sm:mr-5 mr-2 text-green-700 px-2 bg-green-100 text-sm rounded w-max'
            >
              {item.data().date}
            </div>
            <div
              style={{ paddingBottom: '2px', paddingTop: '2px' }}
              className='text-blue-700 w-max rounded  px-2 text-sm bg-blue-100'
            >
              {item.data().slot}
            </div>
          </div>
          <div className='flex px-3 my-2'>
            <div
              style={{ paddingBottom: '2px', paddingTop: '2px' }}
              className='  max-w-min text-yellow-700 bg-yellow-100 text-sm rounded  px-2 flex justify-center'
            >
              {item.data().status}
            </div>
            <div
              style={{ paddingBottom: '2px', paddingTop: '2px' }}
              className='mx-6  w-max text-indigo-700 bg-indigo-100 text-sm rounded  px-2 flex justify-center'
            >
              {item.data().type}
            </div>
          </div>
        </Link>
      );
  };
  const AppointmentList = (props) => {
    if (!appArray || appArray.length === 0)
      return (
        <div className='w-full h-96 mt-20 flex justify-center items-center'>
          <div className='flex flex-col items-center'>
            <img className='w-56' src='empty.svg'></img>
            <div className='flex justify-center w-max border-2 py-1 px-2 items-center text-base mt-5 text-gray-800'>
              No appointment scheduled
            </div>
          </div>
        </div>
      );
    else if (appArray)
      return (
        <div className='flex flex-wrap justify-start mt-3 sm:px-8 px-2 py-2'>
          {appArray.map((item) => {
            if (item.data().status === 'Complete')
              return <AppointmentCard item={item} />;
            else return null;
          })}
        </div>
      );
  };

  if (currentComp === 'appoList')
    return (
      <div>
        <div>
          <div className=' mx-2 sm:mx-10 flex justify-start items-center text-gray-700 text-lg sm:text-xl'>
            <div className='bg-green-100 text-green-500 w-7 h-7 flex justify-center items-center rounded-lg'>
              <i style={{ fontSize: '16px' }} class='fas fa-history'></i>
            </div>
            <div className='ml-4 text-lg'>My History</div>
          </div>
          <div>
            <AppointmentList />
          </div>
        </div>
      </div>
    );
  else if (currentComp === 'singleAppo')
    return (
      <div className='w-full'>
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
        <div className='flex justify-center'>
          <div className='flex flex-col items-center sm:w-8/12 lg:w-6/12 sm:shadow-md'>
            <Link
              onClick={() => setCurrentComp('appoList')}
              className='flex items-center text-blue-600 w-full justify-start p-5'
            >
              <i class='fas fa-chevron-left font-semibold text-lg'></i>
              <div className='mx-2'>Back</div>
            </Link>
            <div name='profilePic' className=' flex mt-14 sm:w-80'>
              <div className=' shadow-md rounded-full'>
                <img
                  className='w-28 h-28 rounded-full'
                  src={
                    currentItem.patient.img
                      ? currentItem.patient.img
                      : 'man.png'
                  }
                ></img>
              </div>
              <div className='ml-4 mt-2'>
                <div className='font-bold text-xl'>
                  {currentItem.patient.name}
                </div>
                <div>{currentItem.patient.number}</div>
              </div>
            </div>
            <div className='px-3 pb-5 my-5 w-full lg:w-10/12 border-b-2  border-gray-200 flex justify-end'></div>
            <div
              name='profile fields'
              className='sm:flex my-5 justify-around w-full px-5'
            >
              <div className='flex flex-col '>
                <div className='my-3 '>
                  <div>Patient Name:</div>
                  <div className='my-2 font-semibold text'>
                    {currentItem.appo.name}
                  </div>
                </div>
                <div className='my-3 '>
                  <div>Fee:</div>
                  <div className='my-2 bg-green-100 text-green-600  max-w-min rounded py-0.5 px-2'>
                    ₹{currentItem.appo.fee}
                  </div>
                </div>
                <div className='my-3 '>
                  <div>Date:</div>
                  <div className='my-2'>{currentItem.appo.date}</div>
                </div>
                <div className='my-3'>
                  <div>Time Slot:</div>
                  <div className='bg-blue-100 text-blue-600 text-base w-max rounded my-2 px-2 py-0.5'>
                    {currentItem.appo.slot}
                  </div>
                </div>
              </div>
              <div className='flex flex-col'>
                <div className='my-3 '>
                  <div>Status:</div>
                  <div className='my-2 max-w-min bg-yellow-100 text-yellow-500 text-base rounded py-0.5 px-2 flex justify-center'>
                    {currentItem.appo.status}
                  </div>
                </div>
                <div className='my-2.5'>
                  <div className='my-2'>Type:</div>
                  <div className='my-2 w-max bg-blue-100 text-blue-600 text-base rounded py-0.5 px-2 flex justify-center'>
                    {currentItem.appo.type}
                  </div>
                </div>
                <div className='my-3 '>
                  <div>Payment:</div>
                  <div
                    className={`${
                      currentItem.appo.paymentStatus === 'true'
                        ? 'text-green-400'
                        : 'text-red-500'
                    } font-semibold my-2`}
                  >
                    {currentItem.appo.paymentStatus === 'true'
                      ? 'Payment done'
                      : 'Payment not done yet'}
                  </div>
                </div>
                <div className='my-1 '>
                  <div
                    className={`${
                      currentItem.appo.presCreateAt ? '' : 'hidden'
                    }`}
                  >
                    <button
                      className={` bg-blue-500 hover:bg-blue-600 text-white rounded-md px-2 py-1`}
                      onClick={handleViewPdf}
                    >
                      View Prescription
                    </button>
                    <a href={pdfLink} target='_blank' id='openPdf'></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export const History = () => {
  return (
    <div className=' min-w-full min-h-screen flex bg-white'>
      <Menu activeComponent={'history'} />
      <div
        name='otherThanLeftMenu'
        className='w-full overflow-y-scroll overflow-x-hidden h-screen'
      >
        <DocNav />
        <HistoryComp />
      </div>
    </div>
  );
};
