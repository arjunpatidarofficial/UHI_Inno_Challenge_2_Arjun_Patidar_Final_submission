import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { db, storage } from '../../firebase';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const SingleAppointment = (props) => {
  var appId = props.appointmentId;
  var storageRef = storage.ref();
  var history = useHistory();

  let [appDetails, setAppDetails] = useState();
  let [patientDetails, setPatientDetails] = useState();
  let [pdfLink, setPdfLink] = useState();

  useEffect(() => {
    db.collection('appointment')
      .doc(appId)
      .get()
      .then((app) => {
        setAppDetails(app.data());

        db.collection('patients')
          .doc(`${app.data().patientId}`)
          .get()
          .then((patient) => {
            setPatientDetails(patient.data());
          });
      });
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
      .doc(appId)
      .get()
      .then((res) => {
        if (!res.data() || !res.data().presCreateAt)
          sendToast('Prescription not generated yet', 'info');
        else
          storageRef
            .child(`prescriptionPdf/${appId}.pdf`)
            .getDownloadURL()
            .then((result) => {
              setPdfLink(result);
              document.getElementById('openPdf').click();
            });
      });
  };

  const handlePaymentDone = (e) => {
    e.preventDefault();
    let ifPaid = window.confirm('Are you sure payment is complete?');
    if (ifPaid)
      db.collection('transaction')
        .doc()
        .set({
          amount: appDetails.fee,
          appointId: appId,
          createAt: new Date(),
          number: patientDetails.number,
          status: 'true',
          type: 'Cash',
          userId: appDetails.patientId,
        })
        .then((res) => {
          db.collection('transaction')
            .where('appointId', '==', appId)
            .get()
            .then((result) => {
              let paymentArray = [];
              result.forEach((item) => {
                paymentArray.push(item.id);
                //console.log(1, item.id);
              });
              if (paymentArray.length === 1)
                db.collection('appointment')
                  .doc(appId)
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

  if (appDetails && patientDetails)
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
                  onClick={props.slotList}
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
                        .doc(appId)
                        .get()
                        .then((res) => {
                          if (
                            res.data() &&
                            res.data().paymentStatus === 'true'
                          ) {
                            db.collection('appointment')
                              .doc(appId)
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
                  className={`${
                    appDetails.status === 'Complete' ? 'hidden' : ''
                  } bg-green-100 min-w-max h-8 hover:opacity-90 mt-2 text-green-500 text-base rounded-md px-3 py-1`}
                >
                  Close visit
                </Link>
              </div>
              <div name='profilePic' className=' flex mt-14 sm:w-80'>
                <div className=' shadow-md rounded-full'>
                  <img
                    className='w-20 h-20 rounded-full'
                    src={patientDetails.img ? patientDetails.img : 'man.png'}
                  ></img>
                </div>
                <div className='ml-4 mt-2'>
                  <div className='font-semibold'>{patientDetails.name}</div>
                  <div className='text-base'>{patientDetails.number}</div>
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
                      {appDetails.name}
                    </div>
                  </div>
                  <div className='my-3 '>
                    <div>Fee:</div>
                    <div className='my-2 bg-green-100 text-green-600 text-base max-w-min rounded py-0.5 px-2'>
                      ₹{appDetails.fee}
                    </div>
                  </div>
                  <div className='my-3 '>
                    <div>Date:</div>
                    <div className='my-2'>{appDetails.date}</div>
                  </div>
                  <div className='my-3'>
                    <div>Time Slot:</div>
                    <div className='bg-blue-100 text-blue-600 w-max rounded my-2 px-2 py-0.5'>
                      {appDetails.slot}
                    </div>
                  </div>
                </div>
                <div className='flex flex-col'>
                  <div className='my-3 '>
                    <div>Status:</div>
                    <div className='my-2 max-w-min bg-yellow-100 text-yellow-500 rounded py-0.5 px-2 flex justify-center'>
                      {appDetails.status}
                    </div>
                  </div>
                  <div className='my-2.5'>
                    <div className='my-2'>Type:</div>
                    <div
                      className={`my-2 w-max bg-blue-100 text-blue-600 text-base rounded py-0.5 px-2 flex justify-center`}
                    >
                      {appDetails.type}
                    </div>
                    <Link
                      onClick={(e) => {
                        e.preventDefault();
                        history.push(
                          `./telemedicine/${appId}/${'appointment'}`
                        );
                      }}
                      className={`${
                        appDetails.type === 'In Clinic' ? 'hidden' : ''
                      } bg-green-600 text-white rounded px-3 py-1 flex items-center w-max`}
                    >
                      <i class='fas fa-phone-alt'></i>
                      <div className='ml-2 font-semibold text-lg'>Call</div>
                    </Link>
                    <Link
                      to={`/prescribe/${appId}/${'appointment'}`}
                      className={`${
                        appDetails.type === 'Telemedicine' ||
                        appDetails.status === 'Complete'
                          ? 'hidden'
                          : ''
                      } bg-green-600 text-white rounded px-3 py-1 flex items-center w-max`}
                    >
                      Start consultation
                    </Link>
                  </div>
                  <div className='my-3 '>
                    <div>Payment:</div>
                    <div
                      className={`${
                        appDetails.paymentStatus === 'true'
                          ? 'text-green-600'
                          : 'text-red-500'
                      } text-base my-2`}
                    >
                      {appDetails.paymentStatus === 'true'
                        ? 'Payment done'
                        : 'Payment not done yet'}
                    </div>
                    <Link
                      onClick={handlePaymentDone}
                      className={`${
                        appDetails.paymentStatus === 'true' ? 'hidden' : ''
                      } my-1 bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md text-white text-base`}
                    >
                      Payment update
                    </Link>
                  </div>
                  <div className='my-1 '>
                    <div
                      className={`${appDetails.presCreateAt ? '' : 'hidden'}`}
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
      </>
    );
  else return <div></div>;
};
