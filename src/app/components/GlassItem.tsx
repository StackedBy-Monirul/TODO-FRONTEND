import React, { FC, useState } from "react";
import { AiFillDelete, AiFillEdit, AiOutlineComment, AiOutlineUser, AiOutlineCalendar } from "react-icons/ai";
import { BiSolidSend } from "react-icons/bi";
import { FaDeleteLeft } from "react-icons/fa6";
import { MdFlag } from "react-icons/md";
import { deleteAPI, putAPI } from "./Api";
import { Cookies } from "react-cookie";
import { Tooltip, Avatar, Badge } from "flowbite-react";
import { todoInterface } from "../interfaces/todoInterface";
import TodoModal from "./TodoModal";

const GlassItem: FC<{
   item?: todoInterface | any;
   delHandle?: (e: string) => void;
   onUpdate?: (updatedTodo: todoInterface) => void;
}> = ({ item, delHandle }) => {
   const [active, setActive] = useState<boolean>(false);
   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
   const [data, setData] = useState<any>(item);
   const [name, setName] = useState<string>(item.name);
   const [del, setDel] = useState<boolean>(false);
   const cookie = new Cookies();
   const token: any = cookie.get("todo-token") || "";

   const editHandler = () => {
      putAPI(`todo/${data._id}`, token && token.token, {
         name: name,
      }).then((res) => {
         if (res.data && res.data.status === 200) {
            setData(res.data.data[0]);
            setName(res.data.data[0].name);
            setActive(!active);
         }
      });
   };

   const deleteHandler = () => {
      deleteAPI(`todo/${data._id}`, token && token.token).then((res) => {
         if (res.data && res.data.status === 200) {
            delHandle && delHandle(res.data.data[0].id);
            setActive(!active);
            setDel(!del);
         }
      });
   };

   const handleTodoUpdate = (updatedTodo: todoInterface) => {
      setData(updatedTodo);
      setName(updatedTodo.name);
      // Trigger parent update if available
      if (onUpdate) {
         onUpdate(updatedTodo);
      }
   };

   const getPriorityColor = (priority: string) => {
      switch (priority) {
         case 'urgent': return 'border-l-red-500';
         case 'high': return 'border-l-orange-500';
         case 'medium': return 'border-l-yellow-500';
         case 'low': return 'border-l-green-500';
         default: return 'border-l-gray-500';
      }
   };

   const isOverdue = data?.dueDate && new Date(data.dueDate) < new Date();

   return !active ? (
      <>
         <div 
            className={`p-3 bg-darkop rounded-md group cursor-pointer duration-300 border-l-4 ${getPriorityColor(data?.priority || 'medium')} border border-transparent hover:border-white hover:shadow-lg backdrop-blur-sm`}
            onClick={() => setIsModalOpen(true)}
         >
            <div className="flex items-start justify-between gap-2 mb-2">
               <p className="text-base text-[#e0e0e0] font-medium leading-tight">{data?.name || 'Untitled Task'}</p>
               <div
                  className="p-1 rounded bg-[#50505036] group-hover:opacity-100 opacity-0 transition-all duration-300 cursor-pointer"
                  onClick={(e) => {
                     e.stopPropagation();
                     setActive(!active);
                     setName(data?.name || '');
                  }}>
                  <AiFillEdit className="text-white text-sm group-hover:opacity-100 opacity-0 transition-all duration-300" />
               </div>
            </div>
            
            {/* Card Footer with metadata */}
            <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
               <div className="flex items-center space-x-3">
                  {data?.dueDate && (
                     <div className={`flex items-center space-x-1 ${isOverdue ? 'text-red-400' : 'text-gray-400'}`}>
                        <AiOutlineCalendar size={12} />
                        <span>{new Date(data.dueDate).toLocaleDateString()}</span>
                     </div>
                  )}
                  
                  {data?.comments && data.comments.length > 0 && (
                     <div className="flex items-center space-x-1">
                        <AiOutlineComment size={12} />
                        <span>{data.comments.length}</span>
                     </div>
                  )}
                  
                  {data?.assignedUsers && data.assignedUsers.length > 0 && (
                     <div className="flex items-center space-x-1">
                        <AiOutlineUser size={12} />
                        <span>{data.assignedUsers.length}</span>
                     </div>
                  )}
               </div>
               
               {data?.priority && (
                  <Badge size="xs" className={`${getPriorityColor(data.priority).replace('border-l-', 'bg-')} text-white`}>
                     {data.priority}
                  </Badge>
               )}
            </div>
            
            {/* Assigned users avatars */}
            {data?.assignedUsers && data.assignedUsers.length > 0 && (
               <div className="flex -space-x-2 mt-2">
                  {data.assignedUsers.slice(0, 3).map((user: any, index: number) => (
                     <Avatar
                        key={user?._id || index}
                        img={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}`}
                        size="xs"
                        rounded
                        className="border-2 border-gray-800"
                     />
                  ))}
                  {data.assignedUsers.length > 3 && (
                     <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-xs text-white border-2 border-gray-800">
                        +{data.assignedUsers.length - 3}
                     </div>
                  )}
               </div>
            )}
         </div>
         
         <TodoModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            todo={data}
            onUpdate={handleTodoUpdate}
         />
      </>
   ) : (
      <div className="p-3 bg-darkop rounded-md group cursor-pointer relative border-l-4 border-l-blue-500">
         {!del ? (
            <div className="items-center justify-between gap-2">
               <input 
                  className="text-base text-[#e0e0e0] w-full p-2 rounded bg-transparent border border-gray-600 focus:border-teal-500 mb-3" 
                  defaultValue={name} 
                  onChange={(e) => setName(e.target.value)} 
               />
               <div className="flex items-center justify-center gap-2">
                  <Tooltip content="Update" style="dark">
                     <button className="p-2 rounded bg-teal-500 hover:bg-teal-600 transition-all duration-300 cursor-pointer" onClick={editHandler}>
                        <BiSolidSend className="text-white text-sm" />
                     </button>
                  </Tooltip>
                  <Tooltip content="Cancel" style="dark">
                     <button
                        className="p-2 rounded bg-gray-500 hover:bg-gray-600 transition-all duration-300 cursor-pointer"
                        onClick={() => {
                           setActive(!active);
                           setName(data?.name || '');
                        }}>
                        <FaDeleteLeft className="text-white text-sm" />
                     </button>
                  </Tooltip>
                  <Tooltip content="Delete" style="dark">
                     <button
                        className="p-2 rounded bg-red-500 hover:bg-red-600 transition-all duration-300 cursor-pointer"
                        onClick={() => {
                           setDel(!del);
                           setName(name);
                        }}>
                        <AiFillDelete className="text-white text-sm" />
                     </button>
                  </Tooltip>
               </div>
            </div>
         ) : (
            <div className="flex items-center justify-center py-4">
               <div className="text-center">
                  <p className="text-white mb-3 font-medium">Confirm Delete</p>
                  <div className="flex items-center gap-3">
                     <button className="text-white bg-red-500 hover:bg-red-600 font-semibold px-4 py-2 rounded transition-colors" onClick={deleteHandler}>
                        Confirm
                     </button>
                     <button
                        className="text-white bg-gray-500 hover:bg-gray-600 font-semibold px-4 py-2 rounded transition-colors"
                        onClick={() => {
                           setDel(!del);
                           setActive(!active);
                        }}>
                        Cancel
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default GlassItem;
