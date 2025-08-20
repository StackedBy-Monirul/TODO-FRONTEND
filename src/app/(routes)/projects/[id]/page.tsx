"use client";
import { FC, useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAPI, postAPI } from "../../../components/Api";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { Droppable } from "@hello-pangea/dnd";
import { Cookies } from "react-cookie";
import Link from "next/link";
import GlassCard from "@/app/components/GlassCard";
import projectInterface from "@/app/interfaces/projectInterface";
import { dataMapInterface, todoInterface } from "@/app/interfaces/todoInterface";
import sectionInterface from "@/app/interfaces/sectionInterface";
import Layout from "@/app/components/Layout";
import AddSection from "@/app/components/AddSection";
import GetUser from "../../../components/GetUser";

const ProjectPage: FC = () => {
   const params = useParams();
   const [project, setProject] = useState<projectInterface | null>(null);
   const [sections, setSections] = useState<sectionInterface[]>([]);
   const [todos, setTodos] = useState<dataMapInterface[]>([]);
   const [loading, setLoading] = useState(true);
   const [mainHeight, setMainHeight] = useState(0);
   const [token, setToken] = useState("");
   const { user, authenticated } = GetUser();
   const cookie = new Cookies();

   useEffect(() => {
      const height = window.innerHeight;
      setMainHeight(height - 100 - 20);

      const tokenCookie = cookie.get("todo-token");
      if (tokenCookie) {
         setToken(tokenCookie.token);
      }
   }, []);

   useEffect(() => {
      const fetchProject = async () => {
         console.log(params.id);

         // Get token from cookies
         const cookie = new Cookies();
         const tokenCookie = cookie.get("todo-token");
         const currentToken = tokenCookie ? tokenCookie.token : "";
         
         if (!params.id && !currentToken) {
            console.log("Missing ID and token, skipping fetch");
            return;
         }

         try {
            setLoading(true);
            const response = await getAPI(`projects/${params.id}`, currentToken);
            console.log(response)
            if (response.status === 200) {
               setProject(response.data.data);
               setSections(response.data.data.sections || []);
               setTodos(response.data.data.todos || []);
            }
         } catch (error) {
            console.error("Error fetching project:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchProject();
   }, [params.id]);

   const DataHandler = (newSection: sectionInterface) => {
      setSections([...sections, newSection]);
   };

   const updateHandler = (sectionId: string, data: todoInterface[]) => {
      setTodos(todos.map((t) => (t.id === sectionId ? { ...t, todos: data } : t)));
   };

   const ondragend = (result: DropResult) => {
      const { destination, source, type } = result;
      if (!destination) return;

      if (type === "CARD") {
         const newSections = [...sections];
         const [removed] = newSections.splice(source.index, 1);
         newSections.splice(destination.index, 0, removed);
         setSections(newSections);

         const sectionSort = newSections.map((item) => item._id);
         postAPI("section/sort", token, { data: sectionSort }).catch((error) => console.log(error));
         return;
      }

      if (type === "ITEM") {
         const sourceSection = sections.find((section) => section._id?.toString() === source.droppableId.toString());
         const sourceIndex = todos.findIndex((todo) => todo.id.toString() === source.droppableId.toString());
         const destinationSection = sections.find((section) => section._id?.toString() === destination.droppableId.toString());
         const destinationIndex = todos.findIndex((todo) => todo.id.toString() === destination.droppableId.toString());

         if (!sourceSection || !destinationSection) return;
         if (source.index === destination.index && sourceSection._id?.toString() === destinationSection._id?.toString()) return;

         if (sourceSection._id?.toString() === destinationSection._id?.toString()) {
            const newTodos = [...todos];
            const newTodo = todos[sourceIndex];
            const [removed] = newTodo.todos.splice(source.index, 1);
            newTodo.todos.splice(destination.index, 0, removed);
            newTodos[sourceIndex] = newTodo;
            setTodos(newTodos);

            postAPI("todo/sort", token, { data: [newTodos[sourceIndex]] }).catch((error) => console.log(error));
         } else {
            const newTodos = [...todos];
            const oldTodo = todos[sourceIndex];
            let newTodo = todos[destinationIndex];
            const [removed] = oldTodo.todos.splice(source.index, 1);

            if (newTodo) {
               newTodo.todos.splice(destination.index, 0, removed);
               newTodos[sourceIndex] = oldTodo;
               newTodos[destinationIndex] = newTodo;
            } else {
               newTodo = { id: destination.droppableId, todos: [removed] };
               newTodos[sourceIndex] = oldTodo;
               newTodos.push(newTodo);
            }

            setTodos(newTodos);
            postAPI("todo/sort", token, { data: [newTodos[sourceIndex], newTodos[destinationIndex]] }).catch((error) => console.log(error));
         }
      }
   };

   if (loading) {
      return (
         <div className="flex items-center justify-center h-screen">
            <div className="text-white">Loading project...</div>
         </div>
      );
   }

   return (
      <DragDropContext onDragEnd={ondragend}>
         <div className="p-4">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-8 h-8 rounded-full" style={{ backgroundColor: project?.color || "#3b82f6" }} />
               <h1 className="text-2xl text-white font-bold">{project?.name}</h1>
               <Link href="/" className="ml-auto text-blue-400 hover:text-blue-300">
                  Back to Projects
               </Link>
            </div>
            <Droppable droppableId="droppableCard" type="CARD" direction="horizontal">
               {(provided, snapshot) => (
                  <div
                     className="whitespace-nowrap overflow-x-scroll overflow-y-hidden scrollbar pb-24"
                     ref={provided.innerRef}
                     {...provided.droppableProps}
                     style={{
                        backgroundColor: snapshot.isDraggingOver ? "#00000042" : "transparent",
                        height: `${mainHeight}px`,
                     }}>
                     {sections.map((section: sectionInterface, index: number) => (
                        <GlassCard key={section._id} title={section.name || ""} id={section._id!} index={index} todos={todos.find((t: dataMapInterface) => t.id === section._id)?.todos || []} update={(data: todoInterface[]) => updateHandler(section._id!, data)} user={user} height={mainHeight} />
                     ))}
                     {provided.placeholder}
                     <AddSection newData={DataHandler} userData={user} />
                  </div>
               )}
            </Droppable>
         </div>
      </DragDropContext>
   );
};

export default ProjectPage;
