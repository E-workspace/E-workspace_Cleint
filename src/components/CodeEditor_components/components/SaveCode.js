import React from "react";
import Select from "react-select";
import monacoThemes from "monaco-themes/themes/themelist";
import { customStyles } from "../constants/customStyles";

const SaveCode = ({ handleThemeChange, theme }) => {
  return (
    <Select
      placeholder={`Save Cdoe`}

      styles={customStyles}
      onChange={handleThemeChange}
    />
  );
};

export default SaveCode;
