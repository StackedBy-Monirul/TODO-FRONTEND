import React, { FC, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { BiSolidSend } from "react-icons/bi";
import { FaDeleteLeft } from "react-icons/fa6";
import { putAPI } from "./Api";
import { Cookies } from "react-cookie";

const GlassItem: FC<{ item?: object | any }> = ({ item }) => {
  const [active, setActive] = useState<boolean>(false);
  const [data, setData] = useState<any>(item);
  const [name, setName] = useState<string>(item.name);
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
  return !active ? (
    <div className="p-2 bg-darkop rounded-md group mb-5 cursor-pointer">
      <div className="flex items-center justify-between gap-2">
        <p className="text-base text-[#e0e0e0]">{data.name}</p>
        <div
          className="p-2 rounded bg-[#50505036] group-hover:opacity-100 opacity-0 transition-all duration-300 cursor-pointer"
          onClick={() => {
            setActive(!active);
            setName(data.name);
          }}
        >
          <AiFillEdit className="text-white text-base group-hover:opacity-100 opacity-0 transition-all duration-300" />
        </div>
      </div>
    </div>
  ) : (
    <div className="p-2 bg-darkop rounded-md group mb-5 cursor-pointer">
      <div className="flex items-center justify-between gap-2">
        <input
          className="text-base text-[#e0e0e0] w-full p-2 rounded bg-transparent border"
          defaultValue={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div>
          <div
            className="p-2 rounded bg-teal-400 opacity-100 transition-all duration-300 cursor-pointer mb-2"
            onClick={editHandler}
          >
            <BiSolidSend className="text-white text-base opacity-100 transition-all duration-300" />
          </div>
          <div
            className="p-2 rounded bg-red-400 opacity-100 transition-all duration-300 cursor-pointer"
            onClick={() => {
              setActive(!active);
              setName("");
            }}
          >
            <FaDeleteLeft className="text-white text-base opacity-100 transition-all duration-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlassItem;
