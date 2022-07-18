import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';
import { db, rdb } from '../../firebase';
import { useAuth } from '../../contexts';
import { DocNav } from './docNav';
import { Menu } from '../../components/leftMenu';
import {
  AvailableDropDown,
  AppointTypeDropDown,
  ClinicsDropDown,
} from '../../components/dropdownList';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { SingleAppointment } from './singleAppointment';

import Lottie from 'react-lottie';
var loader = require('../../components/nuvoLoader.json');

const CalanderComp = (props) => {
  let [loading, setLoading] = useState(true);
  let [loggedIn, setLoggedIn] = useState(useAuth());
  // dateArray for array of dates
  let [dateArray, setDateArray] = useState([]);
  let [activeComp, setActiveComp] = useState('dateList');
  // selectedDate for showing time slots
  let [selectedDate, setSelectedDate] = useState();
  // startDate for date picker
  let [startDate, setStartDate] = useState(new Date());
  // datePicker for visibility of date picker
  let [datePicker, setDatePicker] = useState(false);
  // appointment id for viewing booked slot details
  let [appointmentId, setAppointmentId] = useState();
  let [clinicsArray, setClinicsArray] = useState([]);

  var date = new Date();
  let dt = date.getDate().toString();
  let month = (date.getMonth() + 1).toString();
  let year = date.getFullYear().toString();
  let newDate = parseInt(
    `${year}${month.length === 2 ? month : '0' + month}${
      dt.length === 2 ? dt : '0' + dt
    }`
  );

  let days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  let months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  //console.log(newDate, dt, month, year)

  let hr = date.getHours();
  let hrString = date.getHours().toString();
  if (hr >= 12) hrString = (date.getHours() - 12).toString();

  let min = date.getMinutes().toString();

  var timeSlot;
  if (hr < 12)
    timeSlot = parseInt(
      `1${hrString.length === 1 ? '0' + hrString : hrString}${
        min.length === 1 ? '0' + min : min
      }`
    );
  else if (hr >= 12)
    timeSlot = parseInt(
      `2${hrString.length === 1 ? '0' + hrString : hrString}${
        min.length === 1 ? '0' + min : min
      }`
    );
  //console.log(hr, min, timeSlot)

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loader,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid meet',
    },
  };
  var refMain = db.collection('doctors').doc(loggedIn.currentUser.uid);
  var refDates = refMain
    .collection('dates')
    .where('dayInt', '>=', newDate)
    .orderBy('dayInt');
  //var refSlot = refDates.doc().collection('slots')

  useEffect(() => {
    let first = refDates.onSnapshot(async (snapshot) => {
      let tempArray = [];
      let docsArray = snapshot.docs;
      console.log('fetched');
      await docsArray.map(async (item) => {
        let tempObj = {
          dayInt: item.data().dayInt,
          date: item.data().date,
          activeSlot: item.data().isTrue,
          bookedSlot: item.data().isBooked,
          day: item.data().dayName,
          month: item.data().monthName,
          //slot: slot,
        };
        tempArray.push(tempObj);
      });
      //console.log(tempArray)
      setDateArray(tempArray);
      setLoading(false);
    });
  }, []);

  useEffect(async () => {
    let myClinics = loggedIn.userDetails.clinics;
    let tempArray = [];
    if (myClinics)
      for (var i = 0; i < myClinics.length; i++)
        await db
          .collection('clinics')
          .doc(`${myClinics[i]}`)
          .get()
          .then((res) => {
            console.log('fetched');
            tempArray.push(res.data().name);
          });
    setClinicsArray(tempArray);
    console.log(myClinics);
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

  const handleDateClicked = (e, index) => {
    e.preventDefault();
    //console.log(index)
    setSelectedDate(index);
    setActiveComp('slotList');
  };

  const handleAddDateClicked = (e) => {
    e.preventDefault();
    setDatePicker(true);
  };

  const handleDateSelected = async (e) => {
    e.preventDefault();
    setDatePicker(false);

    let date = startDate;
    let dt = date.getDate().toString();
    let month = (date.getMonth() + 1).toString();
    let year = date.getFullYear().toString();
    let newDate = parseInt(
      `${year}${month.length === 2 ? month : '0' + month}${
        dt.length === 2 ? dt : '0' + dt
      }`
    );
    //console.log(newDate, dt, month, year)

    await refMain
      .collection('dates')
      .doc(`${newDate}`)
      .get()
      .then(async (res) => {
        if (res.data()) sendToast('Date already added', 'info');
        else if (!res.data()) {
          const batch = db.batch();
          let slotRef = refMain
            .collection('dates')
            .doc(`${newDate}`)
            .collection('slots');
          await rdb
            .ref('calendar')
            .once('value')
            .then((result) => {
              for (let i = 1; i <= 96; i++) {
                let si =
                  i.toString().length === 1 ? '0' + i.toString() : i.toString();
                let item = result.val()[si];
                //console.log(item)
                batch.set(slotRef.doc(`${item.slotInt}`), {
                  name: item.name,
                  status: 'false',
                  slotInt: item.slotInt,
                });
              }
              //console.log(slot)
            });

          let addThis = {
            date: `${dt.length === 2 ? dt : '0' + dt}-${
              month.length === 2 ? month : '0' + month
            }-${year}`,
            dayInt: parseInt(
              `${year}${month.length === 2 ? month : '0' + month}${
                dt.length === 2 ? dt : '0' + dt
              }`
            ),
            dayName: days[date.getDay()],
            monthName: months[date.getMonth()],
            isBooked: 0,
            isFalse: 96,
            isTrue: 0,
          };
          //console.log(addThis)
          refMain
            .collection('dates')
            .doc(`${newDate}`)
            .set(addThis)
            .then(async (success) => {
              batch.commit();
              sendToast('Successfully added the date!', 'success');
            })
            .catch((err) => console.log(err));
        }
      });
  };

  const SlotList = () => {
    //console.log(selectedDate);
    let [slotArray, setSlotArray] = useState([]);
    let [popup, setPopup] = useState({
      item: {},
      show: false,
    });

    useEffect(() => {
      if (dateArray[selectedDate].dayInt === newDate)
        refMain
          .collection('dates')
          .doc(`${dateArray[selectedDate].dayInt}`)
          .collection('slots')
          .where('slotInt', '>', timeSlot)
          .onSnapshot((snap) => {
            console.log('fetched');
            setSlotArray(snap.docs);
          });
      else
        refMain
          .collection('dates')
          .doc(`${dateArray[selectedDate].dayInt}`)
          .collection('slots')
          .onSnapshot((snap) => {
            setSlotArray(snap.docs);
          });
    }, []);

    const SlotPopup = (props) => {
      let item = popup.item;
      let [full, setFull] = useState(item.status === 'true' ? true : false);
      let [addressView, setAddressView] = useState(
        item.type ? (item.type[0] === 'Telemedicine' ? false : true) : true
      );
      let [availableDrop, setAvailableDrop] = useState({
        show: false,
        value: `${item.status === 'true' ? 'Available' : 'Not Available'}`,
      });
      let [typeDrop, setTypeDrop] = useState({
        show: false,
        value: 'Telemedicine',
      });
      let [clinicsDrop, setClinicsDrop] = useState({
        show: false,
        value: item.address ? item.address : clinicsArray[0],
      });

      const handleUpdateClicked = (item, dayInt) => {
        let toAdd;
        let status = availableDrop.value;
        let type = typeDrop.value;
        let address = clinicsDrop.value;
        if (item.status !== 'booked' && status === 'Available') {
          if (type === 'Telemedicine') {
            toAdd = {
              status: 'true',
              type: ['Telemedicine'],
            };
          }

          // else if (type === 'In Clinic') {
          //   toAdd = {
          //     status: 'true',
          //     type: ['In Clinic'],
          //     address: address,
          //   };
          // } else if (type === 'Both') {
          //   toAdd = {
          //     status: 'true',
          //     type: ['Both', 'In Clinic', 'Telemedicine'],
          //     address: address,
          //   };
          // }
          if (toAdd)
            refMain
              .collection('dates')
              .doc(`${dayInt}`)
              .collection('slots')
              .doc(`${item.slotInt}`)
              .update(toAdd)
              .then((res) => {
                if (item.status === 'false')
                  refMain
                    .collection('dates')
                    .doc(`${dayInt}`)
                    .update({
                      isTrue: firebase.firestore.FieldValue.increment(1),
                      isFalse: firebase.firestore.FieldValue.increment(-1),
                    })
                    .then((res) => {
                      console.log('incre');
                    });
              })
              .catch((err) => console.log(err));
        } else if (item.status !== 'booked' && status === 'Not Available') {
          refMain
            .collection('dates')
            .doc(`${dayInt}`)
            .collection('slots')
            .doc(`${item.slotInt}`)
            .set({
              name: item.name,
              slotInt: item.slotInt,
              status: 'false',
            })
            .then((res) => {
              if (item.status === 'true')
                refMain
                  .collection('dates')
                  .doc(`${dayInt}`)
                  .update({
                    isTrue: firebase.firestore.FieldValue.increment(-1),
                    isFalse: firebase.firestore.FieldValue.increment(1),
                  })
                  .then((res) => {
                    console.log('decr');
                  });
            })
            .catch((err) => console.log(err));
        }
      };

      return (
        <div
          className={`${
            popup.show ? '' : 'hidden'
          } z-10 fixed top-1/3 sm:right-1/3 w-full sm:w-96 bg-white border-2 border-gray-100 shadow-md rounded-md p-5`}
        >
          <div className='text-base'>Slot Details</div>
          <div className='w-full h-0.5 mt-1 border-t-2 border-blue-100'></div>
          <div className='mt-3'>
            <div className='text-sm mb-2'>Slot Time</div>
            <div
              className={`${
                item.status === 'true'
                  ? 'bg-green-100 text-green-600'
                  : item.status === 'booked'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-red-100 text-red-600'
              } w-max px-3 py-1 text-base rounded-md`}
            >
              {item.name}
            </div>
          </div>
          <div className='my-3'>
            <div className='mb-2 text-sm'>Slot Status</div>
            <AvailableDropDown
              availableDrop={availableDrop}
              setAvailableDrop={setAvailableDrop}
              full={full}
              setFull={setFull}
            />
          </div>
          <div className={`${full ? '' : 'hidden'}`}>
            <div>
              <div className='mb-2 text-sm'>Appointment Type</div>
              <AppointTypeDropDown
                typeDrop={typeDrop}
                setTypeDrop={setTypeDrop}
                setAddressView={setAddressView}
              />
            </div>
            {/* <div className={`${addressView ? '' : 'hidden'} my-3`}>
              <div className='mb-2 text-sm'>Clinic Address</div>
              <ClinicsDropDown
                clinicsDrop={clinicsDrop}
                setClinicsDrop={setClinicsDrop}
                clinicsArray={clinicsArray}
              />
            </div> */}
          </div>
          <div className='mt-4 flex justify-end items-center'>
            <Link
              className='px-2 py-1 bg-gray-200 rounded text-black text-sm'
              onClick={(e) => {
                e.preventDefault();
                setPopup({
                  item: popup.item,
                  show: false,
                });
              }}
            >
              Cancel
            </Link>
            <Link
              className='px-2 py-1 ml-3 bg-green-600 rounded text-sm text-white'
              onClick={(e) => {
                e.preventDefault();
                handleUpdateClicked(item, dateArray[selectedDate].dayInt);
              }}
            >
              Update
            </Link>
          </div>
        </div>
      );
    };

    const SingleSlot = (props) => {
      var item = props.item;

      return (
        <div>
          <div
            className={`${
              item.data().status === 'true'
                ? 'text-green-600 bg-green-100'
                : item.data().status === 'booked'
                ? 'text-blue-700 bg-blue-100'
                : 'text-red-500 bg-red-100'
            } sm:w-72 w-72 rounded-md text-sm  mx-2 my-2`}
          >
            <Link
              onClick={(e) => {
                e.preventDefault();
                if (item.data().status !== 'booked') {
                  setPopup({
                    item: item.data(),
                    show: true,
                  });
                } else if (item.data().status === 'booked') {
                  setAppointmentId(item.data().appointId);
                  setActiveComp('singleAppo');
                }
              }}
              className='flex justify-between px-3 py-2'
            >
              <div>
                <div>slot time</div>
                <div
                  className={`${
                    item.data().status === 'true'
                      ? 'border-green-400 '
                      : item.data().status === 'booked'
                      ? 'border-blue-400 '
                      : 'border-red-400 '
                  } border-2 px-2 py-1 rounded-md my-2`}
                >
                  {item.data().name}
                </div>
                <div
                  className={`${
                    item.data().status === 'true' && item.data().address
                      ? 'border-green-400 border-2'
                      : item.data().status === 'booked' && item.data().address
                      ? 'border-blue-400 border-2'
                      : ''
                  } px-2 py-1 mb-1 rounded-md text-sm`}
                >
                  {item.data().address}
                </div>
              </div>
              <div
                style={{ fontSize: '18px' }}
                className={`flex items-center space-x-4  ${
                  item.data().status === 'false' ? 'invisible' : ''
                }`}
              >
                <i
                  className={`${
                    item.data().type && item.data().type[0] === 'In Clinic'
                      ? 'hidden'
                      : ''
                  } fas fa-video`}
                ></i>
                <i
                  className={`${
                    item.data().type && item.data().type[0] === 'Telemedicine'
                      ? 'hidden'
                      : ''
                  } fas fa-clinic-medical`}
                ></i>
              </div>
            </Link>
          </div>
        </div>
      );
    };

    return (
      <div className=''>
        <div className=' mx-2 sm:mx-10 flex justify-start items-center text-gray-700 text-lg sm:text-xl'>
          <div className='bg-green-100 text-green-500 w-7 h-7 flex justify-center items-center rounded-lg'>
            <i style={{ fontSize: '16px' }} class='far fa-calendar-alt'></i>
          </div>
          <div className='ml-4 text-lg'>My Calendar</div>
        </div>
        <div className='mx-2 sm:mx-10 flex items-center mt-5 space-x-3'>
          <Link
            className=' text-gray-700'
            onClick={() => setActiveComp('dateList')}
          >
            <i className='fa-solid fa-angle-left ml-1 bg-green-100 text-green-500 p-2 py-1 rounded-full'></i>
          </Link>
          <div className='sm:ml-10 text-base text-gray-600'>
            Date{' '}
            <span className='font-semibold text-green-500'>
              {dateArray[selectedDate].date}
            </span>{' '}
            Time Slots
          </div>
        </div>
        <div className='flex flex-wrap mt-3 sm:ml-10 ml-4'>
          {slotArray.map((item, index) => {
            return <SingleSlot item={item} />;
          })}
        </div>
        <SlotPopup />
      </div>
    );
  };

  const DateList = () => {
    if (loading)
      return (
        <div className='flex items-center justify-center w-10/12 absolute z-10'>
          <div className='flex items-center justify-center h-64 w-64 rounded-full'>
            <Lottie options={defaultOptions} height={350} width={350} />
          </div>
        </div>
      );

    if (dateArray.length === 0 || !dateArray)
      return (
        <div className='flex items-center justify-center sm:text-3xl text-2xl font-semibold text-gray-600'>
          No Active Slots Available
        </div>
      );
    else if (dateArray)
      return (
        <div className='flex flex-wrap justify-center sm:justify-start mt-3 px-5'>
          {dateArray.map((item, index) => {
            //console.log(item)
            return (
              <Link
                className='m-3'
                onClick={(e) => handleDateClicked(e, index)}
              >
                <div className=' sm:w-72 w-72 rounded-md border-2 border-gray-100 flex items-center justify-between  shadow-md p-3'>
                  <div>
                    <div className=' font-bold w-24 px-2 py-1 text-base  text-green-600 flex justify-start'>
                      {item.day}
                    </div>
                    <div className=' text-base text-black rounded w-max  px-2 py-1 flex justify-start'>
                      {item.date}
                    </div>
                  </div>
                  <div className='w-full text-base pr-2 flex justify-end space-x-3  text-white font-semibold'>
                    <div className='text-green-700 bg-green-100 flex justify-center items-center w-8 h-8 px-2 py-1 rounded-md'>
                      {item.activeSlot}
                    </div>
                    <div className='text-blue-700 bg-blue-100 flex justify-center items-center  w-8 h-8 px-2 py-1 rounded-md'>
                      {item.bookedSlot}
                    </div>
                    {/* <div className="text-red-700 bg-red-100 flex justify-center items-center  w-8 h-8 px-2 py-1 rounded-md">
                      09
                    </div> */}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      );
  };
  if (activeComp === 'dateList')
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
        <div className='flex justify-between mt-2'>
          <div className=' mx-2 sm:mx-10 flex justify-start items-center text-gray-700 text-lg sm:text-xl'>
            <div className='bg-green-100 text-green-500 w-7 h-7 flex justify-center items-center rounded-lg'>
              <i style={{ fontSize: '16px' }} class='far fa-calendar-alt'></i>
            </div>
            <div className='ml-4 text-lg'>My Calendar</div>
          </div>

          <div className='flex justify-end'>
            <div className=' '>
              <Link
                onClick={handleAddDateClicked}
                className={` rounded-md space-x-2 text-sm bg-green-500 text-white flex justify-center items-center px-3 mr-5 lg:mx-10 py-2 w-max`}
              >
                <i class='far fa-calendar-plus'></i>
                <div>Add Date</div>
              </Link>
              <div
                className={`${
                  datePicker ? 'visible' : 'hidden'
                } fixed top-32 sm:right-12 right-3 z-10 px-4 bg-white py-3 border-2 border-gray-100 rounded-md shadow-md`}
              >
                <div className='rounded-md text-green-600 font-semibold w-max'>
                  {days[startDate.getDay()]}
                </div>
                <div className='rounded-md  mb-2 w-max text-gray-700 py-1'>{`${startDate.getDate()} ${
                  months[date.getMonth()]
                } ${startDate.getFullYear()}`}</div>
                <DatePicker
                  className={`border-2 rounded-md  bg-white w-28 px-3 py-1`}
                  selected={startDate}
                  minDate={new Date()}
                  dateFormat='dd/MM/yyyy'
                  onChange={(date) => setStartDate(date)}
                  inline
                />
                <div className='flex justify-end space-x-3 mt-2 text-sm'>
                  <Link
                    onClick={(e) => {
                      e.preventDefault();
                      setDatePicker(false);
                    }}
                    className='bg-gray-200 px-2 py-1 text-black rounded'
                  >
                    Cancel
                  </Link>
                  <Link
                    onClick={handleDateSelected}
                    className='bg-blue-600 px-2 py-1 text-white rounded'
                  >
                    Add
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <DateList />
        </div>
      </div>
    );

  if (activeComp === 'slotList' && selectedDate + 1) {
    return <SlotList />;
  }
  if (activeComp === 'singleAppo') {
    return (
      <SingleAppointment
        slotList={(e) => {
          e.preventDefault();
          setActiveComp('slotList');
        }}
        appointmentId={appointmentId}
      />
    );
  } else return <div></div>;
};

export const Calander = () => {
  return (
    <div className=' min-w-full min-h-screen flex bg-white'>
      <Menu activeComponent={'calander'} />
      <div
        name='otherThanLeftMenu'
        className='w-full overflow-y-scroll overflow-x-hidden h-screen'
      >
        <DocNav />
        <CalanderComp />
      </div>
    </div>
  );
};
