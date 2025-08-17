import axios from "axios";
import React, { FC, ReactNode, useEffect, useRef, useState } from "react";
import { Cookies } from "react-cookie";
import { AiFillEdit, AiOutlineFileAdd } from "react-icons/ai";
import { BsThreeDots, BsTrashFill } from "react-icons/bs";
import GlassItem from "./GlassItem";
import { getAPI, postAPI } from "./Api";
import { todoInterface } from "../interfaces/todoInterface";
import { Draggable, Droppable } from "@hello-pangea/dnd";

const GlassCard: FC<{
  children?: ReactNode;
  className?: string;
  title: string;
  id?: string;
  user?: object | any;
  todos?: todoInterface[] | any;
  index: number;
  update?: (id: todoInterface | any) => void;
  height?: number | undefined;
}> = ({
  children,
  className,
  title,
  id,
  user,
  todos,
  index,
  update,
  height,
}) => {
  const [active, setActive] = useState<boolean>(false);
  const [data, setData] = useState<todoInterface[]>([]);
  const [todoActive, setTodoActive] = useState<boolean>(false);
  const [todoName, setTodoName] = useState<string>("");
  const cardRef = useRef<HTMLDivElement>(null);
  const cookie = new Cookies();
  const token: any = cookie.get("todo-token") || "";

  const sectionHandler = (todos: todoInterface[]) => {
    setData(todos);
  };

  const TodoSubmitHandler = async () => {
    postAPI("todo/create", token && token.token, {
      name: todoName,
      section: id,
      user: user._id,
    }).then((res) => {
      if (res.status === 200 || (res.data && res.data.status === 200)) {
        setData([...data, res.data.data[0]]);
        update && update([...data, res.data.data[0]]);
        todos = [...data, res.data.data[0]];
        setTodoActive(!todoActive);
        setTodoName("");
      }
    });
  };

  const deleteHandler = (e: string) => {
    const oldData = [...data];
    const dataIndex = data.findIndex(
      (item) => item._id.toString() === e?.toString()
    );
    if (dataIndex !== -1) {
      oldData.splice(dataIndex, 1);
    }
    setData(oldData);
    update && update(oldData);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
      setActive(false)
    }
  };

  useEffect(() => {
    sectionHandler(todos);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [todos, id]);
  return (
    <Draggable draggableId={`draggable-${id}`} index={+index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`inline-block align-top mx-2 glass-card glass-card-hover min-w-[400px] rounded-lg text-white animate-fade-in-up ${
            className && className
          }`}
        >
          <div className="p-5 flex items-start justify-between relative border-b border-gray-700/50" ref={cardRef}>
            <div className="flex-1">
              <p className="text-lg font-bold pr-5 text-white">{title}</p>
              <p className="text-sm text-gray-400 mt-1">
                {data.length} {data.length === 1 ? 'task' : 'tasks'}
              </p>
            </div>
            <BsThreeDots
              className="text-gray-400 hover:text-white text-2xl cursor-pointer transition-colors"
              onClick={() => setActive(!active)}
            />
            <div
              className={`absolute top-12 right-0 w-[150px] z-50 glass-card rounded-lg border border-gray-600 ${
                active ? "h-auto block" : "h-0 hidden"
              } transition-all duration-300 animate-slide-in-right`}
            >
              <ul>
                <li className="px-5 flex items-center gap-2 py-3 border-b border-gray-600 cursor-pointer hover:bg-gray-700/50 transition-colors">
                  <AiFillEdit className="text-white text-base" />
                  <span className="text-white">Edit</span>
                </li>
                <li className="px-5 flex items-center gap-2 py-3 cursor-pointer hover:bg-red-500/20 transition-colors text-red-400">
                  <BsTrashFill className="text-white text-base" />
                  <span>Delete</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="pb-5 px-5">
            <Droppable
              droppableId={`${id}`}
              type="ITEM"
              renderClone={(provide, snapshot, rubric) => (
                <div
                  {...provide.draggableProps}
                  {...provide.dragHandleProps}
                  ref={provide.innerRef}
                  className="mb-5"
                >
                  <GlassItem
                    item={data && data[rubric.source.index]}
                    delHandle={(e) => deleteHandler(e)}
                  />
                </div>
              )}
            >
              {(provide, snapshot) => (
                <div
                  ref={provide.innerRef}
                  className="overflow-y-auto scrollbar1 transition-colors duration-300"
                  style={{
                    backgroundColor: snapshot.isDraggingOver
                      ? "rgba(20, 184, 166, 0.1)"
                      : "transparent",
                    minHeight: snapshot.isDraggingOver ? "50px" : "10px",
                    maxHeight: `${height && (height - 190)}px`,
                  }}
                  {...provide.droppableProps}
                >
                  {data &&
                    data.map((item, index) => (
                      <Draggable
                        draggableId={`draggableItem-${item._id}`}
                        index={index}
                        key={item._id}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-5 "
                          >
                            <GlassItem
                              item={item}
                              delHandle={(e) => deleteHandler(e)}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provide.placeholder}
                </div>
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
                className="glass-card hover:bg-gray-700/30 py-3 flex items-center gap-3 text-gray-300 hover:text-white w-full justify-center cursor-pointer rounded-lg transition-all duration-300 border border-gray-600/50 hover:border-teal-500/50"
                onClick={() => setTodoActive(!todoActive)}
              >
                <AiOutlineFileAdd className="text-xl" />
                <p className="font-medium">Add New Task</p>
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default GlassCard;
