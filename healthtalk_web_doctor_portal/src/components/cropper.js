import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ReactDom from "react-dom";

import Cropper from "cropperjs";
import "cropperjs/dist/cropper.min.css";

import { db, storage } from "../firebase";
import { useAuth } from "../contexts";

export const CropperPopup = (props) => {
  let [loggedIn, setLoggedIn] = useState(useAuth())
  var open = props.open;
  var croppedImgRef = useRef();
  let [tempImage, setTempImage] = useState();
  var storageRef = storage.ref();

  var cropper;
  useEffect(() => {
    if (open)
      cropper = new Cropper(croppedImgRef.current, {
        background: false,
        aspectRatio: 1,
        cropBoxResizable: false,
        autoCropArea: 0.8,
        scalable: false,
        zoomable: false,
        crop(event) {
          const canvas = cropper.getCroppedCanvas({
            maxWidth: 256,
            maxHeight: 256,
          });
          setTempImage(canvas.toDataURL("image/jpeg", 0.5));
        },
      });
  });

  const handleSubmit = (e) => {
    props.setImage(tempImage);

    var uploadTask = storageRef
      .child(`profileImages/${props.uid}.jpg`)
      .putString(tempImage, "data_url");

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {},
      () => {
        storageRef
          .child(`profileImages/${props.uid}.jpg`)
          .getDownloadURL()
          .then((res) => {
            db.collection(`${loggedIn.currentUser.displayName==='doctor'?'doctors':'patients'}`).doc(props.uid).update({
              img: res,
            });
            //console.log(props.uid);
            //console.log(res);
          });
      }
    );

    props.close();
  };

  if (!open) return null;
  else if (open)
    return ReactDom.createPortal(
      <>
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            backgroundColor: "rgba(0,0,0,.7)",
          }}
        />
        <div className='rounded-t-md '
          style={{
            position: "fixed",
            top: "30%",
            bottom: "30%",
            left: "50%",
            zIndex: 1000,
            transform: "translate(-50%,-50%)",
            backgroundColor: "#000000",
          }}
        >
          <div className="flex justify-start rounded-t-md font-bold items-center text-lg bg-white">
          <div className="px-5 py-2">
            Crop your profile picture
          </div>
          </div>

          <div className="w-4/5 h-4/5">
            <img
              className="w-full h-full"
              ref={croppedImgRef}
              src={props.src}
            ></img>
          </div>
          <div className=" flex justify-end items-center bg-white rounded-b-md">
            <Link onClick={props.close} 
              className='bg-blue-800 rounded py-2 px-5 my-4 text-white font-semibold text-sm'>
              Close
            </Link>
            <Link onClick={handleSubmit} 
            className='bg-green-500 mx-3 rounded py-2 px-4 my-4 text-white font-semibold text-sm'>
              Upload
            </Link>
          </div>
        </div>
      </>,
      document.getElementById("portal")
    );
};
