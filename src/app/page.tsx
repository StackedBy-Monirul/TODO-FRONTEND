"use client";
import { useCallback, useEffect, useState } from "react";
import GetUser from "./components/GetUser";
import { Cookies } from "react-cookie";
import { getAPI, postAPI } from "./components/Api";
import { dataMapInterface, todoInterface } from "./interfaces/todoInterface";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import Layout from "./components/Layout";
import sectionInterface from "./interfaces/sectionInterface";
import GlassCard from "./components/GlassCard";
import AddSection from "./components/AddSection";
export default function Home() {
   const [section, setSection] = useState<sectionInterface[]>([]);
   const [todos, setTodos] = useState<dataMapInterface[]>([]);
   const [Token, setToken] = useState<string>("");
   const [mainHeight, setMainHeight] = useState<number>(0);
   const { user, authenticated } = GetUser();
   const cookie = new Cookies();
   const sectionHandler = useCallback(
      (token: any) => {
         getAPI("section/all", token ? token : Token).then((res) => {
            if (res.data && res.data.status === 200) {
               setSection(res.data.data[0].section);
               setTodos(res.data.data[0].todos);
            }
         });
      },
      [Token]
   );
   const DataHandler = (newdata: any) => {
      setSection([...section, newdata]);
   };
   const updateHandler = (id: string | undefined, data: todoInterface[]) => {
      const newTodos = [...todos];
      const todoIndex = todos.findIndex((todo) => todo.id.toString() === id?.toString());
      if (todoIndex !== -1) {
         newTodos[todoIndex] = { ...newTodos[todoIndex], todos: data };
      }
      setTodos(newTodos);
      setSection(section);
   };
   const ondragend = (result: DropResult) => {
      const { destination, source, type } = result;
      if (!destination) return;
      if (type === "CARD") {
         const card = [...section];
         const [remove] = card.splice(source.index, 1);
         card.splice(destination.index, 0, remove);
         setSection(card);
         const cardSort = card.map((item) => item._id);
         postAPI("section/sort", Token, { data: cardSort }).catch((error) => console.log(error));
         return;
      }
      if (type === "ITEM") {
         const sourceSection = section.find((section) => section._id?.toString() === source.droppableId.toString());
         const sourceeIndex = todos.findIndex((todo) => todo.id.toString() === source.droppableId.toString());
         const destinationSection = section.find((section) => section._id?.toString() === destination.droppableId.toString());
         const destinationIndex = todos.findIndex((todo) => todo.id.toString() === destination.droppableId.toString());
         if (!sourceSection || !destinationSection) return;
         if (source.index === destination.index && sourceSection._id?.toString() === destinationSection._id?.toString()) return;
         if (sourceSection._id?.toString() === destinationSection._id?.toString()) {
            const newTodos = [...todos];
            const newTodo = todos[sourceeIndex];
            const [remove] = newTodo.todos.splice(source.index, 1);
            newTodo.todos.splice(destination.index, 0, remove);
            newTodos[sourceeIndex] = newTodo;
            setTodos(newTodos);
            setSection(section);
            postAPI("todo/sort", Token, { data: [newTodos[sourceeIndex]] }).catch((error) => console.log(error));
         } else {
            const newTodos = [...todos];
            const oldTodo = todos[sourceeIndex];
            let newTodo = todos[destinationIndex];
            const [remove] = oldTodo.todos.splice(source.index, 1);
            if (newTodo) {
               newTodo.todos.splice(destination.index, 0, remove);
               newTodos[sourceeIndex] = oldTodo;
               newTodos[destinationIndex] = newTodo;
            } else {
               newTodo = { id: destination.droppableId, todos: [remove] };
               newTodos[sourceeIndex] = oldTodo;
               newTodos.push(newTodo);
            }
            setTodos(newTodos);
            setSection(section);
            postAPI("todo/sort", Token, { data: [newTodos[sourceeIndex], newTodos[destinationIndex]] }).catch((error) => console.log(error));
         }
      }
   };
   useEffect(() => {
      const token = cookie.get("todo-token");
      if (token) {
         setToken(token.token);
         sectionHandler(token.token);
      }
      const height = window.innerHeight;
      setMainHeight(height - 100 - 20);
   }, []);
   return (
      <DragDropContext onDragEnd={ondragend}>
         <Layout backgroundColor="#0b072d" activePage="home">
            <Droppable droppableId="droppableCard" type="CARD" direction="horizontal">
               {(provided, snapshot) => (
                  <div className="whitespace-nowrap overflow-x-scroll overflow-y-hidden scrollbar pb-24 " ref={provided.innerRef} style={{ backgroundColor: snapshot.isDraggingOver ? "#00000042" : "transparent", height: `${mainHeight}px` }} {...provided.droppableProps}>
                     {section.map((item: sectionInterface, index) => {
                        const data = todos.find((todo) => todo.id.toString() === item._id?.toString());
                        return <GlassCard title={item.name ? item.name : ""} id={item._id} user={user} index={index} key={item._id} todos={data?.todos} update={(e) => updateHandler(item._id, e)} height={mainHeight} />;
                     })}
                     {provided.placeholder} <AddSection newData={DataHandler} userData={user} />
                  </div>
               )}
            </Droppable>
         </Layout>
      </DragDropContext>
   );
}
