import React, { FC, MouseEventHandler, useEffect, useState } from "react";
import { BiSolidHome } from "react-icons/bi";
import { IoToday } from "react-icons/io5";
import { FaCalendarDays } from "react-icons/fa6";
import { BsCalendarEvent } from "react-icons/bs";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { getAPI } from "./Api";
import GetUser from "./GetUser";
import { Cookies } from "react-cookie";
import projectInterface from "../interfaces/projectInterface";
import Link from "next/link";
const Sidebar: FC<{
  activePage?: string;
  active: boolean;
}> = ({ active, activePage }) => {
  const [projects, setProjects] = useState<projectInterface[]>([]);
  const [projectsExpanded, setProjectsExpanded] = useState(false);
  const cookie = new Cookies();
  const token: any = cookie.get("todo-token") || "";

  useEffect(() => {
    if (active) {
      loadProjects();
    }
  }, [active]);

  const loadProjects = async () => {
    try {
      const response = await getAPI("projects/all", token?.token);
      if (response.status === 200) {
        setProjects(Array.isArray(response.data.data) ? response.data.data : []);
      }
    } catch (error) {
      console.error("Error loading projects:", error);
      setProjects([]);
    }
  };

  return (
    <div
      className={`w-[300px] h-[calc(100%-65px)] fixed left-0 top-[65px] rounded-tr-[10px] rounded-br-[10px] backdrop-blur-[44px] text-white bg-[rgba(255,255,255,0.02)] shadow-[0px_2px_2px_0px_rgba(255,255,255,0.30)_inset] ${
        !active ? "-translate-x-full" : "translate-x-0"
      } transition-all duration-300`}
    >
      <div className="">
        <div className="py-5">
          <Link
            href="#"
            className={`flex items-center gap-2 mb-5 px-8 py-2 ${
              activePage === "home" && "bg-darkop"
            }`}
          >
            <BiSolidHome className="text-lg text-[#50f5ed]" />
            <p className="text-[#50f5ed] text-lg font-semibold">Home</p>
          </Link>
          <Link href="#" className="flex items-center gap-2 mb-5 px-8 py-2">
            <IoToday className="text-lg text-[#f55050]" />
            <p className="text-[#f55050] text-lg font-semibold">Today</p>
          </Link>
          <Link href="#" className="flex items-center gap-2 mb-5 px-8 py-2">
            <BsCalendarEvent className="text-lg text-[#9850f5]" />
            <p className="text-[#9850f5] text-lg font-semibold">Tomorrow</p>
          </Link>
          <Link href="#" className="flex items-center gap-2 mb-5 px-8 py-2">
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
          <div 
            className="flex items-center justify-between text-white bg-[#0000004f] px-8 py-3 cursor-pointer hover:bg-[#00000060] transition-colors"
            onClick={() => setProjectsExpanded(!projectsExpanded)}
          >
            <p className="text-sm">Projects</p>
            {projectsExpanded ? <FiChevronUp /> : <FiChevronDown />}
          </div>
          {projectsExpanded && (
            <div className="bg-[#00000020]">
              {projects.map((project) => (
                <Link 
                  key={project._id} 
                  href="#" 
                  className="flex items-center gap-3 px-12 py-2 hover:bg-[#00000040] transition-colors"
                >
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: project.color || "#3b82f6" }}
                  ></div>
                  <span className="text-sm text-gray-300">{project.name}</span>
                </Link>
              ))}
              {projects.length === 0 && (
                <div className="px-12 py-2 text-xs text-gray-500">
                  No projects yet
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
