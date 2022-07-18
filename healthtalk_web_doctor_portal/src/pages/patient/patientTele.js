import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Prompt } from "react-router";

import axios from "axios";
import { db } from "../../firebase";

import AgoraRTC from "agora-rtc-sdk-ng";
import { e } from "../doctor/utility/util";

import { useAuth } from "../../contexts";

var rtc = {
  client: null,
  localAudioTrack: null,
  localVideoTrack: null,
};
var options; 

export const PatientVideoCall = (props) => {
  let [loggedIn, setLoggedIn] = useState(useAuth());
  console.log(loggedIn.userDetails.number)
  let [token, setToken] = useState();
  let [enableStatus, setEnableStatus] = useState({
    audio: true,
    video: true,
  });
  var params = useParams();
  //console.log(loggedIn.userDetails.name, loggedIn.userDetails.number);

  const fetchToken = async () => {
    let docNumber = loggedIn.userDetails.number
    let fetched = await axios.post(
      "https://us-central1-nuvoclinic-ad7c7.cloudfunctions.net/onRequestApis/getAgoraRTCToken",
      {
        channelName: params.dname,
        uid: parseInt("0547"),
      }
    );
    setToken(fetched.data.token);
  };
  
  useEffect(async () => {
    await db.collection("appointment")
      .doc(params.appId)
      .get()
      .then((res) => {
        db.collection("doctors")
          .doc(res.data().doctorId)
          .onSnapshot(snapshot => {
              if (snapshot.data().hostStatus===loggedIn.userDetails.number)
              window.alert('doctor is live')
          })
      });
    await fetchToken();
    startBasicCall(options);
  }, []);
  //console.log(token);

  if (token)
    options = {
      appId: "28ae416a582d46d995bdfdd0390d4b50",
      channel: params.dname,
      token: token,
      uid: parseInt("0547"),
    };

  async function startBasicCall(options) {
    console.log(options)
    if (options) {
      rtc.client = AgoraRTC.createClient({
        mode: "rtc",
        codec: "vp8",
        mediaType: "all",
      });

      rtc.client.on("user-published", async (user, mediaType) => {

        await rtc.client.subscribe(user, mediaType);

        if (mediaType === "video" || mediaType==="all") {
          
          const remoteVideoTrack = user.videoTrack;

          const playerContainer = document.createElement("div");
          playerContainer.id = user.uid;
          console.log(user.uid);

          playerContainer.style.width = "100%";
          playerContainer.style.height = "100%";
          document.body.append(playerContainer);

          const videoBox = await e("#video-agora-remote");
          videoBox.appendChild(playerContainer);
          remoteVideoTrack.play(playerContainer);
        }

        if (mediaType === "audio" || mediaType==="all") {
          const remoteAudioTrack = user.audioTrack;
          remoteAudioTrack.play();
        }
      });

      rtc.client.on("user-unpublished", async (user) => {
          const playerContainer = await document.getElementById(user.uid);
          console.log(user.uid);
          playerContainer.remove();
        
      });
      await rtc.client.join(
        options.appId,
        options.channel,
        options.token,
        options.uid
      );

      rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();

      rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      //console.log(rtc)

      const localPlayer = document.createElement("div");
      localPlayer.id = options.uid;
      console.log('localPlayer', localPlayer)
      localPlayer.style.width = "150px";
      localPlayer.style.height = "150px";

      const videoBox = await e("#video-agora-local");
      videoBox.appendChild(localPlayer);

      rtc.localVideoTrack.play(localPlayer.id);
      rtc.localAudioTrack.play();

      await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);
    }
  }

  async function leaveCall() {
    //console.log(rtc)
    //setOncall(false);
    rtc.localAudioTrack.close();
    rtc.localVideoTrack.close();

    const localPlayer = document.getElementById(rtc.client.uid);
    localPlayer && localPlayer.remove();

    rtc.client.remoteUsers.forEach((user) => {
      const playerContainer = document.getElementById(user.uid);
      playerContainer && playerContainer.remove();
    });

    await rtc.client.leave();
    db.collection("doctors").doc(loggedIn.currentUser.uid).update({
      hostStatus: "00",
    });
    window.history.go(-1)
  }

  return (
    <div className="w-full h-screen">
      <div  style={{ height: "100%" }} className="w-full bg-gray-800">
        <div className="text-lg text-gray-600 w-full h-full ">
          <Prompt
            message={async () => {
              console.log("leaving..");
              await leaveCall();
              return true;
            }}
          ></Prompt>
          <div className="video-agora-box w-full h-full">
            <div className="w-full flex justify-end">
              <div
                className="z-20 fixed top-0 right-0 mt-5 mr-5"
                id="video-agora-local"
              ></div>
            </div>
            <div className="w-full h-full z-10 fixed top-0 left-0" id="video-agora-remote"></div>

            <div className="w-full flex justify-center z-30 fixed bottom-5">
              <div className=" p-3 w-max rounded-full bg-gray-600 flex justify-center">
                <Link
                  onClick={(e) => {
                    e.preventDefault();
                    rtc.localVideoTrack.setEnabled(false);
                    setEnableStatus({
                      audio: enableStatus.audio,
                      video: false,
                    });
                  }}
                  className={`${
                    !enableStatus.video ? "hidden" : ""
                  } mx-5`}
                >
                  <img className='h-12 w-12' src={'https://nuvocliniq-test.web.app/vunmute.svg'}></img>
                  {/* <i style={{fontSize: '16px'}} class="fas fa-video"></i> */}
                </Link>
                <Link
                  onClick={(e) => {
                    e.preventDefault();
                    rtc.localVideoTrack.setEnabled(true);
                    setEnableStatus({
                      audio: enableStatus.audio,
                      video: true,
                    });
                  }}
                  className={`${
                    enableStatus.video ? "hidden" : ""
                  } mx-5 `}
                >
                  <img className='h-12 w-12' src={'https://nuvocliniq-test.web.app/vmute.svg'}></img>
                  
                </Link>
                <Link
                  onClick={(e) => {
                    e.preventDefault();
                    rtc.localAudioTrack.setEnabled(false);
                    setEnableStatus({
                      audio: false,
                      video: enableStatus.video,
                    });
                  }}
                  className={`${
                    !enableStatus.audio ? "hidden" : ""
                  }  `}
                >
                  <img className='h-12 w-12' src={'https://nuvocliniq-test.web.app/unmute.svg'}></img>
                </Link>
                <Link
                  onClick={(e) => {
                    e.preventDefault();
                    rtc.localAudioTrack.setEnabled(true);
                    setEnableStatus({
                      audio: true,
                      video: enableStatus.video,
                    });
                  }}
                  className={`${
                    enableStatus.audio ? "hidden" : ""
                  }  `}
                >
                  <img className='h-12 w-12' src={'https://nuvocliniq-test.web.app/mute.svg'}></img>
                </Link>
                <Link
                  onClick={(e) => {
                    e.preventDefault();
                    leaveCall();
                  }}
                  className={` mx-5 `}
                >
                  <img className='h-12 w-12' src={'https://nuvocliniq-test.web.app/end.svg'}></img>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
