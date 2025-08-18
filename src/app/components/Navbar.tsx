import React, { FC } from "react";
import { LiaBarsSolid } from "react-icons/lia";
import { TbArrowBack } from "react-icons/tb";
import { AiOutlineUser, AiOutlineBell, AiOutlineSearch } from "react-icons/ai";
import { Avatar, Dropdown, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import UserManagement from "./UserManagement";
import ProjectManagement from "./ProjectManagement";
import { Cookies } from "react-cookie";
import { useRouter } from "next/navigation";
import { getAPI, postAPI } from "./Api";

const Navbar: FC<{ active: boolean; onClick: any; user?: any }> = ({ active, onClick, user }) => {
   const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);
   const [isProjectManagementOpen, setIsProjectManagementOpen] = useState(false);
   const [searchQuery, setSearchQuery] = useState("");
   const [notifications, setNotifications] = useState<any[]>([]);
   const [showNotifications, setShowNotifications] = useState(false);
   const [searchResults, setSearchResults] = useState<any[]>([]);
   const [showSearchResults, setShowSearchResults] = useState(false);
   const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
   const cookie = new Cookies();
   const router = useRouter();
   const token: any = cookie.get("todo-token") || "";

   useEffect(() => {
      loadNotifications();
   }, []);

   const loadNotifications = async () => {
      try {
         const response = await getAPI("notifications/all", token?.token);
         if (response.status === 200) {
            setNotifications(Array.isArray(response.data.data) ? response.data.data : []);
         }
      } catch (error) {
         console.error("Error loading notifications:", error);
      }
   };

   const markNotificationAsRead = async (notificationId: string) => {
      try {
         await postAPI("notifications/mark-read", token?.token, { notificationId });
         setNotifications(notifications.map((notif) => (notif._id === notificationId ? { ...notif, read: true } : notif)));
      } catch (error) {
         console.error("Error marking notification as read:", error);
      }
   };

   const handleSearch = async (query: string) => {
      setSearchQuery(query);
      if (query.trim().length > 2) {
         try {
            // Mock search functionality
            const response = await getAPI("section/all", token?.token);
            if (response.status === 200) {
               const allTodos = response.data.data[0]?.todos || [];
               const results = allTodos.flatMap((section: any) => section.todos.filter((todo: any) => todo.name.toLowerCase().includes(query.toLowerCase()) || todo.description?.toLowerCase().includes(query.toLowerCase())));
               setSearchResults(results.slice(0, 5)); // Limit to 5 results
               setShowSearchResults(true);
            }
         } catch (error) {
            console.error("Error searching:", error);
         }
      } else {
         setSearchResults([]);
         setShowSearchResults(false);
      }
   };

   const unreadCount = notifications.filter((notif) => !notif.read).length;

   const handleLogout = () => {
      cookie.remove("todo-token");
      router.push("/login");
   };

   return (
      <>
         <div className="border-b border-[#b3b3b3] backdrop-blur-md bg-gray-900/80 sticky top-0 z-50">
            <div className="px-8 lg:px-40 flex items-center justify-between py-3">
               <div className="flex items-center space-x-4">
                  {!active ? <LiaBarsSolid className="text-white text-3xl cursor-pointer hover:text-teal-400 transition-colors" onClick={onClick} /> : <TbArrowBack className="text-white text-3xl cursor-pointer hover:text-teal-400 transition-colors" onClick={onClick} />}

                  <div className="hidden md:block">
                     <h1 className="text-xl font-bold text-white">TaskFlow</h1>
                  </div>
               </div>

               {/* Search Bar */}
               <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
                  <div className="relative w-full">
                     <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                     <TextInput
                        type="text"
                        placeholder="Search tasks, boards, members..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        onFocus={() => searchQuery.length > 2 && setShowSearchResults(true)}
                        onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                        className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                     />
                     {showSearchResults && searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 bg-gray-800 border border-gray-600 rounded-lg mt-1 shadow-lg z-50">
                           {searchResults.map((result) => (
                              <div key={result._id} className="p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-600 last:border-b-0">
                                 <p className="text-white font-medium">{result.name}</p>
                                 <p className="text-xs text-gray-400">{result.description || "No description"}</p>
                              </div>
                           ))}
                        </div>
                     )}
                  </div>
               </div>

               <div className="flex items-center space-x-4">
                  {/* Notifications */}
                  <div className="relative">
                     <button className="relative p-2 text-gray-400 hover:text-white transition-colors" onClick={() => setShowNotifications(!showNotifications)}>
                        <AiOutlineBell size={24} />
                        {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{unreadCount}</span>}
                     </button>

                     {showNotifications && (
                        <div className="absolute right-0 top-full mt-2 w-80 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50">
                           <div className="p-4 border-b border-gray-600">
                              <h3 className="text-white font-semibold">Notifications</h3>
                           </div>
                           <div className="max-h-96 overflow-y-auto">
                              {notifications.length > 0 ? (
                                 notifications.map((notification) => (
                                    <div key={notification._id} className={`p-4 border-b border-gray-600 hover:bg-gray-700 cursor-pointer ${!notification.read ? "bg-gray-750" : ""}`} onClick={() => markNotificationAsRead(notification._id)}>
                                       <div className="flex items-start space-x-3">
                                          <div className={`w-2 h-2 rounded-full mt-2 ${!notification.read ? "bg-teal-500" : "bg-gray-600"}`}></div>
                                          <div className="flex-1">
                                             <p className="text-white font-medium text-sm">{notification.title}</p>
                                             <p className="text-gray-400 text-xs">{notification.message}</p>
                                             <p className="text-gray-500 text-xs mt-1">{new Date(notification.createdAt).toLocaleDateString()}</p>
                                          </div>
                                       </div>
                                    </div>
                                 ))
                              ) : (
                                 <div className="p-4 text-center text-gray-400">No notifications</div>
                              )}
                           </div>
                        </div>
                     )}
                  </div>

                  {/* User Menu */}
                  <div className="relative">
                     <button onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)} className="flex items-center space-x-2 text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 font-medium rounded-lg text-sm px-5 py-2.5">
                        <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || "User"}`} alt="avatar" className="w-6 h-6 rounded-full ring-2 ring-teal-500" />
                        <span className="hidden md:block">{user?.name || "User"}</span>
                        <svg className="w-2.5 h-2.5 ms-3" fill="none" viewBox="0 0 10 6" xmlns="http://www.w3.org/2000/svg">
                           <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                        </svg>
                     </button>

                     {isUserDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-60 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                           <div className="bg-gray-700 rounded-t-lg p-2">
                              <p className="text-white font-medium text-sm">{user?.name}</p>
                              <p className="text-gray-300 text-sm truncate">{user?.email}</p>
                           </div>

                           <ul className="py-2">
                              <li>
                                 <button onClick={() => setIsUserManagementOpen(true)} className="w-full text-left px-4 py-2 flex items-center text-white hover:bg-gray-700">
                                    <AiOutlineUser className="mr-2" /> User Management
                                 </button>
                              </li>
                              <li>
                                 <button onClick={() => setIsProjectManagementOpen(true)} className="w-full text-left px-4 py-2 flex items-center text-white hover:bg-gray-700">
                                    <AiOutlineUser className="mr-2" /> Project Management
                                 </button>
                              </li>
                              <li>
                                 <button className="w-full text-left px-4 py-2 text-white hover:bg-gray-700">Settings</button>
                              </li>
                              <li>
                                 <button className="w-full text-left px-4 py-2 text-white hover:bg-gray-700">Help & Support</button>
                              </li>
                              <li>
                                 <hr className="border-gray-600 my-1" />
                              </li>
                              <li>
                                 <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 hover:text-red-300">
                                    Sign out
                                 </button>
                              </li>
                           </ul>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>

         <UserManagement isOpen={isUserManagementOpen} onClose={() => setIsUserManagementOpen(false)} />

         <ProjectManagement isOpen={isProjectManagementOpen} onClose={() => setIsProjectManagementOpen(false)} />
      </>
   );
};

export default Navbar;
