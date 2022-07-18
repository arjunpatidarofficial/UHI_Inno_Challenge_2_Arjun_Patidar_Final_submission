import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Survey = (props) => {
  let [activecomponent, setActiveComponent] = useState("checkupFor");

  const handleNextClick = (e) => {
      e.preventDefault()
        if (activecomponent='checkupFor') setActiveComponent('sex')
        if (activecomponent='sex') setActiveComponent('objectives')
        if (activecomponent='objectives') setActiveComponent('checkupFor')
  }

  const ActiveComp = () => {
      // for temporary showcase of frontend
    if (activecomponent === "activeFor") return <CheckupFor />;
    if (activecomponent === "sex") return <Sex />;
    if (activecomponent === "objectives") return <Objectives />;
  };
  return (
    <div>
      <ActiveComp />
      <Link onClick={handleNextClick}
       className='mt-10 px-2 py-1 rounded-md bg-blue-500'>Next</Link>
    </div>
  );
};

const CheckupFor = () => {
  return (
    <div>
      <div>Who is the checkup for?</div>
      <Link className="flex items-center px-3 py-1">
        <i class="fas fa-male"></i>
        <div className="ml-2">Myself</div>
      </Link>
      <Link className="flex items-center">
        <i class="fas fa-user-friends"></i>
        <div className="ml-2">Someone else</div>
      </Link>
    </div>
  );
};

const Sex = () => {
  return (
    <div>
      <div>What is your sex?</div>
      <Link className="flex items-center px-3 py-1">
        <i class="fas fa-female"></i>
        <div className="ml-2">Female</div>
      </Link>
      <Link className="flex items-center">
        <i class="fas fa-male"></i>
        <div className="ml-2">Male</div>
      </Link>
    </div>
  );
};
const Objectives = () => {
  return (
    <div>
      <div>Please check all the statements below that apply to you.</div>
      <div>Select one answer in each row.</div>

      <div>
        <div>I'm overweight or obsese</div>
        <div className="flex items-center">
          <input type="radio" id="weight" value="yes"></input>
          <div className="ml-2">Yes</div>
        </div>
        <div className="flex items-center">
          <input type="radio" id="weight" value="no"></input>
          <div className="ml-2">No</div>
        </div>
        <div className="flex items-center">
          <input type="radio" id="weight" value="don't know"></input>
          <div className="ml-2">Don't know</div>
        </div>
      </div>

      <div>
        <div>I smoke cigarettes</div>
        <div className="flex items-center">
          <input type="radio" id="weight" value="yes"></input>
          <div className="ml-2">Yes</div>
        </div>
        <div className="flex items-center">
          <input type="radio" id="weight" value="no"></input>
          <div className="ml-2">No</div>
        </div>
        <div className="flex items-center">
          <input type="radio" id="weight" value="don't know"></input>
          <div className="ml-2">Don't know</div>
        </div>
      </div>

      <div>
        <div>I have recently suffered an injury</div>
        <div className="flex items-center">
          <input type="radio" id="weight" value="yes"></input>
          <div className="ml-2">Yes</div>
        </div>
        <div className="flex items-center">
          <input type="radio" id="weight" value="no"></input>
          <div className="ml-2">No</div>
        </div>
        <div className="flex items-center">
          <input type="radio" id="weight" value="don't know"></input>
          <div className="ml-2">Don't know</div>
        </div>
      </div>

      <div>
        <div>I have high cholestreol</div>
        <div className="flex items-center">
          <input type="radio" id="weight" value="yes"></input>
          <div className="ml-2">Yes</div>
        </div>
        <div className="flex items-center">
          <input type="radio" id="weight" value="no"></input>
          <div className="ml-2">No</div>
        </div>
        <div className="flex items-center">
          <input type="radio" id="weight" value="don't know"></input>
          <div className="ml-2">Don't know</div>
        </div>
      </div>

      <div>
        <div>I smoke cigarettes</div>
        <div className="flex items-center">
          <input type="radio" id="weight" value="yes"></input>
          <div className="ml-2">Yes</div>
        </div>
        <div className="flex items-center">
          <input type="radio" id="weight" value="no"></input>
          <div className="ml-2">No</div>
        </div>
        <div className="flex items-center">
          <input type="radio" id="weight" value="don't know"></input>
          <div className="ml-2">Don't know</div>
        </div>
      </div>
      <div>
        <div>I have hypertension</div>
        <div className="flex items-center">
          <input type="radio" id="weight" value="yes"></input>
          <div className="ml-2">Yes</div>
        </div>
        <div className="flex items-center">
          <input type="radio" id="weight" value="no"></input>
          <div className="ml-2">No</div>
        </div>
        <div className="flex items-center">
          <input type="radio" id="weight" value="don't know"></input>
          <div className="ml-2">Don't know</div>
        </div>
      </div>

    </div>
  );
};
