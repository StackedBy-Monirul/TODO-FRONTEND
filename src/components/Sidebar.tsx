import React, { FC, MouseEventHandler, useEffect, useState } from "react";
import { Link } from "gatsby";
import { BiSolidHome } from "react-icons/bi";
import { IoToday } from "react-icons/io5";
import { FaCalendarDays } from "react-icons/fa6";
import { BsCalendarEvent } from "react-icons/bs";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { getAPI } from "./Api";
import GetUser from "./GetUser";
import { Cookies } from "react-cookie";
const Sidebar: FC<{
  activePage?: string;
  active: boolean;
}> = ({ active, activePage }) => {
  return (
    <div
      className={`w-[300px] h-[calc(100%-65px)] fixed left-0 top-[65px] rounded-tr-[10px] rounded-br-[10px] backdrop-blur-[44px] text-white bg-[rgba(255,255,255,0.02)] shadow-[0px_2px_2px_0px_rgba(255,255,255,0.30)_inset] ${
        !active ? "-translate-x-full" : "translate-x-0"
      } transition-all duration-300`}
    >
      <div className="">
        <div className="py-5">
          <Link
            to="#"
            className={`flex items-center gap-2 mb-5 px-8 py-2 ${
              activePage === "home" && "bg-darkop"
            }`}
          >
            <BiSolidHome className="text-lg text-[#50f5ed]" />
            <p className="text-[#50f5ed] text-lg font-semibold">Home</p>
          </Link>
          <Link to="#" className="flex items-center gap-2 mb-5 px-8 py-2">
            <IoToday className="text-lg text-[#f55050]" />
            <p className="text-[#f55050] text-lg font-semibold">Today</p>
          </Link>
          <Link to="#" className="flex items-center gap-2 mb-5 px-8 py-2">
            <BsCalendarEvent className="text-lg text-[#9850f5]" />
            <p className="text-[#9850f5] text-lg font-semibold">Tomorrow</p>
          </Link>
          <Link to="#" className="flex items-center gap-2 mb-5 px-8 py-2">
            <FaCalendarDays className="text-lg text-[#50f5b6]" />
            <p className="text-[#50f5b6] text-lg font-semibold">Upcoming</p>
          </Link>
        </div>
        <div className="pb-10">
          <div className="flex items-center justify-between text-white bg-[#0000004f] px-8 py-3 cursor-pointer">
            <p className="text-sm">Tags</p>
          </div>
        </div>
        <div className="pb-10">
          <div className="flex items-center justify-between text-white bg-[#0000004f] px-8 py-3 cursor-pointer">
            <p className="text-sm">Projects</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
