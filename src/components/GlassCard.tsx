import axios from "axios";
import React, { FC, ReactNode, useEffect, useState } from "react";
import { Cookies } from "react-cookie";
import { AiFillEdit, AiOutlineFileAdd } from "react-icons/ai";
import { BsThreeDots, BsTrashFill } from "react-icons/bs";
import GlassItem from "./GlassItem";
import { BiSolidCommentAdd } from "react-icons/bi";

const GlassCard: FC<{
  children?: ReactNode;
  className?: string;
  title: string;
  id?: string;
  user?: object | any;
}> = ({ children, className, title, id, user }) => {
  const [active, setActive] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [todoActive, setTodoActive] = useState<boolean>(false);
  const [todoName, setTodoName] = useState<string>("");
  const cookie = new Cookies();
  const token = cookie.get("todo-token") || null;
  const sectionHandler = async () => {
    await axios
      .get(`http://localhost:8000/api/v1/todo/section/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token && token.token}`,
        },
      })
      .then((response) => {
        if (response.data && response.data.status === 200) {
          setData(response.data.data);
        }
      })
      .catch((error) => {});
  };
  const TodoSubmitHandler = async () => {
    await axios
      .post(
        `http://localhost:8000/api/v1/todo/create`,
        {
          name: todoName,
          section: id,
          user: user._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token && token.token}`,
          },
        }
      )
      .then((response) => {
        if (response.data && response.data.status === 200) {
          setData([...data, response.data.data[0]]);
          setTodoActive(!todoActive);
          setTodoName("");
        }
      })
      .catch((error) => {});
  };
  useEffect(() => {
    sectionHandler();
  }, []);
  return (
    <div
      className={`backdrop-blur-[44px] min-w-[400px] rounded-lg text-white shadow-[0px_2px_5px_1px_rgba(255,255,255,0.30)_inset] ${
        className && className
      }`}
    >
      <div className="p-5 flex items-start justify-between relative">
        <p className="text-base font-bold pr-5">{title}</p>
        <BsThreeDots
          className="text-white text-3xl cursor-pointer"
          onClick={() => setActive(!active)}
        />
        <div
          className={`absolute top-12 -right-10 w-[150px] bg-[#1d1d1d8a] ${
            active ? "h-auto opacity-1" : "h-0 opacity-0"
          } transition-all duration-300`}
        >
          <ul>
            <li className="px-5 flex items-center gap-2 py-4 border-b cursor-pointer">
              <AiFillEdit className="text-white text-base" />
              Edit
            </li>
            <li className="px-5 flex items-center gap-2 py-4 border-b cursor-pointer">
              <BsTrashFill className="text-white text-base" />
              Delete
            </li>
          </ul>
        </div>
      </div>
      <div className="pb-5 px-5">
        {data.map((item, index) => {
          return <GlassItem key={index} title={item.name} />;
        })}
      </div>
      <div className="px-5 pb-5">
        {todoActive ? (
          <>
            <div>
              <input
                className="w-full border rounded px-2 bg-transparent py-2"
                placeholder="+ Add a card"
                onChange={(e) => setTodoName(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between mt-3">
              <button
                className="py-2 px-10 bg-teal-400 text-white text-base font-bold rounded"
                onClick={TodoSubmitHandler}
              >
                Submit
              </button>
              <button
                className="py-2 px-10 bg-red-500 text-white text-base font-bold rounded"
                onClick={() => {
                  setTodoActive(!todoActive);
                  setTodoName("");
                }}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div
            className="bg-[#0000009a] py-2 flex items-center gap-5 text-white w-full justify-center cursor-pointer rounded"
            onClick={() => setTodoActive(!todoActive)}
          >
            <AiOutlineFileAdd className="text-2xl text-white" />
            <p>Add New Task</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlassCard;
