import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import { db } from "../firebase";


 export const UserMenu = (props) => {
    let [menuState, setMenuState] = useState('invisible sm:visible')
    let [user, setUser] = useState({})

    var activeComponent = props.activeComponent

    let params = useParams()

    useEffect(() => {
      db.collection(`${params.foundAt}`)
        .doc(`${params.patientId}`).get()
        .then((res) => {
          let data = res.data();
          setUser(data);
        });
    }, []);

    return(
      <div>
      <div >
      <Link onClick={(e)=>{
        e.preventDefault()
        setMenuState('visible sm:visible')
      }}
       className={`${menuState==='invisible sm:visible'?'':'hidden '} sm:hidden absolute z-20 text-2xl mt-2 p-2`}>
          <i class="fas fa-bars"></i>
      </Link>
      <Link onClick={(e)=>{
        e.preventDefault()
        setMenuState('invisible sm:visible')
      }}
       className={`${menuState==='visible sm:visible'?'':'hidden '} sm:hidden absolute z-20  text-2xl text-white p-2`}>
          <i class="fas fa-times"></i>
      </Link>
      </div>
      <div
      name="leftMenu"
      className={`${menuState} w-auto bg-gradient-to-br to-blue-600 from-blue-800 p-8 flex flex-col  items-center text-white h-screen absolute sm:relative z-10 sm:z-0`}
      > 
      <div className='h-32'>
        <div className=" flex justify-center items-center">
          <img src={props.img?props.img:'https://firebasestorage.googleapis.com/v0/b/nuvocliniq-test.appspot.com/o/Common%2Fman.png?alt=media&token=6c99bb92-e8a6-415a-9d39-b2aaface2742'} className="h-16"></img>
        </div> 
        <div className='font-bold text-xl my-2'>{user.name}</div>
        <div className=' text-base'>{user.number}</div>
      </div>
      <div  className='mt-5'>
        <Link to={`/consultation/${params.patientId}/${params.foundAt}`}>
          <div className={`${activeComponent==='consultation'?'bg-green-600 py-2':''} px-4 rounded-full my-5 text-md flex justify-start items-center`}>
            <i class="far fa-calendar-alt"></i>
            <div className="ml-4">Consultation</div>
          </div>
        </Link>
        <Link to={`/previousConsultations/${params.patientId}/${params.foundAt}`}>
          <div className={`${activeComponent==='history'?'bg-green-600 py-2':''} my-5 px-4  rounded-full text-md flex justify-start items-center`}>
            <i class="fas fa-history"></i>
            <div className="ml-4">History</div>
          </div>
        </Link>
        <Link to={`/showUser/${params.patientId}/${params.foundAt}`}>
          <div className={`${activeComponent==='show'?'bg-green-600 py-2':''} px-4  rounded-full my-5 text-md flex justify-start items-center`}>
            <i class="fas fa-chart-line"></i>
            <div className="ml-4 w-max">Patient Details</div>
          </div>
        </Link>
        <Link to={`/editUser/${params.patientId}/${params.foundAt}`}>
          <div className={`${activeComponent==='edit'?'bg-green-600 py-2':''} px-4  rounded-full my-5  text-md flex justify-start items-center`}>
            <i class="fas fa-users"></i>
            <div className="ml-4">Edit Details</div>
          </div>
        </Link>
      </div>
    </div>
    </div>
    )
  }