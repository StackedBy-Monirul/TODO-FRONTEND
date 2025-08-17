import React, { FC } from "react";
import { LiaBarsSolid } from "react-icons/lia";
import { TbArrowBack } from "react-icons/tb";
import { AiOutlineUser, AiOutlineBell, AiOutlineSearch } from "react-icons/ai";
import { Avatar, Dropdown, TextInput } from "flowbite-react";
import { useState } from "react";
import UserManagement from "./UserManagement";
import { Cookies } from "react-cookie";
import { useRouter } from "next/navigation";

const Navbar: FC<{ active: boolean; onClick: any; user?: any }> = ({ active, onClick, user }) => {
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const cookie = new Cookies();
  const router = useRouter();

  const handleLogout = () => {
    cookie.remove("todo-token");
    router.push("/login");
  };

  return (
    <>
      <div className="border-b border-[#b3b3b3] backdrop-blur-md bg-gray-900/80 sticky top-0 z-50">
        <div className="px-8 lg:px-40 flex items-center justify-between py-3">
          <div className="flex items-center space-x-4">
            {!active ? (
              <LiaBarsSolid
                className="text-white text-3xl cursor-pointer hover:text-teal-400 transition-colors"
                onClick={onClick}
              />
            ) : (
              <TbArrowBack
                className="text-white text-3xl cursor-pointer hover:text-teal-400 transition-colors"
                onClick={onClick}
              />
            )}
            
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-white">TaskFlow</h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <TextInput
                type="text"
                placeholder="Search tasks, boards, members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <AiOutlineBell size={24} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>

            {/* User Menu */}
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <div className="flex items-center space-x-2 cursor-pointer">
                  <Avatar
                    img={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}`}
                    size="sm"
                    rounded
                    className="ring-2 ring-teal-500"
                  />
                  <span className="hidden md:block text-white font-medium">{user?.name || 'User'}</span>
                </div>
              }
            >
              <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                <Dropdown.Header className="bg-gray-700 rounded-t-lg">
                  <span className="block text-sm text-white font-medium">{user?.name}</span>
                  <span className="block truncate text-sm text-gray-300">{user?.email}</span>
                </Dropdown.Header>
                
                <Dropdown.Item 
                  onClick={() => setIsUserManagementOpen(true)}
                  className="text-white hover:bg-gray-700 flex items-center"
                >
                  <AiOutlineUser className="mr-2" />
                  User Management
                </Dropdown.Item>
                
                <Dropdown.Item className="text-white hover:bg-gray-700">
                  Settings
                </Dropdown.Item>
                
                <Dropdown.Item className="text-white hover:bg-gray-700">
                  Help & Support
                </Dropdown.Item>
                
                <Dropdown.Divider className="border-gray-600" />
                
                <Dropdown.Item 
                  onClick={handleLogout}
                  className="text-red-400 hover:bg-gray-700"
                >
                  Sign out
                </Dropdown.Item>
              </div>
            </Dropdown>
          </div>
        </div>
      </div>
      
      <UserManagement 
        isOpen={isUserManagementOpen} 
        onClose={() => setIsUserManagementOpen(false)} 
      />
    </>
  );
};

export default Navbar;
