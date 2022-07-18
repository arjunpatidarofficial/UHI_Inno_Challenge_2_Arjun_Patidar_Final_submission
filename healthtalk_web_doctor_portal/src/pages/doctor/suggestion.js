import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Autosuggest from "react-autosuggest";

export const RxNameSuggest = (props) => {
  let [suggestions, setSuggestions] = useState([]);
  const value = props.value
  const setValue = props.setValue

  const languages = [
    {
      name: "TABLET",
    },
    {
      name: "CAPSULE",
    },
    {
      name: "SYRUP",
    },
    {
      name: "INJECTION",
    },
    {
      name: "OINTMENT",
    },
  ];

  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : languages.filter(
          (lang) => lang.name.toLowerCase().slice(0, inputLength) === inputValue
        );
  };

  const getSuggestionValue = (suggestion) => suggestion.name;

  const renderSuggestion = (suggestion) => <div>{suggestion.name}</div>;
  const onChange = (event, { newValue }) => {
    setValue(newValue);
    //console.log(value);
  };
  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const inputProps = {
    placeholder: "Enter Rx Name",
    value,
    onChange: onChange,
  };
  return (
    <div className="rounded-md mt-2 py-1 mb-5 border-2 w-max">
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={inputProps}
    />
    </div>
  );
};

export const TestSuggest = (props) => {
    let [suggestions, setSuggestions] = useState([]);
    const value = props.value
    const setValue = props.setValue
  
    const languages = [
      {
        name: "CBC",
      },
      {
        name: "Hb",
      },
      {
        name: "Blood Suger",
      },
      {
        name: "Lipid Profile",
      },
      {
        name: "Widal",
      },
      {
        name: "L.F.T",
      },
      {
        name: "K.F.T",
      },
      {
        name: "PS for MP",
      },
      {
        name: "Dengue Ab.",
      },
      {
        name: "ABO",
      },
      {
        name: "Urine Routine Microscopy",
      },
      {
        name: "Urine Culture",
      },
      {
        name: "Stool Culture",
      },
      {
        name: "Sputum A.F.B.",
      },
      {
        name: "ECG",
      },
      {
        name: "RT-PCR",
      },
      {
        name: "Blood Sugar Random",
      },
      {
        name: "Blood Sugar Fasting",
      },
      {
        name: "Blood Sugar Post Prandial",
      },
    ];
  
    const getSuggestions = (value) => {
      const inputValue = value.trim().toLowerCase();
      const inputLength = inputValue.length;
  
      return inputLength === 0
        ? []
        : languages.filter(
            (lang) => lang.name.toLowerCase().slice(0, inputLength) === inputValue
          );
    };
  
    const getSuggestionValue = (suggestion) => suggestion.name;
  
    const renderSuggestion = (suggestion) => <div>{suggestion.name}</div>;
    const onChange = (event, { newValue }) => {
      setValue(newValue);
      //console.log(value);
    };
    const onSuggestionsFetchRequested = ({ value }) => {
      setSuggestions(getSuggestions(value));
    };
  
    const onSuggestionsClearRequested = () => {
      setSuggestions([]);
    };
  
    const inputProps = {
      placeholder: "Enter test name to add",
      value,
      onChange: onChange,
    };
    return (
      <div className="rounded-md mt-2 py-1 mb-5 border-2 w-max">
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
      </div>
    );
  };
  