import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

export const CountryList = [
  {
    101: "Germany",
  },
];

export const LocationList = [
  {
    1: "Frankfurt",
    countryId: 101,
  },
  {
    2: "Koln",
    countryId: 101,
  },
];

export const LocatonData = [
  {
    country: "Germany",
    city: "FRA",
    path: "/content",
    location: "FRA-UAS Campus 1",
    cName: "link-body-emphasis d-inline-flex text-decoration-none rounded",
  },
];

export const SidebarData = [
  {
    title: "Home",
    path: "/",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-text",
  },
  {
    title: "Reports",
    path: "/reports",
    icon: <IoIcons.IoIosPaper />,
    cName: "nav-text",
  },
  {
    title: "Products",
    path: "/products",
    icon: <FaIcons.FaCartPlus />,
    cName: "nav-text",
  },
  {
    title: "Team",
    path: "/team",
    icon: <IoIcons.IoMdPeople />,
    cName: "nav-text",
  },
  {
    title: "Messages",
    path: "/messages",
    icon: <FaIcons.FaEnvelopeOpenText />,
    cName: "nav-text",
  },
  {
    title: "Support",
    path: "/support",
    icon: <IoIcons.IoMdHelpCircle />,
    cName: "nav-text",
  },
];
