import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts";
import { DocNav } from "./docNav";

import { Menu } from "../../components/leftMenu";

export const DocHome = () => {
  let [loggedIn, setLoggedIn] = useState(useAuth())
  //console.log(loggedIn)

  if (!loggedIn.currentUser) {
    window.location.href = '/'
  } 
  else if (loggedIn.currentUser.displayName!=='doctor')
    window.location.href = '/patientHome'
  else if (!loggedIn.userDetails.fee || !loggedIn.userDetails.number || !loggedIn.userDetails.address )
    window.location.href='/docDetails'

  return (
    <div className=" min-w-full min-h-screen flex bg-white">
      <Menu activeComponent={'appointments'}/>
      <div name='otherThanLeftMenu' className='w-full overflow-y-scroll overflow-x-hidden h-screen'>
        <DocNav/>
      </div>
    </div>
  );
};
