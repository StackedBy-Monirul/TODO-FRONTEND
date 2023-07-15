import React, { FC, MouseEventHandler } from "react";
import { Link } from "gatsby";
import { BiSolidHome } from "react-icons/bi";
import { IoToday } from "react-icons/io5";
import { FaCalendarDays } from "react-icons/fa6";
import { BsCalendarEvent } from "react-icons/bs";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
const Sidebar: FC<{
  activePage?: string;
  active: boolean;
  tagActive: boolean;
  projectActive: boolean;
  tagClick: MouseEventHandler<HTMLElement>;
  projectClick: MouseEventHandler<HTMLElement>;
}> = ({ active, tagActive, tagClick, projectActive, projectClick }) => {
  return (
    <div
      className={`w-[300px] h-[calc(100%-65px)] fixed left-0 top-[65px] rounded-tr-[10px] rounded-br-[10px] backdrop-blur-[44px] text-white bg-[rgba(255,255,255,0.02)] shadow-[0px_2px_2px_0px_rgba(255,255,255,0.30)_inset] ${
        !active ? "-translate-x-full" : "translate-x-0"
      } transition-all duration-300`}
    >
      <div className="">
        <div className="py-5">
          <Link to="#" className="flex items-center gap-2 mb-5 bg-darkop px-8 py-3">
            <BiSolidHome className="text-lg text-[#50f5ed]" />
            <p className="text-[#50f5ed] text-lg font-semibold">Home</p>
          </Link>
          <Link to="#" className="flex items-center gap-2 mb-5 px-8 py-3">
            <IoToday className="text-lg text-[#f55050]" />
            <p className="text-[#f55050] text-lg font-semibold">Today</p>
          </Link>
          <Link to="#" className="flex items-center gap-2 mb-5 px-8 py-3">
            <BsCalendarEvent className="text-lg text-[#9850f5]" />
            <p className="text-[#9850f5] text-lg font-semibold">Tomorrow</p>
          </Link>
          <Link to="#" className="flex items-center gap-2 mb-5 px-8 py-3">
            <FaCalendarDays className="text-lg text-[#50f5b6]" />
            <p className="text-[#50f5b6] text-lg font-semibold">Upcoming</p>
          </Link>
        </div>
        <div className="pb-10">
          <div
            className="flex items-center justify-between text-white bg-[#0000004f] px-8 py-3 cursor-pointer"
            onClick={tagClick}
          >
            <p className="text-sm">Tags</p>
            {tagActive ? (
              <FiChevronDown className="text-base" />
            ) : (
              <FiChevronUp className="text-base" />
            )}
          </div>
        </div>
        <div className="pb-10">
          <div
            className="flex items-center justify-between text-white bg-[#0000004f] px-8 py-3 cursor-pointer"
            onClick={projectClick}
          >
            <p className="text-sm">Projects</p>
            {projectActive ? (
              <FiChevronDown className="text-base" />
            ) : (
              <FiChevronUp className="text-base" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
