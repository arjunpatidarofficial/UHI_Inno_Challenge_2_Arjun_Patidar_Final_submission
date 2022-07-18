import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { delayArray } from '../components/arrays';

export const CityList = (props) => {
  let [cityArray, setCityArray] = useState([]);

  const cityDrop = props.cityDrop;
  const setCityDrop = props.setCityDrop;

  useEffect(() => {
    db.collection('city')
      .get()
      .then((res) => {
        let tempArray = [];
        res.forEach((doc) => {
          tempArray.push(doc);
        });
        setCityArray(tempArray);
      });
  }, []);

  return (
    <>
      <div>
        <button
          onClick={(e) => {
            e.preventDefault();
            setCityDrop({
              show: cityDrop.show ? false : true,
              value: cityDrop.value,
            });
          }}
          className='flex justify-between w-max rounded-md border border-gray-300 shadow-sm px-2 py-3 bg-white text-sm font-medium text-gray-700 focus:outline-none'
          id='options-menu'
          aria-expanded='true'
          aria-haspopup='true'
        >
          {cityDrop.value}
          <svg
            class='-mr-1 ml-2 h-5 w-5'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
            aria-hidden='true'
          >
            <path
              fill-rule='evenodd'
              d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
              clip-rule='evenodd'
            />
          </svg>
        </button>
      </div>
      <div
        className={`example overflow-y-scroll ${
          cityDrop.show ? '' : 'invisible'
        } origin-top-right absolute z-10 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`}
        role='menu'
        aria-orientation='vertical'
        aria-labelledby='options-menu'
      >
        <div className='py-1' role='none'>
          {cityArray.map((item) => {
            return (
              <Link
                onClick={(e) => {
                  e.preventDefault();
                  setCityDrop({
                    show: false,
                    value: item.data().name,
                  });
                }}
                className='block px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                role='menuitem'
              >
                {item.data().name}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export const DelayList = (props) => {
  const delayDrop = props.delayDrop;
  const setDelayDrop = props.setDelayDrop;
  const handleDelayTimeChange = props.handleDelayTimeChange;

  return (
    <>
      <div>
        <button
          onClick={(e) => {
            e.preventDefault();
            setDelayDrop({
              show: delayDrop.show ? false : true,
              value: delayDrop.value,
            });
          }}
          className='flex justify-between w-max rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 focus:outline-none'
          id='options-menu'
          aria-expanded='true'
          aria-haspopup='true'
          style={
            delayDrop.value === 'On time'
              ? { color: 'green' }
              : { color: 'red' }
          }
        >
          {delayDrop.value}
          <svg
            class='-mr-1 ml-2 h-5 w-5'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
            aria-hidden='true'
          >
            <path
              fill-rule='evenodd'
              d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
              clip-rule='evenodd'
            />
          </svg>
        </button>
      </div>
      <div
        className={`example overflow-y-scroll ${
          delayDrop.show ? '' : 'invisible'
        } origin-top-right fixed top-14 z-20 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`}
        role='menu'
        aria-orientation='vertical'
        aria-labelledby='options-menu'
      >
        <div className='py-1' role='none'>
          {delayArray.map((item) => {
            return (
              <Link
                onClick={async (e) => {
                  e.preventDefault();
                  await setDelayDrop({
                    show: false,
                    value: item,
                  });
                  handleDelayTimeChange(item);
                }}
                className='block px-5 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                role='menuitem'
              >
                {item}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export const GenderList = (props) => {
  const genderDrop = props.genderDrop;
  const setGenderDrop = props.setGenderDrop;
  const genderArray = ['Male', 'Female', 'Other'];
  return (
    <>
      <div>
        <button
          onClick={(e) => {
            e.preventDefault();
            setGenderDrop({
              show: genderDrop.show ? false : true,
              value: genderDrop.value,
            });
          }}
          className='flex justify-between w-max rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 focus:outline-none'
          id='options-menu'
          aria-expanded='true'
          aria-haspopup='true'
        >
          {genderDrop.value}
          <svg
            class='-mr-1 ml-2 h-5 w-5'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
            aria-hidden='true'
          >
            <path
              fill-rule='evenodd'
              d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
              clip-rule='evenodd'
            />
          </svg>
        </button>
      </div>
      <div
        className={`example overflow-y-scroll ${
          genderDrop.show ? '' : 'invisible'
        } z-20 absolute mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`}
        role='menu'
        aria-orientation='vertical'
        aria-labelledby='options-menu'
      >
        <div className='py-1' role='none'>
          {genderArray.map((item) => {
            return (
              <Link
                onClick={async (e) => {
                  e.preventDefault();
                  await setGenderDrop({
                    show: false,
                    value: item,
                  });
                }}
                className='block px-5 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                role='menuitem'
              >
                {item}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export const AvailableDropDown = (props) => {
  const availableDrop = props.availableDrop;
  const setAvailableDrop = props.setAvailableDrop;
  const availableArray = ['Available', 'Not Available'];

  let full = props.full;
  let setFull = props.setFull;
  return (
    <>
      <div>
        <button
          onClick={(e) => {
            e.preventDefault();
            setAvailableDrop({
              show: availableDrop.show ? false : true,
              value: availableDrop.value,
            });
          }}
          className='flex justify-between w-max rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 focus:outline-none'
          id='options-menu'
          aria-expanded='true'
          aria-haspopup='true'
        >
          {availableDrop.value}
          <svg
            class='-mr-1 ml-2 h-5 w-5'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
            aria-hidden='true'
          >
            <path
              fill-rule='evenodd'
              d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
              clip-rule='evenodd'
            />
          </svg>
        </button>
      </div>
      <div
        className={`example overflow-y-scroll ${
          availableDrop.show ? '' : 'invisible'
        } z-20 absolute mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`}
        role='menu'
        aria-orientation='vertical'
        aria-labelledby='options-menu'
      >
        <div className='py-1' role='none'>
          {availableArray.map((item) => {
            return (
              <Link
                onClick={async (e) => {
                  e.preventDefault();
                  await setAvailableDrop({
                    show: false,
                    value: item,
                  });
                  setFull(full ? false : true);
                }}
                className='block px-5 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                role='menuitem'
              >
                {item}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export const AppointTypeDropDown = (props) => {
  const typeDrop = props.typeDrop;
  const setTypeDrop = props.setTypeDrop;
  // const typeArray = ["In Clinic", "Telemedicine", "Both"]
  const typeArray = ['Telemedicine'];
  const setAddressView = props.setAddressView;
  return (
    <>
      <div>
        <button
          onClick={(e) => {
            e.preventDefault();
            setTypeDrop({
              show: typeDrop.show ? false : true,
              value: typeDrop.value,
            });
          }}
          className='flex justify-between w-max rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 focus:outline-none'
          id='options-menu'
          aria-expanded='true'
          aria-haspopup='true'
        >
          {typeDrop.value}
          <svg
            class='-mr-1 ml-2 h-5 w-5'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
            aria-hidden='true'
          >
            <path
              fill-rule='evenodd'
              d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
              clip-rule='evenodd'
            />
          </svg>
        </button>
      </div>
      <div
        className={`example overflow-y-scroll ${
          typeDrop.show ? '' : 'invisible'
        } z-20 absolute mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`}
        role='menu'
        aria-orientation='vertical'
        aria-labelledby='options-menu'
      >
        <div className='py-1' role='none'>
          {typeArray.map((item) => {
            return (
              <Link
                onClick={async (e) => {
                  e.preventDefault();
                  await setTypeDrop({
                    show: false,
                    value: item,
                  });
                  if (item === 'Telemedicine') setAddressView(false);
                  else setAddressView(true);
                }}
                className='block px-5 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                role='menuitem'
              >
                {item}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export const ClinicsDropDown = (props) => {
  const clinicsDrop = props.clinicsDrop;
  const setClinicsDrop = props.setClinicsDrop;
  const clinicsArray = props.clinicsArray;

  return (
    <>
      <div>
        <button
          onClick={(e) => {
            e.preventDefault();
            setClinicsDrop({
              show: clinicsDrop.show ? false : true,
              value: clinicsDrop.value,
            });
          }}
          className='flex justify-between w-max rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 focus:outline-none'
          id='options-menu'
          aria-expanded='true'
          aria-haspopup='true'
        >
          {clinicsDrop.value}
          <svg
            class='-mr-1 ml-2 h-5 w-5'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
            aria-hidden='true'
          >
            <path
              fill-rule='evenodd'
              d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
              clip-rule='evenodd'
            />
          </svg>
        </button>
      </div>
      <div
        className={`example overflow-y-scroll ${
          clinicsDrop.show ? '' : 'invisible'
        } z-20 absolute mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`}
        role='menu'
        aria-orientation='vertical'
        aria-labelledby='options-menu'
      >
        <div className='py-1' role='none'>
          {clinicsArray.map((item) => {
            return (
              <Link
                onClick={async (e) => {
                  e.preventDefault();
                  await setClinicsDrop({
                    show: false,
                    value: item,
                  });
                }}
                className='block px-5 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                role='menuitem'
              >
                {item}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};
