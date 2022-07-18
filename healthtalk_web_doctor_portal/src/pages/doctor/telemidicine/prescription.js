import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { db, storage } from '../../../firebase';
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { RxNameSuggest, TestSuggest } from '../suggestion';

import Lottie from 'react-lottie';
var loader = require('../../../components/nuvoLoader.json');

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

export const Prescription = (props) => {
  let [activeComponent, setActiveComponent] = useState('generalInfo');

  let params = useParams();
  let history = useHistory();

  const ActiveComponent = () => {
    if (activeComponent === 'generalInfo')
      return <GeneralInfo appId={params.appId} />;
    else if (activeComponent === 'rx') return <Rx appId={params.appId} />;
    else if (activeComponent === 'nextReview')
      return <NextReview appId={params.appId} />;
  };

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
      <div className='w-full flex justify-center mt-5  text-lg text-gray-600 '>
        <div className='sm:flex sm:rounded-full sm:shadow-lg  sm:border-2 py-1 px-3'>
          <div className='w-max px-5 py-1 '>
            <Link
              onClick={(e) => {
                e.preventDefault();
                setActiveComponent('generalInfo');
              }}
              className={`${
                activeComponent === 'generalInfo'
                  ? 'text-green-500 font-semibold'
                  : null
              } flex w-max items-center hover:text-green-500`}
            >
              <i class='far fa-calendar-check'></i>
              <div className=' pl-2'>General Info</div>
            </Link>
          </div>
          <div className='w-max px-5 py-1 '>
            <Link
              className={`${
                activeComponent === 'rx' ? 'text-green-500 font-semibold' : null
              } flex w-max items-center hover:text-green-500`}
              onClick={(e) => {
                e.preventDefault();
                setActiveComponent('rx');
              }}
            >
              <i class='far fa-calendar-alt'></i>
              <div className='pl-2'>Rx</div>
            </Link>
          </div>
          <div className='w-max px-5 py-1 '>
            <Link
              className={`${
                activeComponent === 'nextReview'
                  ? 'text-green-500 font-semibold'
                  : null
              } flex w-max items-center hover:text-green-500`}
              onClick={(e) => {
                e.preventDefault();
                setActiveComponent('nextReview');
              }}
            >
              {' '}
              <i class='fas fa-history'></i>
              <div className='pl-2'>Next Review</div>
            </Link>
          </div>
        </div>
      </div>
      <ActiveComponent />
    </div>
  );
};

const GeneralInfo = (props) => {
  let [appInfo, setAppInfo] = useState();
  let [patientInfo, setPatientInfo] = useState({});
  let [docInfo, setDocInfo] = useState();
  let [initialData, setInitialData] = useState({});
  let [allergies, setAllergies] = useState({});

  let params = useParams();

  useEffect(async () => {
    await db
      .collection('prescription')
      .doc(props.appId)
      .get()
      .then((res) => {
        if (res.data()) setInitialData(res.data());
      });
  }, []);
  useEffect(async () => {
    if (!appInfo)
      await db
        .collection(`${params.type}`)
        .doc(props.appId)
        .get()
        .then((res) => {
          setAppInfo(res.data());
          //console.log(res.data())
        });
    if (appInfo)
      await db
        .collection('patients')
        .doc(appInfo.patientId)
        .get()
        .then((res) => {
          if (res.data()) setPatientInfo(res.data());
          else {
            db.collection('tempUsers')
              .doc(appInfo.patientId)
              .get()
              .then((tres) => {
                setPatientInfo(tres.data());
              });
          }
          //console.log(res.data())
        });
    if (appInfo)
      await db
        .collection('doctors')
        .doc(appInfo.doctorId)
        .get()
        .then((res) => {
          setDocInfo(res.data());
          //console.log(res.data())
        });
  }, [appInfo]);

  var genderRef = useRef();
  var ageRef = useRef();
  var heightRef = useRef();
  var weightRef = useRef();
  var rrRef = useRef();
  var tempRef = useRef();
  var bpRef = useRef();
  var spo2Ref = useRef();
  var pulseRef = useRef();
  var advisedTestRef = useRef();
  var pcRef = useRef();
  var kcoRef = useRef();

  const handleUpdateClick = (e) => {
    e.preventDefault();
    let gender = genderRef.current.value;
    let age = ageRef.current.value;
    let height = heightRef.current.value;
    let weight = weightRef.current.value;
    let rr = rrRef.current.value;
    let temperature = tempRef.current.value;
    let bp = bpRef.current.value;
    let spo2 = spo2Ref.current.value;
    let pulse = pulseRef.current.value;
    let advicedTest = advisedTestRef.current.value;
    let pc = pcRef.current.value;
    let kco = kcoRef.current.value;

    let tempPres = {
      date: appInfo.date,
      gender: gender,
      age: age,
      height: height,
      weight: weight,
      rr: rr,
      temperature: temperature,
      bp: bp,
      spo2: spo2,
      pulse: pulse,
      adviceTest: advicedTest,
      appointmentId: props.appId,
      d_address: docInfo.address ? docInfo.address : '',
      specialist: docInfo.specialist ? docInfo.specialist : '',
      p_address: patientInfo.address ? patientInfo.address : '',
      patientId: appInfo.patientId,
      pname: patientInfo.name ? patientInfo.name : '',
      doctorId: appInfo.doctorId,
      dname: docInfo.name,
      presentingComp: pc,
      knownCase: kco,
      regNumber: docInfo.regNumber,
    };
    //console.log(tempPres)
    if (tempPres) {
      db.collection('prescription')
        .doc(props.appId)
        .get()
        .then((cRes) => {
          if (cRes.data()) {
            db.collection('prescription')
              .doc(props.appId)
              .update(tempPres)
              .then((res) => {
                sendToast('Successfully updated general info!', 'success');
                window.scrollTo(0, 0);
              })
              .catch((err) => console.log(err));
          } else {
            db.collection('prescription')
              .doc(props.appId)
              .set(tempPres)
              .then((res) => {
                sendToast('Successfully updated general info!', 'success');
                window.scrollTo(0, 0);
              })
              .catch((err) => console.log(err));
          }
        });
    }
  };
  if (initialData !== {} || patientInfo !== {})
    return (
      <>
        <div className='px-5 w-full sm:flex py-8 text-lg text-gray-600'>
          <div className='sm:w-6/12 w-full space-y-2'>
            <div className='w-full'>
              <div>Patient's Gender</div>
              <select
                defaultValue={
                  initialData.gender ? initialData.gender : patientInfo.gender
                }
                ref={genderRef}
                className='rounded-md mt-1 px-2 py-1 border-2'
                placeholder='Enter Gender'
              >
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
            <div className='w-full'>
              <div>Age (in years)</div>
              <input
                defaultValue={
                  initialData.age ? initialData.age : patientInfo.age
                }
                ref={ageRef}
                className='rounded-md mt-1 px-2 py-1 border-2'
                placeholder='Enter Age'
              ></input>
            </div>
            <div className='w-full'>
              <div>Height (in cm)</div>
              <input
                defaultValue={
                  initialData.height ? initialData.height : patientInfo.height
                }
                ref={heightRef}
                className='rounded-md mt-1 px-2 py-1 border-2'
                placeholder='Enter Height'
              ></input>
            </div>
            <div className='w-full'>
              <div>Weight (in kg)</div>
              <input
                defaultValue={
                  initialData.weight ? initialData.weight : patientInfo.weight
                }
                ref={weightRef}
                className='rounded-md mt-1 px-2 py-1 border-2'
                placeholder='Enter Weight'
              ></input>
            </div>
            <div className='w-full'>
              <div>Respiratory Rate (per min)</div>
              <input
                defaultValue={initialData.rr}
                ref={rrRef}
                className='rounded-md mt-1 px-2 py-1 border-2'
                placeholder='Enter RR'
              ></input>
            </div>
            <div className='w-full'>
              <div>Temperature (°F)</div>
              <input
                defaultValue={initialData.temperature}
                ref={tempRef}
                className='rounded-md mt-1 px-2 py-1 border-2'
                placeholder='Enter Temperature'
              ></input>
            </div>
            <div className='w-full'>
              <div>BP (mmHg)</div>
              <input
                defaultValue={initialData.bp}
                ref={bpRef}
                className='rounded-md mt-1 px-2 py-1 border-2'
                placeholder='Enter BP'
              ></input>
            </div>
          </div>
          <div className='sm:w-6/12 w-full space-y-2'>
            <div className='w-full'>
              <div>SPO2 (%)</div>
              <input
                defaultValue={initialData.spo2}
                ref={spo2Ref}
                className='rounded-md px-2 py-1 border-2'
                placeholder='Enter SPO2'
              ></input>
            </div>
            <div className='w-full'>
              <div>Pulse (per min)</div>
              <input
                defaultValue={initialData.pulse}
                ref={pulseRef}
                className='rounded-md mt-1 px-2 py-1 border-2'
                placeholder='Enter Pulse'
              ></input>
            </div>
            <div className='w-full'>
              <div>Presenting Complaint</div>
              <input
                defaultValue={initialData.presentingComp}
                ref={pcRef}
                className='rounded-md mt-1 px-2 py-1 border-2'
                placeholder='Enter Presenting Complaint'
              ></input>
            </div>
            <div className='w-full'>
              <div>Known Case Of</div>
              <input
                defaultValue={initialData.knownCase}
                ref={kcoRef}
                className='rounded-md mt-1 px-2 py-1 border-2'
                placeholder='Enter k/c/o'
              ></input>
            </div>
            <div className='w-full'>
              <div>Advised Tests</div>
              <input
                defaultValue={initialData.adviceTest}
                ref={advisedTestRef}
                className='rounded-md mt-1 px-2 py-1 border-2'
                placeholder='Enter Advised Tests'
              ></input>
            </div>
          </div>
        </div>

        <Link
          onClick={handleUpdateClick}
          className='rounded-md py-2 px-3 text-white  bg-green-500 font-semibold text-lg ml-5'
        >
          Update
        </Link>
      </>
    );
  else return <div></div>;
};

const Rx = (props) => {
  let [activeComp, setActiveComp] = useState('list');
  let [activeRx, setActiveRx] = useState();
  let [rxArray, setRxArray] = useState();
  let [rxname, setRxname] = useState('');

  var dosageRef = useRef();
  var freqRef = useRef();
  var durationRef = useRef();
  var formulaRef = useRef();

  useEffect(async () => {
    let first = await db
      .collection('prescription')
      .doc(props.appId)
      .collection('rx');
    first.onSnapshot((snap) => {
      setRxArray(snap.docs);
    });
    //console.log(first.docs[0].data())
  }, []);

  const RxList = () => {
    if (rxArray)
      return (
        <div className=' text-gray-700 text-lg p-5'>
          <div className='w-full flex justify-end my-8'>
            <Link
              className='bg-green-500 text-white rounded-md px-2 py-1 mx-5'
              onClick={(e) => {
                e.preventDefault();
                setActiveComp('add');
              }}
            >
              Add RX
            </Link>
          </div>

          {rxArray.map((item) => {
            return (
              <div className='mt-2'>
                <Link
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveRx(item);
                    setActiveComp('single');
                  }}
                  className='hover:text-green-600 mt-2 px-2 py-1'
                >
                  <div>Name:</div>
                  <div>
                    {item.data().name} ({item.data().formula})
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      );
    else return <div></div>;
  };

  const handleAddRx = (e) => {
    e.preventDefault();
    let name = rxname;
    let dosage = dosageRef.current.value;
    let freq = freqRef.current.value;
    let formula = formulaRef.current.value;
    let duration = durationRef.current.value;

    let toAdd = {
      name: name,
      dosage: dosage,
      frequency: freq,
      formula: formula,
      duration: duration,
    };
    //console.log(toAdd);
    db.collection('prescription')
      .doc(props.appId)
      .collection('rx')
      .add(toAdd)
      .then((res) => {
        sendToast('Successfully added rx!', 'success');
        setActiveComp('list');
      });
  };

  const SingleRx = () => {
    let nameRef = useRef();
    let dosageRef = useRef();
    let freqRef = useRef();
    let durationRef = useRef();
    let formulaRef = useRef();

    const handleUpdateRx = (e, rxId) => {
      //e.preventDefault()
      //console.log(rxId)
      let name = nameRef.current.value;
      let dosage = dosageRef.current.value;
      let freq = freqRef.current.value;
      let formula = formulaRef.current.value;
      let duration = durationRef.current.value;

      let temprx = {
        name: name,
        dosage: dosage,
        frequency: freq,
        formula: formula,
        duration: duration,
      };
      //console.log(temprx);
      db.collection('prescription')
        .doc(props.appId)
        .collection('rx')
        .doc(rxId)
        .update(temprx)
        .then((res) => sendToast('Successfully updated rx!', 'success'));
    };

    return (
      <div className='px-5 py-8 text-lg text-gray-600'>
        <Link
          className='text-green-500 hover:text-green-500 text-lg'
          onClick={(e) => {
            e.preventDefault();
            setActiveComp('list');
          }}
        >
          Back
        </Link>
        <div className='w-full mt-8'>
          <div>Rx Name</div>
          <input
            ref={nameRef}
            defaultValue={activeRx.data().name}
            className='rounded-md mt-2 mb-5 px-2 py-1 border-2'
            placeholder='Enter Rx Name'
          ></input>
        </div>
        <div className='w-full'>
          <div>Strength</div>
          <input
            ref={formulaRef}
            defaultValue={activeRx.data().formula}
            className='rounded-md mt-2 mb-5 px-2 py-1 border-2'
            placeholder='Enter Strength'
          ></input>
        </div>
        <div className='w-full'>
          <div>Frequency</div>
          <select
            ref={freqRef}
            defaultValue={activeRx.data().frequency}
            className='rounded-md mt-2 mb-5 px-2 py-1 border-2'
          >
            <option>a.c. (Before meal)</option>
            <option>p.c. (After meal)</option>
            <option>a.m. (Before noon)</option>
            <option>p.m. (After noon)</option>
            <option>Alt. die (Alternate day)</option>
            <option>o.m. (Each morning)</option>
            <option>o.d. (Daily (once a day))</option>
            <option>H.S. (Bed time)</option>
            <option>p.r.n (When required)</option>
            <option>s.o.s (When necessary)</option>
            <option>b.D (B.i.d) (Twice a day)</option>
            <option>t.i.d (Three times in a day)</option>
            <option>Stat (At once)</option>
            <option>o.n. (Each night)</option>
          </select>
        </div>
        <div className='w-full'>
          <div>Dosage</div>
          <select
            ref={dosageRef}
            defaultValue={activeRx.data().dosage}
            className='rounded-md mt-2 mb-5 px-2 py-1 border-2'
          >
            <option>1 Tab</option>
            <option>2 Tab</option>
            <option>1 Teaspoon</option>
            <option>2 Teaspoon</option>
          </select>
        </div>
        <div className='w-full'>
          <div>Duration (in Day)</div>
          <input
            ref={durationRef}
            defaultValue={activeRx.data().duration}
            className='rounded-md mt-2 mb-8 px-2 py-1 border-2'
            placeholder='Enter Duration'
          ></input>
        </div>
        <Link
          onClick={(e) => handleUpdateRx(e, activeRx.id)}
          className='rounded-md py-2 px-3 text-white bg-blue-500 hover:bg-blue-700 font-semibold text-lg'
        >
          Update
        </Link>
      </div>
    );
  };
  if (activeComp === 'list') return <RxList />;
  else if (activeRx && activeComp === 'single') return <SingleRx />;
  else if (activeComp === 'add')
    return (
      <div className='px-5 py-8 text-lg text-gray-600'>
        <div className='w-full mt-8'>
          <div>Rx Name</div>
          <RxNameSuggest value={rxname} setValue={setRxname} />
        </div>
        <div className='w-full'>
          <div>Strength</div>
          <input
            ref={formulaRef}
            className='rounded-md mt-2 mb-5 px-2 py-1 border-2'
            placeholder='Enter Strength'
          ></input>
        </div>
        <div className='w-full'>
          <div>Frequency</div>
          <select
            ref={freqRef}
            className='rounded-md mt-2 mb-5 px-2 py-1 border-2'
          >
            <option>a.c. (Before meal)</option>
            <option>p.c. (After meal)</option>
            <option>a.m. (Before noon)</option>
            <option>p.m. (After noon)</option>
            <option>Alt. die (Alternate day)</option>
            <option>o.m. (Each morning)</option>
            <option>o.d. (Daily (once a day))</option>
            <option>H.S. (Bed time)</option>
            <option>p.r.n (When required)</option>
            <option>s.o.s (When necessary)</option>
            <option>b.D (B.i.d) (Twice a day)</option>
            <option>t.i.d (Three times in a day)</option>
            <option>Stat (At once)</option>
            <option>o.n. (Each night)</option>
          </select>
        </div>
        <div className='w-full'>
          <div>Dosage</div>
          <select
            ref={dosageRef}
            className='rounded-md mt-2 mb-5 px-2 py-1 border-2'
          >
            <option>1 Tab</option>
            <option>2 Tab</option>
            <option>1 Teaspoon</option>
            <option>2 Teaspoon</option>
          </select>
        </div>
        <div className='w-full'>
          <div>Duration (in days)</div>
          <input
            ref={durationRef}
            className='rounded-md mt-2 mb-8 px-2 py-1 border-2'
            placeholder='Enter Duration'
          ></input>
        </div>
        <div className='flex'>
          <Link
            className='rounded-md py-2 px-3 text-white bg-green-500 font-semibold text-lg'
            onClick={(e) => {
              e.preventDefault();
              setActiveComp('list');
            }}
          >
            Cancel
          </Link>
          <Link
            onClick={handleAddRx}
            className='rounded-md py-2 px-3 text-white mx-8 bg-green-500 font-semibold text-lg'
          >
            Add
          </Link>
        </div>
      </div>
    );
};

const NextReview = (props) => {
  let [initialData, setInitialData] = useState({});
  let [pdfLink, setPdfLink] = useState();
  let [nextDate, setNextDate] = useState();
  let [testValue, setTestValue] = useState('');
  let [loading, setLoading] = useState(false);

  var testsRef = useRef();
  var instRef = useRef();
  let params = useParams();

  useEffect(() => {
    db.collection('prescription')
      .doc(props.appId)
      .get()
      .then((res) => {
        if (res.data()) {
          setInitialData(res.data());
          setNextDate(res.data().nextDate);
        }
      });
  }, []);

  const handleGeneratePdf = async (e) => {
    e.preventDefault();
    setLoading(true);
    db.collection('prescription')
      .doc(`${props.appId}`)
      .get()
      .then((fres) => {
        if (fres.data()) {
          axios
            .get(
              'https://us-central1-nuvocliniq-test.cloudfunctions.net/onRequestApis/prescriptionPdf?docId=' +
                `${props.appId}`

              // "https://us-central1-nuvoclinic-ad7c7.cloudfunctions.net/onRequestApis/prescriptionPdf?docId=" +
              //   `${props.appId}`
            )
            .then((res) => {
              db.collection(`${params.type}`)
                .doc(props.appId)
                .update({
                  presCreateAt: new Date(),
                })
                .then((result) => {
                  sendToast('Prescription generated successfully!', 'success');
                  setLoading(false);
                });
            })
            .catch((err) => console.log(err));
        } else {
          sendToast('Please update basic information', 'error');
        }
      });
  };

  const handleDateSelected = (date) => {
    //console.log(date)
    let dt = date.getDate().toString();
    let month = (date.getMonth() + 1).toString();
    let year = date.getFullYear().toString();
    let newDate = `${dt.length === 2 ? dt : '0' + dt}-${
      month.length === 2 ? month : '0' + month
    }-${year}`;
    setNextDate(newDate);
    //console.log(newDate, dt, month, year)
  };

  const handleViewPdf = (e) => {
    e.preventDefault();
    db.collection(`${params.type}`)
      .doc(props.appId)
      .get()
      .then((res) => {
        if (!res.data() || !res.data().presCreateAt)
          sendToast('Prescription not generated yet', 'info');
        else
          storageRef
            .child(`prescriptionPdf/${props.appId}.pdf`)
            .getDownloadURL()
            .then((result) => {
              db.collection(`${params.type}`)
                .doc(props.appId)
                .update({ precribtionUrl: result });

              setPdfLink(result);
              document.getElementById('openPdf').click();
            });
      });
  };

  const handleUpdateClick = (e) => {
    e.preventDefault();
    let tests = testsRef.current.value;
    let inst = instRef.current.value;

    let tempAdd = {
      nextDate: nextDate ? nextDate : 'Not scheduled',
      test: tests,
      instruction: inst,
    };
    db.collection('prescription')
      .doc(`${props.appId}`)
      .get()
      .then((fres) => {
        if (fres.data()) {
          db.collection('prescription')
            .doc(props.appId)
            .update(tempAdd)
            .then((res) =>
              sendToast('Successfully updated next review details!', 'success')
            );
        } else {
          db.collection('prescription')
            .doc(props.appId)
            .set(tempAdd)
            .then((res) =>
              sendToast('Successfully updated next review details!', 'success')
            );
        }
      });
  };

  return (
    <div className='px-5 py-8 text-lg text-gray-700'>
      <div className='w-full'>
        <div>
          Next Review Date:{' '}
          <span className='text-green-500 font-bold'>{nextDate}</span>
        </div>
        <DatePicker
          className='border-2 rounded-md  bg-white w-32 px-3 py-1 mt-2 mb-5'
          //selected={}//startDate}
          placeholderText='select date'
          minDate={new Date()}
          dateFormat='dd/MM/yyyy'
          onChange={(date) => handleDateSelected(date)}
        />
      </div>
      <div className='w-full'>
        <div>Tests</div>
        <input
          defaultValue={initialData.test}
          ref={testsRef}
          className='rounded-md mt-2 mb-5 px-2 py-1 border-2'
          placeholder='No Tests'
        ></input>
        <div className='flex items-center'>
          <TestSuggest value={testValue} setValue={setTestValue} />
          <Link
            onClick={(e) => {
              e.preventDefault();
              testsRef.current.value =
                testsRef.current.value !== ''
                  ? `${testsRef.current.value}, ${testValue}`
                  : testValue;
            }}
            className='px-2 py-2 ml-2 -mt-3 text-white rounded-md font-semibold w-max h-10 bg-green-500'
          >
            Enter
          </Link>
        </div>
      </div>
      <div className='w-full'>
        <div>Special Instruction</div>
        <input
          defaultValue={initialData.instruction}
          ref={instRef}
          className='rounded-md mt-2 mb-8 px-2 py-1 border-2'
          placeholder='Enter Instruction'
        ></input>
      </div>
      <div className={`${loading ? 'hidden' : ''}`}>
        <Link
          onClick={handleUpdateClick}
          className='rounded-md py-2 px-3 text-white bg-green-500 font-semibold text-lg'
        >
          Update
        </Link>
        <Link
          onClick={handleGeneratePdf}
          className={`rounded-md mx-5 py-2 px-3 text-white bg-green-500 font-semibold text-lg`}
        >
          Generate prescription
        </Link>
        <Link
          onClick={handleViewPdf}
          className='rounded-md py-2 px-3 text-white bg-green-500 font-semibold text-lg'
        >
          View Pdf
        </Link>
        <Link
          to='/docAppointments'
          className='ml-4  rounded-md py-2 px-3 text-white bg-green-500 font-semibold text-lg'
        >
          Go Back
        </Link>
        <a href={pdfLink} target='_blank' id='openPdf'></a>
      </div>
      <div className={`${loading ? '' : 'hidden'} -mt-16`}>
        <Lottie options={defaultOptions} height={150} width={150} />
      </div>
    </div>
  );
};
