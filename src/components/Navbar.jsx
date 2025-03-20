import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logo, menu, menuicon, search, userIcon } from "../assets";
import { navlinks } from "../constants";
import CustomBtn from "./CustomBtn";
import api from "../API/api";
import { useMainContext } from "../context/mainContext";

function Navbar() {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [toggleDrawer, setToggleDrawer] = useState(false);
  //   const { connect, address } = useStateContext();
  const address = localStorage.getItem("access_token");
  const { updateSearchResults } = useMainContext();

  const handleSearch = async () => {
    if (searchQuery.length === 0) return;
    try {
      const searchParams = new URLSearchParams({
        query: searchQuery || "",
      });
      const res = await api.get(`/search-campaigns?${searchParams.toString()}`);
      navigate("/");
      if (res.status === 200) {
        updateSearchResults(res?.data);
      }
      setSearchQuery("");
    } catch (error) {
      setSearchQuery("");
      console.log("Failed to search campaigns", error);
    }
  };
  return (
    <div className="flex  md:flex-row flex-col-reverse justify-between mb-5 gap-6">
      <div className="lg:flex-1 flex flex-row max-w-[458px] py-2 pl-4 pr-2 h-[52px] bg-[#1c1c24] rounded-[100px]">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          type="text"
          placeholder="Search for campaigns"
          className="flex w-full font-epilogue items-center font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none"
        />

        <div
          onClick={() => handleSearch()}
          className="w-[72px] h-full rounded-[20px] bg-[#4acd8d] flex justify-center items-center cursor-pointer"
        >
          <img
            src={search}
            alt="search"
            className="w-[15px] h-[15px] object-contain"
          />
        </div>
      </div>

      <div className="sm:flex hidden flex-row justify-end gap-4">
        <CustomBtn
          btnType="button"
          title={address ? "Create a campaign" : "Connect"}
          styles={address ? "bg-[#1dc071]" : "bg-[#8c6dfd]"}
          handleClick={() => {
            if (address) navigate("create-campaign");
            else navigate("profile");
          }}
        />

        <Link to="/profile">
          <div className="w-[52px] h-[52px] rounded-full bg-[#2c2f32] flex justify-center items-center cursor-pointer">
            <img
              src={userIcon}
              alt="user"
              className="w-[60%] h-[60%] object-contain"
            />
          </div>
        </Link>
      </div>

      {/* Small screen navigation */}
      <div className="sm:hidden flex justify-between items-center relative">
        <div
          onClick={() => navigate("/")}
          className="w-[40px] h-[40px] rounded-[10px] bg-[#2c2f32] flex justify-center items-center cursor-pointer"
        >
          <img
            src={logo}
            alt="user"
            className="w-[60%] h-[60%] object-contain"
          />
        </div>

        <img
          style={{
            transform: toggleDrawer ? "scale(0.8)" : "scale(1)",
            opacity: toggleDrawer ? 0.8 : 1, // Optional for a fade effect
            transition:
              "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease-in-out",
          }}
          src={menuicon}
          alt="menu"
          className="w-[34px] h-[34px] object-contain cursor-pointer"
          onClick={() => setToggleDrawer((prev) => !prev)}
        />

        <div
          className={`absolute top-[60px] right-0 left-0 
    bg-gradient-to-b from-[#1c1c24] via-[#252530] to-[#2c2f32] 
    rounded-xl z-[999] py-4 
    ${
      !toggleDrawer
        ? "-translate-y-[100vh] scale-y-50 opacity-0"
        : "translate-y-0 scale-y-100 opacity-100"
    } 
    transition-all duration-500 ease-[cubic-bezier(0.68, -0.55, 0.27, 1.55)]`}
        >
          <ul className="mb-4">
            {navlinks.map((link) => (
              <li
                key={link.name}
                className={`flex mx-2 rounded-xl p-4 relative overflow-hidden
               ${isActive === link.name && "bg-[#3a3a43]"}
               transition-all duration-300`}
                onClick={() => {
                  if (!link.disabled) {
                    setIsActive(link.name);
                    setToggleDrawer(false);
                    navigate(link.link);
                  }
                }}
              >
                {/* Light Glow Effect */}
                {isActive === link.name && (
                  <div
                    className="absolute top-0 right-0 h-full w-[30%] 
                 bg-gradient-to-l from-[#1dc0716f] to-transparent 
                 opacity-50"
                  />
                )}

                <img
                  src={link.imgUrl}
                  alt={link.name}
                  className={`w-[24px] h-[24px] object-contain ${
                    isActive === link.name ? "grayscale-0" : "grayscale"
                  }`}
                />
                <p
                  className={`ml-[20px] font-epilogue font-semibold text-[14px] ${
                    isActive === link.name ? "text-[#1dc071]" : "text-[#808191]"
                  }`}
                >
                  {link.name}
                </p>
              </li>
            ))}
          </ul>
          {/* {localStorage.getItem("google_creds") && ( */}
          <div className="flex mx-4">
            <CustomBtn
              btnType="button"
              title={address ? "Create a campaign" : "Connect"}
              styles={address ? "bg-[#1dc071]" : "bg-[#8c6dfd]"}
              handleClick={() => {
                setToggleDrawer(false);
                if (address) navigate("create-campaign");
                else navigate("profile");
              }}
            />
          </div>
          {/* )} */}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
