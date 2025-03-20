import { DatePicker } from "@heroui/react";
import React from "react";

const FormField = ({
  labelName,
  placeholder,
  inputType,
  isTextArea,
  value,
  handleChange,
}) => {
  return (
    <label className="flex-1 w-full flex flex-col">
      {labelName && (
        <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
          {labelName}
        </span>
      )}
      {isTextArea ? (
        <textarea
          // required
          value={value}
          onChange={handleChange}
          rows={10}
          placeholder={placeholder}
          className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[3px] border-[#3f3f46] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[15px] sm:min-w-[300px]"
        />
      ) : inputType === "date" ? (
        <div className="outline-none border-[1px] border-[#3f3f46] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[15px] sm:min-w-[300px]">
          <DatePicker
            size="lg"
            // isRequired
            variant="bordered"
            // color=""
            className="dark"
          />
        </div>
      ) : (
        <input
          // required
          value={value}
          onChange={handleChange}
          type={inputType}
          step="0.1"
          placeholder={placeholder}
          className="py-[10px] sm:px-[10px] px-[15px] outline-none border-[2px] border-[#3f3f46] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[15px] sm:min-w-[300px]"
        />
      )}
    </label>
  );
};

export default FormField;
