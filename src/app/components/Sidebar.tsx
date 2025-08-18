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
import { useRouter } from "next/navigation";

const Sidebar: FC<{
  activePage?: string;
  active: boolean;
}> = ({ active, activePage }) => {
  const [projects, setProjects] = useState<projectInterface[]>([]);
  const [projectsExpanded, setProjectsExpanded] = useState(false);
  const [todayTasks, setTodayTasks] = useState(0);
  const [upcomingTasks, setUpcomingTasks] = useState(0);
  const cookie = new Cookies();
  const token: any = cookie.get("todo-token") || "";
  const router = useRouter();

  useEffect(() => {
    if (active) {
      loadProjects();
      loadTaskCounts();
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

  const loadTaskCounts = async () => {
    try {
      const response = await getAPI("section/all", token?.token);
      if (response.status === 200) {
        const allTodos = response.data.data[0]?.todos || [];
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        let todayCount = 0;
        let upcomingCount = 0;
        
        allTodos.forEach((section: any) => {
          section.todos.forEach((todo: any) => {
            if (todo.dueDate) {
              const dueDate = new Date(todo.dueDate);
              if (dueDate.toDateString() === today.toDateString()) {
                todayCount++;
              } else if (dueDate > today) {
                upcomingCount++;
              }
            }
          });
        });
        
        setTodayTasks(todayCount);
        setUpcomingTasks(upcomingCount);
      }
    } catch (error) {
      console.error("Error loading task counts:", error);
    }
  };

  const handleNavigation = (page: string) => {
    // For now, just log the navigation
    console.log(`Navigating to: ${page}`);
    // You can implement actual navigation logic here
  };

  return (
    <div
      className={`w-[300px] h-[calc(100%-65px)] fixed left-0 top-[65px] rounded-tr-[10px] rounded-br-[10px] backdrop-blur-[44px] text-white bg-[rgba(255,255,255,0.02)] shadow-[0px_2px_2px_0px_rgba(255,255,255,0.30)_inset] ${
        !active ? "-translate-x-full" : "translate-x-0"
      } transition-all duration-300`}
    >
      <div className="">
        <div className="py-5">
          <button
            onClick={() => handleNavigation('home')}
            className={`flex items-center gap-2 mb-5 px-8 py-2 ${
              activePage === "home" && "bg-darkop"
            }`}
          >
            <BiSolidHome className="text-lg text-[#50f5ed]" />
            <p className="text-[#50f5ed] text-lg font-semibold">Home</p>
          </button>
          <button 
            onClick={() => handleNavigation('today')}
            className="flex items-center justify-between gap-2 mb-5 px-8 py-2 w-full text-left hover:bg-darkop transition-colors"
          >
            <div className="flex items-center gap-2">
              <IoToday className="text-lg text-[#f55050]" />
              <p className="text-[#f55050] text-lg font-semibold">Today</p>
            </div>
            {todayTasks > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {todayTasks}
              </span>
            )}
          </button>
          <button 
            onClick={() => handleNavigation('tomorrow')}
            className="flex items-center gap-2 mb-5 px-8 py-2 w-full text-left hover:bg-darkop transition-colors"
          >
            <IoToday className="text-lg text-[#f55050]" />
            <p className="text-[#f55050] text-lg font-semibold">Tomorrow</p>
          </button>
          <button 
            onClick={() => handleNavigation('tomorrow')}
            className="flex items-center gap-2 mb-5 px-8 py-2 w-full text-left hover:bg-darkop transition-colors"
          >
            <BsCalendarEvent className="text-lg text-[#9850f5]" />
            <p className="text-[#9850f5] text-lg font-semibold">Tomorrow</p>
          </button>
          <button 
            onClick={() => handleNavigation('upcoming')}
            className="flex items-center justify-between gap-2 mb-5 px-8 py-2 w-full text-left hover:bg-darkop transition-colors"
          >
            <div className="flex items-center gap-2">
              <FaCalendarDays className="text-lg text-[#50f5b6]" />
              <p className="text-[#50f5b6] text-lg font-semibold">Upcoming</p>
            </div>
            {upcomingTasks > 0 && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                {upcomingTasks}
              </span>
            )}
          </button>
        </div>
        <div className="pb-10">
          <button 
            className="flex items-center justify-between text-white bg-[#0000004f] px-8 py-3 cursor-pointer hover:bg-[#00000060] transition-colors w-full text-left"
            onClick={() => handleNavigation('tags')}
          >
            <p className="text-sm">Tags</p>
          </button>
        </div>
        <div className="pb-10">
          <button 
            className="flex items-center justify-between text-white bg-[#0000004f] px-8 py-3 cursor-pointer hover:bg-[#00000060] transition-colors w-full text-left"
            onClick={() => setProjectsExpanded(!projectsExpanded)}
          >
            <p className="text-sm">Projects ({projects.length})</p>
            {projectsExpanded ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          {projectsExpanded && (
            <div className="bg-[#00000020]">
              {projects.map((project) => (
                <button 
                  key={project._id} 
                  onClick={() => handleNavigation(`project-${project._id}`)}
                  className="flex items-center gap-3 px-12 py-2 hover:bg-[#00000040] transition-colors w-full text-left"
                >
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: project.color || "#3b82f6" }}
                  ></div>
                  <span className="text-sm text-gray-300">{project.name}</span>
                </button>
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
