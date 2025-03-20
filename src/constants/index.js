import {
  createCampaign,
  dashboard,
  logout,
  payment,
  profile,
  withdraw,
} from "../assets";

export const navlinks = [
  {
    name: "Home",
    imgUrl: dashboard,
    link: "/",
  },
  {
    name: "Create One",
    imgUrl: createCampaign,
    link: "/create-campaign",
  },
  {
    name: "withdraw",
    imgUrl: withdraw,
    link: "/",
    disabled: true,
  },
  {
    name: "Profile",
    imgUrl: profile,
    link: "/profile",
  },
  {
    name: "Logout",
    imgUrl: logout,
    link: "/",
    disabled: true,
  },
];
