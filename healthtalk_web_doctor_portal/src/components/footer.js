import React from "react";
import { Link } from "react-router-dom";

export const Footer = ()=> {
    return(
        <div name="footer" className=" bg-gray-50 ">
        <div className="sm:flex flex-wrap justify-around">
          <div className=''>
            <Link to='/'
             className="flex items-center justify-start w-full sm:w-max">
              <img className="w-14 h-14 ml-5 mr-3 my-5" src='https://firebasestorage.googleapis.com/v0/b/nuvoclinic-ad7c7.appspot.com/o/logo.svg?alt=media&token=9094262f-aa48-4d4f-91fd-db7e1704a83d'></img>
              <div className="text-xl font-semibold">Nuvocliniq</div>
            </Link>
            <div className="my-2 ml-5 hover:text-green-800"><Link to='/lab_provider_login'>Lab Login</Link></div>
            <div className=" hover:text-green-800 ml-5"><Link to='/lab_provider_signup'>Lab Signup</Link></div>
            <div className="my-2 ml-5 hover:text-green-800"><Link to='/nurse_login'>Nurse Login</Link></div>
            <div className=" hover:text-green-800 ml-5"><Link to='/nurse_signup'>Nurse Signup</Link></div>
          </div>
          <div className="mx-5 my-8 flex flex-col">
            <div className="text-sm font-semibold text-blue-600 mb-3">
              ABOUT
            </div>
            <Link to='/login' className='hover:text-green-800'>For Patient</Link>
            <Link to='/signin' className="my-2 hover:text-green-800">For Doctor</Link>
            <Link to='/comingSoon' className='hover:text-green-800'>FAQ</Link>
            <Link to='/comingSoon' className="my-2 hover:text-green-800">Blog</Link>
          </div>
          <div className="mx-5 my-8 flex flex-col">
            <div className="text-sm font-semibold text-blue-600  mb-3">
              USEFUL LINKS
            </div>
            <Link to="/clinicList" className='hover:text-green-800'>Book Appointment</Link>
            <Link to="/docList/teleconsult/list/all" className="my-2 hover:text-green-800">Teleconsult</Link>
            <Link to='/comingSoon' className='hover:text-green-800'>Buy Medicine</Link>
            <Link to='/form' className="my-2 hover:text-green-800">Covid-19 RT-PCR Form</Link>
          </div>
          <div className="mx-5 my-8 flex flex-col">
            <div className="text-sm font-semibold text-blue-600  mb-3">
              CONTACT US
            </div>
            <div>+917553552876</div>
            <div className="mt-2">Info@nuvocliniq.in</div>
            <div className="text-sm font-semibold text-gray-800 my-5">
              FOLLOW US
            </div>
            <div className=" space-x-2">
              <Link className="text-xl text-blue-700">
                <i class="fab fa-facebook-square"></i>
              </Link>
              <Link className="text-xl text-red-400">
                <i class="fab fa-instagram "></i>
              </Link>
              <Link className="text-xl text-blue-500">
                <i class="fab fa-linkedin"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>

    )
}