import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { db, storage } from '../../firebase';
import { useAuth } from '../../contexts';
import { DocNav } from './docNav';
import { Menu } from '../../components/leftMenu';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Lottie from 'react-lottie';
import { useDispatch } from 'react-redux';
import * as actions from '../../store/action';
import { COMETCHAT_CONSTANTS } from '../../consts';
import axios from 'axios';

var loader = require('../../components/nuvoLoader.json');

const AppointmentsComp = (props) => {
  const dispatch = useDispatch();
  let [loggedIn, setLoggedIn] = useState(useAuth());
  let [appArray, setAppArray] = useState();
  let [currentComp, setCurrentComp] = useState('appoList');
  let [currentItem, setCurrentItem] = useState();
  let [loading, setLoading] = useState(true);
  let [pdfLink, setPdfLink] = useState();

  var history = useHistory();
  var storageRef = storage.ref();

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

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loader,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid meet',
    },
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

  useEffect(() => {
    const initialCredentials = async () => {
      if (!appArray) {
        const first = db
          .collection('appointment')
          .where('doctorId', '==', loggedIn.currentUser.uid)
          .where('status', '==', 'Scheduled')
          .orderBy('appointInt');
        const docSnap = await first.onSnapshot((snapshot) => {
          const lastItem = snapshot.docs[snapshot.docs.length - 1];
          //console.log(snapshot.docs[0].data());
          setAppArray(snapshot.docs);
          setLoading(false);
          // console.log(snapshot.docs)
        });
      }
    };
    return initialCredentials();
  }, []);

  const AppointmentCard = (props) => {
    var item = props.item;
    let [fetched, setFecthed] = useState();
    useEffect(() => {
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
              className='w-max text-yellow-700 bg-yellow-100 text-sm rounded  px-2 flex justify-center'
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
            if (item.data().status === 'Scheduled')
              return <AppointmentCard item={item} />;
            else return null;
          })}
        </div>
      );
  };
  const handlePaymentDone = (e) => {
    e.preventDefault();
    let ifPaid = window.confirm('Are you sure payment is complete?');
    if (ifPaid)
      db.collection('transaction')
        .doc()
        .set({
          amount: currentItem.appo.fee,
          appointId: currentItem.appId,
          createAt: new Date(),
          number: currentItem.patient.number,
          status: 'true',
          type: 'Cash',
          userId: currentItem.appo.patientId,
        })
        .then((res) => {
          db.collection('transaction')
            .where('appointId', '==', currentItem.appId)
            .get()
            .then((result) => {
              let paymentArray = [];
              result.forEach((item) => {
                paymentArray.push(item.id);
                //console.log(1, item.id);
              });
              if (paymentArray.length === 1)
                db.collection('appointment')
                  .doc(currentItem.appId)
                  .update({
                    paymentStatus: 'true',
                    paymentType: 'Cash',
                    payment: 'In Clinic',
                    paymentId: paymentArray[0],
                  })
                  .then((res) =>
                    sendToast('Successfully updated payment status', 'success')
                  );
            });
        });
  };
  if (!loggedIn.currentUser) {
    window.location.href = '/signin';
    return <div></div>;
  } else if (loggedIn.currentUser.displayName !== 'doctor') {
    window.location.href = '/patientHome';
    return <div></div>;
  } else if (
    !loggedIn.userDetails.fee ||
    !loggedIn.userDetails.number ||
    !loggedIn.userDetails.address
  ) {
    window.location.href = '/docDetails';
    return <div></div>;
  } else if (loading)
    return (
      <div className='flex items-center justify-center w-screen h-screen'>
        <div className='fixed w-screen h-screen z-50 top-1/2 right-1/2'>
          <Lottie options={defaultOptions} height={250} width={250} />
          <div className='text-black'>Please wait</div>
        </div>
      </div>
    );
  else if (!loading && currentComp === 'appoList')
    return (
      <div>
        <div>
          <div className=' mx-2 sm:mx-10 flex justify-start items-center text-gray-700 text-lg sm:text-xl'>
            <div className='bg-green-100 text-green-500 w-7 h-7 flex justify-center items-center rounded '>
              <i style={{ fontSize: '16px' }} class='far fa-calendar-check'></i>
            </div>
            <div className='ml-4 text-lg'>My Appointments</div>
          </div>
          <div>
            <AppointmentList />
          </div>
        </div>
      </div>
    );
  else if (!loading && currentComp === 'singleAppo')
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
        <div className='w-full'>
          <div className='flex sm:ml-10'>
            <div className='flex flex-col items-center sm:w-8/12 lg:w-6/12 '>
              <div className='flex justify-between items-center w-full px-2'>
                <Link
                  onClick={() => setCurrentComp('appoList')}
                  className='flex items-center text-gray-700 w-full justify-start p-5'
                >
                  <i className='fa-solid fa-angle-left ml-1 bg-green-100 text-green-500 p-2 py-1 rounded-full'></i>
                  <div className='mx-4'>Appointment details</div>
                </Link>
                <Link
                  onClick={(e) => {
                    e.preventDefault();
                    let ifPaid = window.confirm(
                      'Are you sure you have collected the payment before closing the visit?'
                    );
                    if (ifPaid) {
                      db.collection('appointment')
                        .doc(currentItem.appId)
                        .get()
                        .then((res) => {
                          if (
                            res.data() &&
                            res.data().paymentStatus === 'true'
                          ) {
                            db.collection('appointment')
                              .doc(currentItem.appId)
                              .update({
                                status: 'Complete',
                              })
                              .then((Ures) =>
                                sendToast(
                                  'Successfully completed the appointment!',
                                  'success'
                                )
                              );
                          } else if (
                            res.data() &&
                            res.data().paymentStatus === 'false'
                          ) {
                            sendToast('Payment not collected.', 'error');
                          } else sendToast('Something went wrong', 'error');
                        });
                    }
                  }}
                  className='bg-green-100 min-w-max h-8 hover:opacity-90 mt-2 text-green-500 text-base rounded-md px-3 py-1'
                >
                  Close visit
                </Link>
              </div>
              <div name='profilePic' className=' flex mt-14 sm:w-80'>
                <div className=' shadow-md rounded-full'>
                  <img
                    className='w-20 h-20 rounded-full'
                    src={
                      currentItem.patient.img
                        ? currentItem.patient.img
                        : 'man.png'
                    }
                  ></img>
                </div>
                <div className='ml-4 mt-2'>
                  <div className='font-semibold'>
                    {currentItem.patient.name}
                  </div>
                  <div className='text-base'>{currentItem.patient.number}</div>
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
                    <div className='my-2 bg-green-100 text-green-600 text-base max-w-min rounded py-0.5 px-2'>
                      ₹{currentItem.appo.fee}
                    </div>
                  </div>
                  <div className='my-3 '>
                    <div>Date:</div>
                    <div className='my-2'>{currentItem.appo.date}</div>
                  </div>
                  <div className='my-3'>
                    <div>Time Slot:</div>
                    <div className='bg-blue-100 text-blue-600 w-max rounded my-2 px-2 py-0.5'>
                      {currentItem.appo.slot}
                    </div>
                  </div>
                </div>
                <div className='flex flex-col'>
                  <div className='my-3 '>
                    <div>Status:</div>
                    <div className='my-2 max-w-min bg-yellow-100 text-yellow-500 rounded py-0.5 px-2 flex justify-center'>
                      {currentItem.appo.status}
                    </div>
                  </div>
                  <div className='my-2.5'>
                    <div className='my-2'>Type:</div>
                    <div
                      className={`my-2 w-max bg-blue-100 text-blue-600 text-base rounded py-0.5 px-2 flex justify-center`}
                    >
                      {currentItem.appo.type}
                    </div>
                    <Link
                      onClick={async (e) => {
                        e.preventDefault();

                        dispatch(
                          actions.auth(
                            loggedIn.currentUser.uid,
                            COMETCHAT_CONSTANTS.AUTH_KEY
                          )
                        );

                        let participantsArray = [];

                        if (currentItem?.appo?.patientId) {
                          participantsArray.push(
                            currentItem?.appo?.patientId.toLowerCase()
                          );
                        }

                        if (currentItem?.appo?.doctorId) {
                          participantsArray.push(
                            currentItem?.appo?.doctorId.toLowerCase()
                          );
                        }

                        if (currentItem?.appo?.subDocId) {
                          participantsArray.push(
                            currentItem?.appo?.subDocId.toLowerCase()
                          );
                        }

                        console.log(
                          currentItem?.appo?.isPrimary
                            ? currentItem?.appId?.toLowerCase()
                            : currentItem?.appo?.primaryAppointmentId.toLowerCase()
                        );

                        // Createing Group

                        try {
                          await axios({
                            method: 'post',
                            url: 'https://214419b53fb54fed.api-us.cometchat.io/v3/groups',
                            data: {
                              guid: currentItem?.appo?.isPrimary
                                ? currentItem?.appId?.toLowerCase()
                                : currentItem?.appo?.primaryAppointmentId.toLowerCase(),
                              name: currentItem?.appo?.isPrimary
                                ? loggedIn?.userDetails?.name
                                : currentItem?.appo?.primaryDocName,
                              type: 'public',
                              icon: 'https://firebasestorage.googleapis.com/v0/b/arjunpatidar-709f4.appspot.com/o/healthtalk.png?alt=media&token=af3794b5-3c96-424c-8e25-bdd213c581ba',
                            },
                            headers: {
                              Accept: 'application/json',
                              apiKey:
                                'f1de48af8c33f088e537486817f83aa72d56013f',
                            },
                          });
                        } catch (error) {}

                        // Registering Particepents
                        try {
                          await axios({
                            method: 'post',
                            url: 'https://214419b53fb54fed.api-us.cometchat.io/v3/users',
                            data: {
                              uid: currentItem?.appo?.patientId,
                              name: currentItem?.appo?.name,
                            },
                            headers: {
                              Accept: 'application/json',
                              apiKey:
                                'f1de48af8c33f088e537486817f83aa72d56013f',
                            },
                          });
                        } catch (error) {}

                        // Adding Particepents
                        try {
                          await axios({
                            method: 'post',
                            url: `https://214419b53fb54fed.api-us.cometchat.io/v3/groups/${currentItem.appId.toLowerCase()}/members`,
                            data: {
                              participants: participantsArray,
                            },
                            headers: {
                              Accept: 'application/json',
                              apiKey:
                                'f1de48af8c33f088e537486817f83aa72d56013f',
                            },
                          });
                        } catch (error) {}

                        history.push(
                          `./telemedicine/${
                            currentItem.appId
                          }/${'appointment'}/${
                            currentItem?.appo?.isPrimary
                              ? currentItem?.appId?.toLowerCase()
                              : currentItem?.appo?.primaryAppointmentId.toLowerCase()
                          }`
                        );
                      }}
                      className={`${
                        currentItem.appo.type === 'In Clinic' ? 'hidden' : ''
                      } bg-green-500 text-white rounded px-3 py-1 flex items-center w-max`}
                    >
                      <i class='fa-solid fa-phone'></i>
                      <div className='ml-2 font-semibold text-lg'>Call</div>
                    </Link>
                    <Link
                      to={`/prescribe/${currentItem.appId}/${'appointment'}`}
                      className={`${
                        currentItem.appo.type === 'Telemedicine' ? 'hidden' : ''
                      } bg-green-600 text-white rounded px-3 py-1 flex items-center w-max`}
                    >
                      Start consultation
                    </Link>
                  </div>
                  <div className='my-3 '>
                    <div>Payment:</div>
                    <div
                      className={`${
                        currentItem.appo.paymentStatus === 'true'
                          ? 'text-green-600'
                          : 'text-red-500'
                      } text-base my-2`}
                    >
                      {currentItem.appo.paymentStatus === 'true'
                        ? 'Payment done'
                        : 'Payment not done yet'}
                    </div>
                    <Link
                      onClick={handlePaymentDone}
                      className={`${
                        currentItem.appo.paymentStatus === 'true'
                          ? 'hidden'
                          : ''
                      } my-1 bg-green-500 px-3 py-1 rounded-md text-white text-base`}
                    >
                      Payment update
                    </Link>
                  </div>
                  <div className='my-1 '>
                    <div
                      className={`${
                        currentItem.appo.presCreateAt ? '' : 'hidden'
                      }`}
                    >
                      <button
                        className={` bg-green-500 text-white rounded-md px-2 py-1`}
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
      </>
    );
};

export const Appointments = () => {
  return (
    <div className=' min-w-full min-h-screen flex bg-white'>
      <Menu activeComponent={'appointments'} />
      <div
        name='otherThanLeftMenu'
        className='w-full overflow-y-scroll overflow-x-hidden h-screen'
      >
        <DocNav />
        <AppointmentsComp />
      </div>
    </div>
  );
};
