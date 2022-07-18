import React, { useEffect } from 'react';
//import { Link } from "react-router-dom";
import { VideoCall } from './videoCall';
import { Prescription } from './prescription';
import { CometChatGroupListWithMessages } from '../../../cometchat-pro-react-ui-kit/CometChatWorkspace/src';
import { useParams } from 'react-router-dom';

export const Telemedicine = (props) => {
  const param = useParams();

  return (
    <div className='w-full h-screen flex flex-col sm:flex-row'>
      <div style={{ height: '100%' }} className='w-full md:w-1/2'>
        <CometChatGroupListWithMessages guid={param.guid.toLowerCase()} />
      </div>

      <div className='w-full md:w-1/2 mt-20 sm:mt-0 h-screen overflow-y-scroll sm:border-l-2'>
        <Prescription />
      </div>
    </div>
  );
};
