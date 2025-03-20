import { Button } from "@heroui/react";
import React from "react";

function CustomBtn({ btnType, title, handleClick, styles }) {
  return (
    <Button
      type={btnType}
      className={`font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] ${styles}`}
      onPress={handleClick}
    >
      {title}
    </Button>
  );
}

export default CustomBtn;
