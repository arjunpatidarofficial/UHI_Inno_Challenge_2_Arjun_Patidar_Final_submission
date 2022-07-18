import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { useAuth } from "../contexts";

export const Tests = (props) => {
  let [testArray, settestArray] = useState();
  let [last, setLast] = useState();
  let [linkText, setLinkText] = useState("View More");
  let [currentComp, setCurrentComp] = useState("testList");
  let [currentItem, setCurrentItem] = useState();
  let [loggedIn, setLoggedIn] = useState(useAuth());

  useEffect(() => {
    const initialCredentials = async () => {
      if (!testArray) {
        const first = db
          .collection("test")
          .orderBy("createAt", "desc")
          .limit(10);
        const docSnap = await first.onSnapshot((snapshot) => {
          const lastItem = snapshot.docs[snapshot.docs.length - 1];
          //console.log(snapshot.docs[0].data());
          settestArray(snapshot.docs);
          setLast(lastItem);
        });
      }
    };
    return initialCredentials();
  }, []);

  const updateCredentials = async () => {
    if (testArray) {
      const next = db
        .collection("test")
        .orderBy("createAt", "desc")
        .startAfter(last.data().createAt)
        .limit(10);
      const snapshot = await next.get();
      if (snapshot.docs.length !== 0) {
        const lastItem = snapshot.docs[snapshot.docs.length - 1];
        settestArray([...testArray, ...snapshot.docs]);
        setLast(lastItem);
        //console.log("next", doctorsArray, last.data());
      } else setLinkText("No More Tests");
    }
  };

  const TestCard = (props) => {
    let item = props.item.data();
    return (
      <Link
        onClick={(e) => {
          e.preventDefault();
          setCurrentItem(item);
          setCurrentComp("testDetails");
        }}
        className="rounded-md border-2 border-gray-100 shadow-md m-2 sm:m-3 pb-2"
      >
        <div className="w-52 sm:w-72 my-1">
          <div
            style={{ paddingBottom: "2px", paddingTop: "2px" }}
            className={`text-gray-500 mt-3 mb-2 pr-3  w-full flex justify-end rounded-md  px-2 text-sm`}
          >
            {`${item.createAt.toDate()}`.slice(0, 25)}
          </div>
          <div className="flex justify-between items-center">
            <div
              style={{ paddingBottom: "2px", paddingTop: "2px" }}
              className={` w-max rounded pt-2 mb-3 px-4 text-base font-bold`}
            >
              {item.name}
            </div>
            <div className="mr-3 bg-green-100 text-green-600 px-2 py-1 rounded">
              ₹{item.amount}
            </div>
          </div>
          <div className="space-y-1 px-3 w-full">
            {item.tests.map((testItem, index) => {
              return (
                <div className="flex">
                  <div>{index + 1}.</div>
                  <div className="w-full ml-2">{testItem.name}</div>
                </div>
              );
            })}
          </div>
        </div>
      </Link>
    );
  };
  const TestList = (props) => {
    if (!testArray) return <div></div>;
    else if (testArray)
      return (
        <div className=" lg:flex flex-wrap justify-start overflow-hidden overscroll-none">
          {testArray.map((item) => {
            return <TestCard item={item} />;
          })}
        </div>
      );
  };
  if (currentComp === "testList")
    return (
      <div className=" min-w-full min-h-screen flex overflow-hidden overscroll-none  bg-white">
        <div name="otherThanLeftMenu" className="w-full h-full">
          <div className="sm:flex justify-start items-center w-full pr-5">
            <Link
              onClick={(e) => {
                e.preventDefault();
                window.history.go(-1);
              }}
              className="flex items-center text-gray-700  justify-start sm:ml-3 px-2 py-5 sm:p-5"
            >
              <img
                className="w-7 h-7 outline-none"
                src="https://nuvocliniq-test.web.app/back.svg"
              ></img>
              <div className="mx-4">List of tests</div>
            </Link>
          </div>
          <div name="TestList" className="text-black ml-5 flex justify-start">
            <TestList />
          </div>
          <div className="ml-8 mt-3 mb-5">
            <Link
              className={`${
                linkText === "View More" ? "bg-green-600" : "bg-red-600"
              }  rounded px-3 py-2 w-max text-xs  text-white`}
              onClick={updateCredentials}
            >
              {linkText}
            </Link>
          </div>
        </div>
      </div>
    );
  else if (currentComp === "testDetails")
    return (
      <>
        <div className="w-full">
          <div className="flex sm:ml-5">
            <div className="flex flex-col items-center sm:w-8/12 lg:w-6/12 ">
              <div className="flex justify-between items-center w-full px-2">
                <Link
                  onClick={() => setCurrentComp("testList")}
                  className="flex items-center text-gray-700 w-full justify-start p-5"
                >
                  <img
                    className="w-7 h-7 outline-none"
                    src="https://nuvocliniq-test.web.app/back.svg"
                  ></img>
                  <div className="mx-4">Test details</div>
                </Link>
              </div>
              <div className="px-3 pb-5 my-5 w-full border-b-2  border-gray-200"></div>
              <div>
                <div
                  className="flex justify-start mx-5"
                  style={{ fontSize: "15px" }}
                 >
                  <div className=" text-gray-500 w-max rounded">
                    {`${currentItem.createAt.toDate()}`.slice(0, 25)}
                  </div>
                </div>
                <div
                  name="profile fields"
                  className="sm:flex my-5 justify-around w-full px-5"
                 >
                  <div className="flex flex-col space-y-3">
                    <div className="w-min">
                      <div>Name:</div>
                      <div className="mt-2 w-max">{currentItem.name}</div>
                    </div>
                    <div className=" ">
                      <div>Number:</div>
                      <div className="mt-2 bg-green-100 text-green-600 text-base max-w-min rounded py-0.5 px-2">
                        {currentItem.number}
                      </div>
                    </div>
                    <div className=" ">
                      <div>Email:</div>
                      <div className="mt-2 bg-blue-100 text-blue-600 rounded px-2 w-min text-base">
                        {currentItem.email}
                      </div>
                    </div>
                    <div className=" ">
                      <div>Address:</div>
                      <div className="mt-2 text-sm">{currentItem.address}</div>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-3 ml-0 sm:ml-5">
                    <div className=" ">
                      <div>Age:</div>
                      <div className="mt-2 max-w-min bg-yellow-100 text-yellow-500 rounded py-0.5 px-2 flex justify-center">
                        {currentItem.age}
                      </div>
                    </div>
                    <div className="">
                      <div>Gender:</div>
                      <div
                        className={`mt-2 w-max bg-green-100 text-green-600 text-base rounded py-0.5 px-2 flex justify-center`}
                      >
                        {currentItem.gender}
                      </div>
                    </div>
                    <div className="">
                      <div className="">Tests:</div>
                      <div
                        className={`mt-2 w-full bg-green-100 text-green-600 text-base rounded py-2 px-2`}
                      >
                        {currentItem.tests.map((item, index) => {
                          return (
                            <div className="flex">
                              <div>{index + 1}.</div>
                              <div className="ml-2">{item.name}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
};
