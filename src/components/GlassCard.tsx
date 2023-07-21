import axios from "axios";
import React, { FC, ReactNode, useEffect, useState } from "react";
import { Cookies } from "react-cookie";
import { AiFillEdit, AiOutlineFileAdd } from "react-icons/ai";
import { BsThreeDots, BsTrashFill } from "react-icons/bs";
import GlassItem from "./GlassItem";
import { getAPI, postAPI } from "./Api";
import { Draggable, Droppable } from "react-beautiful-dnd";
import todoInterface from "../interfaces/todoInterface";

const GlassCard: FC<{
  children?: ReactNode;
  className?: string;
  title: string;
  id?: string;
  user?: object | any;
  todo?: todoInterface[] | any;
}> = ({ children, className, title, id, user, todo }) => {
  const [active, setActive] = useState<boolean>(false);
  const [data, setData] = useState<todoInterface[]>([]);
  const [todoActive, setTodoActive] = useState<boolean>(false);
  const [todoName, setTodoName] = useState<string>("");
  const cookie = new Cookies();
  const token: any = cookie.get("todo-token") || "";

  const sectionHandler = (todo: todoInterface[]) => {
    setData(todo);
  };

  const TodoSubmitHandler = async () => {
    postAPI("todo/create", token && token.token, {
      name: todoName,
      section: id,
      user: user._id,
    }).then((res) => {
      if (res.status === 200 || (res.data && res.data.status === 200)) {
        setData([...data, res.data.data[0]]);
        setTodoActive(!todoActive);
        setTodoName("");
      }
    });
  };

  useEffect(() => {
    sectionHandler(todo);
  }, [title]);
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
            active ? "h-auto block" : "h-0 hidden"
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
        <Droppable
          droppableId={`${id}`}
          type="ITEM"
          renderClone={(provided, snapshot, rubric) => (
            <div
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
            >
              <GlassItem item={data[rubric.source.index]} />
            </div>
          )}
        >
          {(provided, snapshot) => (
            <>
              <div
                ref={provided.innerRef}
                style={{
                  backgroundColor: snapshot.isDraggingOver
                    ? "#00000042"
                    : "transparent",
                  minHeight: snapshot.isDraggingOver ? "50px" : "10px",
                }}
                {...provided.droppableProps}
              >
                {data &&
                  Object.keys(data).map((item, index) => (
                    <Draggable
                      draggableId={`draggableItem-${data[index]._id}`}
                      index={index}
                      key={data[index]._id}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <GlassItem item={data[index]} />
                        </div>
                      )}
                    </Draggable>
                  ))}
              </div>
              {provided.placeholder}
            </>
          )}
        </Droppable>
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
