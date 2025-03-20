import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { logo, sun } from "../assets";
import { navlinks } from "../constants";

const Icon = ({ styles, name, imgUrl, isActive, disabled, handleClick }) => (
  <div
    onClick={handleClick}
    className={`w-[48px]  h-[48px] rounded-[10px] 
        ${isActive && isActive === name && "bg-[#2c2f32]"} 
        flex justify-center items-center 
        ${!disabled ? "cursor-pointer" : "cursor-not-allowed"} 
        ${styles}`}
    style={{
      transition:
        "background-color 0.3s ease-in-out, transform 0.3s ease-in-out",
      transform: isActive && isActive === name ? "scale(1.1)" : "scale(1)",
    }}
  >
    {!isActive ? (
      <img src={imgUrl} alt="logo" className="w-1/2 h-1/2" />
    ) : (
      <img
        src={imgUrl}
        alt="logo"
        className={`w-1/2 h-1/2 ${isActive !== name && "grayscale"}`}
      />
    )}
  </div>
);

function Sidebar() {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState("Home");

  return (
    <div className="flex  justify-between items-center flex-col sticky top-5 h-[93vh]">
      <Link to="/">
        <Icon styles="w-[52px] h-[52px] bg-[#2c2f32]" imgUrl={logo} />
      </Link>

      <div className="flex-1 flex flex-col justify-between items-center bg-[#1c1c24] rounded-[20px] w-[76px] py-4 mt-4">
        <div className="flex  flex-col justify-center shadow items-center gap-3 ">
          {navlinks.map((link) => (
            <Icon
              key={link.name}
              {...link}
              isActive={isActive}
              handleClick={() => {
                if (!link.disabled) {
                  setIsActive(link.name);
                  navigate(link.link);
                }
              }}
            />
          ))}
        </div>

        <Icon styles="bg-slate-800" imgUrl={sun} />
      </div>
    </div>
  );
}

export default Sidebar;
