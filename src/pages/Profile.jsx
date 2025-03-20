import { Button, Input } from "@heroui/react";
import { GoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import api from "../API/api";
import { HoverEffect } from "../components/ui/card-hover-effect";
import CustomBtn from "../components/CustomBtn";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

function Profile() {
  const navigate = useNavigate();
  const [googleCreds, setGoogleCreds] = useState(null);
  const [profileErr, setprofileErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [myCampaigns, setMyCampaigns] = useState([]);

  useGoogleOneTapLogin({
    onSuccess: (credentialResponse) =>
      handleLogin(credentialResponse.credential),
    onError: () => console.error("One-tap Login Failed"),
  });

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      const decodedData = jwtDecode(token);
      setGoogleCreds(decodedData);
      setLoggedIn(true);
      getProfile();
      getMyCampaigns();
    }
  }, []);

  const getMyCampaigns = async () => {
    try {
      setLoading(true);
      const res = await api.get("/get-my-campaigns");
      setLoading(false);
      setMyCampaigns(res?.data?.campaigns);
    } catch (error) {
      setLoading(false);
      console.error("Failed to fetch campaign data:", error);
    }
  };

  const getProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/profile");
      setLoading(false);
      console.log("Profile Data:", res?.data);
      if (res?.status === 200) {
        setUser(res?.data);
      }
    } catch (error) {
      setLoggedIn(false);
      console.log(error?.response?.status);
      setLoading(false);
      console.error("Failed to fetch profile data:", error);
    }
  };

  const handleLogin = async (credential) => {
    const decodedData = jwtDecode(credential);
    setGoogleCreds(decodedData);

    try {
      setLoading(true);
      const res = await api.post("/auth/login", {
        username: decodedData.name,
        email: decodedData.email,
        img_url: decodedData.picture,
      });
      setLoading(false);
      if (res?.data?.access_token) {
        localStorage.setItem("access_token", res.data.access_token);
        setLoggedIn(true);
        getProfile();
      } else {
        throw new Error("Access token missing from response");
      }
    } catch (error) {
      setLoading(false);
      console.error("Login Failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("google_creds");
    localStorage.removeItem("access_token");
    setGoogleCreds(null);
    setLoggedIn(false);
  };

  return (
    <div className="">
      {loading && <Loader text="Loading..." />}
      {!loggedIn ? (
        <div className="flex flex-col gap-5 w-full items-center justify-center">
          <p className="text-white md:text-xl lg:text-xl ">
            We can't see you, please Continue with Google
          </p>

          <div className="flex flex-col gap-2">
            <Input className="dark w-[80vw]" placeholder="Username" />
            <Input className="dark" placeholder="Email" />
            <Input className="dark" placeholder="Password" />
            <Button className="bg-green-400">Continue</Button>
          </div>
          <p className="text-white text-center">(or)</p>
          <GoogleLogin
            text="continue_with"
            theme="filled_black"
            onSuccess={(credentialResponse) =>
              handleLogin(credentialResponse.credential)
            }
            onError={(e) => {
              alert("Login Failed");
              console.error("Login Failed", e);
            }}
          />
        </div>
      ) : (
        <div>
          <div className=" mb-5">
            <p className="text-white">{user?.username}</p>
            <p className="text-white">{user?.email}</p>
          </div>
          <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
            {myCampaigns.length > 0
              ? "My Campaigns"
              : "No campaigns created by you!"}
          </h1>
          <br />
          <CustomBtn
            handleClick={() => navigate("/create-campaign")}
            title="Create campaign"
            styles="bg-[#1dc071]"
          />
          {!loading && myCampaigns && (
            <div>
              <HoverEffect from={"profile"} items={myCampaigns} />
            </div>
          )}
          {user?.username && (
            <Button className="absolute bottom-5" onPress={handleLogout}>
              Logout
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
