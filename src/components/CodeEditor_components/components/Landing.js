import React, { useEffect, useState } from "react";
import CodeEditorWindow from "./CodeEditorWindow";
import axios from "axios";
import { classnames } from "../utils/general";
import { languageOptions } from "../constants/languageOptions";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from 'sweetalert2';

import { defineTheme } from "../lib/defineTheme";
import useKeyPress from "../hooks/useKeyPress";
import Footer from "./Footer";
import OutputWindow from "./OutputWindow";
import CustomInput from "./CustomInput";
import OutputDetails from "./OutputDetails";
import ThemeDropdown from "./ThemeDropdown";
import LanguagesDropdown from "./LanguagesDropdown";
import { useAuth } from '../../context/AuthContext';

const javascriptDefault = `/**
* Problem: Binary Search: Search a sorted array for a target value.
*/

// Time: O(log n)
const binarySearch = (arr, target) => {
 return binarySearchHelper(arr, target, 0, arr.length - 1);
};

const binarySearchHelper = (arr, target, start, end) => {
 if (start > end) {
   return false;
 }
 let mid = Math.floor((start + end) / 2);
 if (arr[mid] === target) {
   return mid;
 }
 if (arr[mid] < target) {
   return binarySearchHelper(arr, target, mid + 1, end);
 }
 if (arr[mid] > target) {
   return binarySearchHelper(arr, target, start, mid - 1);
 }
};

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const target = 5;
console.log(binarySearch(arr, target));
`;

// Main component
const Landing = () => {
  // State variables
  const [code, setCode] = useState(javascriptDefault);
  const [customInput, setCustomInput] = useState("");
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [theme, setTheme] = useState("cobalt");
  const [language, setLanguage] = useState(languageOptions[0]);
  const [savedCodes, setSavedCodes] = useState([]);
  const [filename, setFilename] = useState("");

  const { user, logout } = useAuth();

  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

  // Change the selected language
  const onSelectChange = (sl) => {
    console.log("selected Option...", sl);
    setLanguage(sl);
  };

  // Handle the combination of Ctrl+Enter to compile code
  useEffect(() => {
    if (enterPress && ctrlPress) {
      console.log("enterPress", enterPress);
      console.log("ctrlPress", ctrlPress);
      handleCompile();
    }
  }, [ctrlPress, enterPress]);

  // Handle changes in the code editor
  const onChange = (action, data) => {
    switch (action) {
      case "code": {
        setCode(data);
        break;
      }
      default: {
        console.warn("case not handled!", action, data);
      }
    }
  };

  // Handle the compilation of code
  const handleCompile = () => {
    setProcessing(true);
    const formData = {
      language_id: language.id,
      source_code: btoa(code), // Encode source code in base64
      stdin: btoa(customInput),
    };
    const options = {
      method: "POST",
      url: "https://judge0-ce.p.rapidapi.com/submissions",
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        "X-RapidAPI-Key": "668a8671e1mshfc27f407cfd3d43p156459jsnfbd5185c5efa",
      },
      data: formData,
    };

    axios
      .request(options)
      .then(function (response) {
        console.log("res.data", response.data);
        const token = response.data.token;
        checkStatus(token);
      })
      .catch((err) => {
        let error = err.response ? err.response.data : err;
        let status = err.response.status;
        console.log("status", status);
        if (status === 429) {
          console.log("too many requests", status);
          showErrorToast(`Quota of 100 requests exceeded for the Day!`, 10000);
        }
        setProcessing(false);
        console.log("catch block...", error);
      });
  };

  // Check the status of the code compilation
  const checkStatus = async (token) => {
    const options = {
      method: "GET",
      url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        "X-RapidAPI-Key": "668a8671e1mshfc27f407cfd3d43p156459jsnfbd5185c5efa",
      },
    };
    try {
      let response = await axios.request(options);
      let statusId = response.data.status?.id;
      if (statusId === 1 || statusId === 2) {
        // still processing
        setTimeout(() => {
          checkStatus(token);
        }, 2000);
        return;
      } else {
        setProcessing(false);
        setOutputDetails(response.data);
        showSuccessToast(`Compiled Successfully!`);
        console.log("response.data", response.data);
        return;
      }
    } catch (err) {
      console.log("err", err);
      setProcessing(false);
      showErrorToast();
    }
  };

  // Change the editor theme
  function handleThemeChange(th) {
    const theme = th;
    console.log("theme...", theme);
    if (["light", "vs-dark"].includes(theme.value)) {
      setTheme(theme);
    } else {
      defineTheme(theme.value).then((_) => setTheme(theme));
    }
  }

  useEffect(() => {
    defineTheme("oceanic-next").then((_) =>
      setTheme({ value: "oceanic-next", label: "Oceanic Next" })
    );
  }, []);

  const showSuccessToast = (msg) => {
    toast.success(msg || `Compiled Successfully!`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const showErrorToast = (msg, timer) => {
    toast.error(msg || `Something went wrong! Please try again.`, {
      position: "top-right",
      autoClose: timer ? timer : 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const customButtonStyles = {
    button: {
      width: "100%",
      maxWidth: "14rem",
      height: "45px",
      minWidth: "12rem",
      borderRadius: "5px",
      color: "#000",
      fontSize: "0.8rem",
      lineHeight: "1.75rem",
      backgroundColor: "#FFFFFF",
      cursor: "pointer",
      border: "2px solid #000000",
      boxShadow: "5px 5px 0px 0px rgba(0,0,0,1)",
      ":hover": {
        border: "2px solid #000000",
        boxShadow: "none",
      },
    },
  };

  // Fetch CSRF token
  const fetchCsrfToken = async () => {
    const response = await fetch('https://e-workspace-server-v1-ms-1.onrender.com/api/csrf-token', {
      credentials: 'include',
    });
    const data = await response.json();
    return data.csrfToken;
  };

  const openModal = () => {
    Swal.fire({
      title: 'Enter Your File name To Save The Code',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'Save File',
      showLoaderOnConfirm: true,
      preConfirm: (inputValue) => {
        if (!inputValue) {
          Swal.showValidationMessage('You need to write something!');
        } else {
          return inputValue; // Return the filename
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        saveCode(result.value); // Call saveCode function with the filename
      }
    });
  };

  const saveCode = async (filename) => {
    console.log('user', user);

    const date = new Date();
    const codeData = {
      filename, // Use the filename passed as an argument
      username: user?.username,
      email: user?.email,
      code,
      date: date.toLocaleString(),
    };

    setSavedCodes((prev) => [...prev, codeData]);
    console.log([...savedCodes, codeData], 'code');

    try {
      const csrfToken = await fetchCsrfToken();
      const saveOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify(codeData),
        credentials: 'include',
      };

      const response = await fetch("https://e-workspace-server-v1-ms-1.onrender.com/api/SaveCode/StoreCode", saveOptions);
      const data = await response.json();
      console.log("Save code response:", data);
      showSuccessToast(`Code saved successfully!`);
    } catch (error) {
      console.error("Save code error:", error);
      let errorMessage = "Failed to save code.";
      showErrorToast(errorMessage);
    }
  };

  const handleSaveCode = () => {
    openModal();
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="flex flex-row">
        <div className="px-4 py-2">
          <LanguagesDropdown onSelectChange={onSelectChange} />
        </div>
        <div className="px-4 py-2">
          <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
        </div>
        <div className="px-4 py-2">
          <button
            style={customButtonStyles.button}
            onClick={handleSaveCode}
          >
            Save Code
          </button>
        </div>
      </div>
      <div className="flex flex-row space-x-4 items-start px-4 py-4">
        <div className="flex flex-col w-full h-full justify-start items-end">
          <CodeEditorWindow
            code={code}
            onChange={onChange}
            language={language?.value}
            theme={theme.value}
          />
        </div>

        <div className="right-container flex flex-shrink-0 w-[30%] flex-col">
          <OutputWindow outputDetails={outputDetails} />
          <div className="flex flex-col items-end">
            <CustomInput
              customInput={customInput}
              setCustomInput={setCustomInput}
            />
            <button
              onClick={handleCompile}
              disabled={!code}
              className={classnames(
                "mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0",
                !code ? "opacity-50" : ""
              )}
            >
              {processing ? "Processing..." : "Compile and Execute"}
            </button>
          </div>
          {outputDetails && <OutputDetails outputDetails={outputDetails} />}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Landing;
