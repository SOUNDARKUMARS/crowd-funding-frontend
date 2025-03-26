import { Button } from "@heroui/react";
import { GoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import api from "../API/api";
import { HoverEffect } from "../components/ui/card-hover-effect";
import CustomBtn from "../components/CustomBtn";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { cn } from "../lib/utils";
import { FcGoogle } from "react-icons/fc";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";

function Profile() {
  const navigate = useNavigate();
  const [profileErr, setprofileErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [myCampaigns, setMyCampaigns] = useState([]);
  const [showLogin, setShowLogin] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useGoogleOneTapLogin({
    onSuccess: (credentialResponse) =>
      handleGoogleLogin(credentialResponse.credential),
    onError: () => console.error("One-tap Login Failed"),
  });

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
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

  const handleGoogleLogin = async (credential) => {
    const decodedData = jwtDecode(credential);

    try {
      setLoading(true);
      const res = await api.post("/auth/login", {
        username: decodedData.name,
        email: decodedData.email,
        img_url: decodedData.picture,
        google_login: true,
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

  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await api.post("/auth/login", {
        username: username,
        email: email,
        password: password,
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

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/signup", {
        username: username,
        email: email,
        password: password,
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
    setUser(null);
    setMyCampaigns([]);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    localStorage.removeItem("google_creds");
    localStorage.removeItem("access_token");
    setLoggedIn(false);
  };

  return (
    <div className="">
      {loading && <Loader text="Loading..." />}
      {!loggedIn ? (
        <div className="flex flex-col gap-5 w-full items-center justify-center">
          <div className="shadow-input mx-auto w-full max-w-md   p-4 rounded-lg md:p-8 bg-[#1c1c24]">
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
              Welcome to CrowdFund
            </h2>
            <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-400">
              Please log in to access your personalized dashboard and features.
            </p>

            <div className="my-8">
              <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                <LabelInputContainer>
                  <Label htmlFor="firstname">Username</Label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    id="firstname"
                    placeholder="John Doe"
                    type="text"
                  />
                </LabelInputContainer>
              </div>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  placeholder="email@skandax.com"
                  type="email"
                />
              </LabelInputContainer>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="password">Password</Label>
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  placeholder="••••••••"
                  type="password"
                />
              </LabelInputContainer>
              {!showLogin && (
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="password">Confirm Password</Label>
                  <Input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    id="password"
                    placeholder="••••••••"
                    type="password"
                  />
                </LabelInputContainer>
              )}

              <button
                onClick={() => {
                  showLogin ? handleLogin() : handleSignup();
                }}
                className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-green-700 to-green-500 font-medium text-neutral-50 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-green-800 dark:from-green-900 dark:to-green-700 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
                type="submit"
              >
                {`${showLogin ? "Login" : "Sign up"}`} &rarr;
                <BottomGradient />
              </button>

              {showLogin ? (
                <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center mt-3">
                  Don't have an account?{" "}
                  <span
                    onClick={() => setShowLogin(false)}
                    className="text-green-400 underline"
                  >
                    Sign up
                  </span>
                </p>
              ) : (
                <p
                  onClick={() => setShowLogin(true)}
                  className="text-sm text-neutral-600 dark:text-neutral-400 text-center mt-3"
                >
                  Already have an account?{" "}
                  <span className="text-green-400 underline">Login</span>
                </p>
              )}

              <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

              <GoogleLogin
                width={"80%"}
                text="continue_with"
                theme="filled_black"
                onSuccess={(credentialResponse) =>
                  handleGoogleLogin(credentialResponse.credential)
                }
                onError={(e) => {
                  alert("Login Failed");
                  console.error("Login Failed", e);
                }}
              />
            </div>
          </div>
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
const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
