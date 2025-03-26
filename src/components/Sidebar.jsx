import React, { useState } from "react";
import { motion } from "framer-motion";
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
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className="flex  justify-between items-center flex-col sticky top-5 h-[93vh]"
    >
      <Link to="/">
        <Icon styles="w-[52px] h-[52px] bg-[#2c2f32]" imgUrl={logo} />
      </Link>
      <motion.div
        initial={{ width: "76px" }}
        animate={{ width: expanded ? "200px" : "70px" }}
        transition={{}}
        className="flex-1 flex flex-col justify-between items-center bg-[#1c1c24] rounded-[20px]  py-4 mt-4"
      >
        <div
          style={{ alignItems: "start", paddingLeft: "11px" }}
          className="flex flex-col shadow w-full gap-3 "
        >
          {navlinks.map((link) => (
            <div
              style={{ cursor: link?.disabled ? "not-allowed" : "pointer" }}
              onClick={() => {
                if (!link.disabled) {
                  setIsActive(link.name);
                  navigate(link.link);
                }
              }}
              key={link.name}
              className="flex items-center hover:scale-105 transition-all duration-300 hover:shadow-xl "
            >
              <Icon {...link} isActive={isActive} />
              {expanded && (
                <motion.span
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  style={{
                    color: isActive === link.name ? "#1dc071" : "slate-300",
                  }}
                  className="ml-3 text-slate-300 hover:text-white  font-semibold"
                >
                  {link.name}
                </motion.span>
              )}
            </div>
          ))}
        </div>

        <Icon styles="bg-slate-800" imgUrl={sun} />
      </motion.div>
    </div>
  );
}

export default Sidebar;
