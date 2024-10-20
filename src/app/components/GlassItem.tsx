import React, { FC, useState } from "react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { BiSolidSend } from "react-icons/bi";
import { FaDeleteLeft } from "react-icons/fa6";
import { deleteAPI, putAPI } from "./Api";
import { Cookies } from "react-cookie";
import { Tooltip } from "flowbite-react";

const GlassItem: FC<{
   item?: object | any;
   delHandle?: (e: string) => void;
}> = ({ item, delHandle }) => {
   const [active, setActive] = useState<boolean>(false);
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

   return !active ? (
      <div className="p-2 bg-darkop rounded-md group cursor-pointer duration-300 border border-transparent hover:border-white">
         <div className="flex items-center justify-between gap-2">
            <p className="text-base text-[#e0e0e0]">{data.name}</p>
            <div
               className="p-2 rounded bg-[#50505036] group-hover:opacity-100 opacity-0 transition-all duration-300 cursor-pointer"
               onClick={() => {
                  setActive(!active);
                  setName(data.name);
               }}>
               <AiFillEdit className="text-white text-base group-hover:opacity-100 opacity-0 transition-all duration-300" />
            </div>
         </div>
      </div>
   ) : (
      <div className="p-2 bg-darkop rounded-md group cursor-pointer relative">
         {!del ? (
            <div className="items-center justify-between gap-2">
               <input className="text-base text-[#e0e0e0] w-[89%] p-2 rounded bg-transparent border" defaultValue={name} onChange={(e) => setName(e.target.value)} />
               <div className="flex items-start justify-center gap-3 mt-2">
                  <Tooltip content="Update" style="dark">
                     <div className="p-2 rounded bg-teal-400 opacity-100 transition-all duration-300 cursor-pointer mb-2" onClick={editHandler}>
                        <BiSolidSend className="text-white text-base opacity-100 transition-all duration-300" />
                     </div>
                  </Tooltip>
                  <Tooltip content="Cancel" style="dark">
                     <div
                        className="p-2 rounded bg-red-400 opacity-100 transition-all duration-300 cursor-pointer mb-2"
                        onClick={() => {
                           setActive(!active);
                           setName("");
                        }}>
                        <FaDeleteLeft className="text-white text-base opacity-100 transition-all duration-300" />
                     </div>
                  </Tooltip>
                  <Tooltip content="Delete" style="dark">
                     <div
                        className="p-2 rounded bg-red-400 opacity-100 transition-all duration-300 cursor-pointer"
                        onClick={() => {
                           setDel(!del);
                           setName(name);
                        }}>
                        <AiFillDelete className="text-white text-base opacity-100 transition-all duration-300" />
                     </div>
                  </Tooltip>
               </div>
            </div>
         ) : (
            <div className="flex items-center justify-center">
               <div>
                  <p className="text-white text-center">Confirm Delete</p>
                  <div className="flex items-center gap-4">
                     <button className="text-white bg-teal-500 font-semibold px-5 py-[2px] rounded" onClick={deleteHandler}>
                        Confirm
                     </button>
                     <button
                        className="text-white bg-red-500 font-semibold px-5 py-[2px] rounded"
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
