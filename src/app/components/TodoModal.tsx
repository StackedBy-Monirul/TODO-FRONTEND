"use client";
import React, { FC, useState, useEffect } from "react";
import { Modal, Button, Textarea, Badge, Avatar } from "flowbite-react";
import { todoInterface } from "../interfaces/todoInterface";
import commentInterface from "../interfaces/commentInterface";
import userInterface from "../interfaces/userInterface";
import { postAPI, putAPI, getAPI } from "./Api";
import { Cookies } from "react-cookie";
import { AiOutlineUser, AiOutlineCalendar, AiOutlineFlag, AiOutlineCheckSquare, AiOutlinePaperClip, AiOutlineComment, AiOutlinePlus } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { MdClose } from "react-icons/md";

interface TodoModalProps {
   isOpen: boolean;
   onClose: () => void;
   todo: todoInterface | null;
   onUpdate: (updatedTodo: todoInterface) => void;
}

const TodoModal: FC<TodoModalProps> = ({ isOpen, onClose, todo, onUpdate }) => {
   const [currentTodo, setCurrentTodo] = useState<todoInterface | null>(todo);
   const [comments, setComments] = useState<commentInterface[]>([]);
   const [newComment, setNewComment] = useState<string>("");
   const [description, setDescription] = useState<string>("");
   const [title, setTitle] = useState<string>("");
   const [priority, setPriority] = useState<string>("medium");
   const [dueDate, setDueDate] = useState<string>("");
   const [assignedUsers, setAssignedUsers] = useState<userInterface[]>([]);
   const [availableUsers, setAvailableUsers] = useState<userInterface[]>([]);
   const [checklist, setChecklist] = useState<any[]>([]);
   const [newChecklistItem, setNewChecklistItem] = useState<string>("");

   const cookie = new Cookies();
   const token: any = cookie.get("todo-token") || "";

   useEffect(() => {
      if (todo && isOpen) {
         setCurrentTodo(todo);
         setTitle(todo.name);
         setDescription(todo.description || "");
         setPriority(todo.priority || "medium");
         setDueDate(todo.dueDate ? new Date(todo.dueDate).toISOString().split("T")[0] : "");
         setComments(todo.comments || []);
         setAssignedUsers(todo.assignedUsers || []);
         setChecklist(todo.checklist || []);
         loadAvailableUsers();
      }
   }, [todo, isOpen]);

   const loadAvailableUsers = async () => {
      try {
         const response = await getAPI("users/all", token?.token);
         if (response.status === 200) {
            setAvailableUsers(response.data.data || []);
         }
      } catch (error) {
         console.error("Error loading users:", error);
      }
   };

   const handleAddComment = async () => {
      if (!newComment.trim() || !currentTodo) return;

      try {
         const response = await postAPI("comments/create", token?.token, {
            content: newComment,
            todo: currentTodo._id,
         });

         if (response.status === 200) {
            const newCommentData = response.data.data;
            setComments([...comments, newCommentData]);
            setNewComment("");

            const updatedTodo = {
               ...currentTodo,
               comments: [...comments, newCommentData],
            };
            setCurrentTodo(updatedTodo);
            onUpdate(updatedTodo);
         }
      } catch (error) {
         console.error("Error adding comment:", error);
      }
   };

   const handleUpdateTodo = async () => {
      if (!currentTodo) return;

      try {
         const updateData = {
            name: title,
            description,
            priority,
            dueDate: dueDate ? new Date(dueDate) : null,
            assignedUsers: assignedUsers.map((user) => user._id),
            checklist,
         };

         const response = await putAPI(`todo/${currentTodo._id}`, token?.token, updateData);

         if (response.status === 200) {
            const updatedTodo = response.data.data[0];
            setCurrentTodo(updatedTodo);
            onUpdate(updatedTodo);
         }
      } catch (error) {
         console.error("Error updating todo:", error);
      }
   };

   const handleAddChecklistItem = () => {
      if (!newChecklistItem.trim()) return;

      const newItem = {
         _id: Date.now().toString(),
         text: newChecklistItem,
         completed: false,
      };

      setChecklist([...checklist, newItem]);
      setNewChecklistItem("");
   };

   const toggleChecklistItem = (itemId: string) => {
      setChecklist(checklist.map((item) => (item._id === itemId ? { ...item, completed: !item.completed } : item)));
   };

   const removeChecklistItem = (itemId: string) => {
      setChecklist(checklist.filter((item) => item._id !== itemId));
   };

   const assignUser = (user: userInterface) => {
      if (!assignedUsers.find((u) => u._id === user._id)) {
         setAssignedUsers([...assignedUsers, user]);
      }
   };

   const unassignUser = (userId: string) => {
      setAssignedUsers(assignedUsers.filter((user) => user._id !== userId));
   };

   const getPriorityColor = (priority: string) => {
      switch (priority) {
         case "urgent":
            return "bg-red-500";
         case "high":
            return "bg-orange-500";
         case "medium":
            return "bg-yellow-500";
         case "low":
            return "bg-green-500";
         default:
            return "bg-gray-500";
      }
   };

   if (!currentTodo) return null;

   return (
      <Modal show={isOpen} onClose={onClose} size="4xl" className="backdrop-blur-sm">
         <div className="bg-gray-900 text-white rounded-lg shadow-2xl border border-gray-700">
            <Modal.Header className="bg-gray-800 border-b border-gray-700 rounded-t-lg">
               <div className="flex items-center justify-between w-full">
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} onBlur={handleUpdateTodo} className="text-xl font-bold bg-transparent border-none outline-none text-white flex-1 mr-4" />
                  <button onClick={onClose} className="text-gray-400 hover:text-white">
                     <MdClose size={24} />
                  </button>
               </div>
            </Modal.Header>

            <Modal.Body className="bg-gray-900 p-6">
               <div className="grid grid-cols-3 gap-6">
                  {/* Main Content */}
                  <div className="col-span-2 space-y-6">
                     {/* Description */}
                     <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center">
                           <BsThreeDots className="mr-2" />
                           Description
                        </h3>
                        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} onBlur={handleUpdateTodo} placeholder="Add a more detailed description..." rows={4} className="bg-gray-800 border-gray-600 text-white resize-none" />
                     </div>

                     {/* Checklist */}
                     <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center">
                           <AiOutlineCheckSquare className="mr-2" />
                           Checklist
                        </h3>
                        <div className="space-y-2">
                           {checklist.map((item) => (
                              <div key={item._id} className="flex items-center space-x-3 p-2 bg-gray-800 rounded">
                                 <input type="checkbox" checked={item.completed} onChange={() => toggleChecklistItem(item._id)} className="w-4 h-4 text-teal-500 bg-gray-700 border-gray-600 rounded focus:ring-teal-500" />
                                 <span className={`flex-1 ${item.completed ? "line-through text-gray-500" : "text-white"}`}>{item.text}</span>
                                 <button onClick={() => removeChecklistItem(item._id)} className="text-red-400 hover:text-red-300">
                                    <MdClose size={16} />
                                 </button>
                              </div>
                           ))}
                           <div className="flex space-x-2">
                              <input type="text" value={newChecklistItem} onChange={(e) => setNewChecklistItem(e.target.value)} placeholder="Add an item" className="flex-1 bg-gray-800 border-gray-600 text-white rounded px-3 py-2" onKeyPress={(e) => e.key === "Enter" && handleAddChecklistItem()} />
                              <Button onClick={handleAddChecklistItem} className="bg-teal-500 hover:bg-teal-600">
                                 <AiOutlinePlus />
                              </Button>
                           </div>
                        </div>
                     </div>

                     {/* Comments */}
                     <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center">
                           <AiOutlineComment className="mr-2" />
                           Comments ({comments.length})
                        </h3>
                        <div className="space-y-4">
                           {comments.map((comment) => (
                              <div key={comment._id} className="bg-gray-800 p-4 rounded-lg">
                                 <div className="flex items-start space-x-3">
                                    <Avatar img={comment.user.avatar || `https://ui-avatars.com/api/?name=${comment.user.name}`} size="sm" rounded />
                                    <div className="flex-1">
                                       <div className="flex items-center space-x-2 mb-1">
                                          <span className="font-semibold text-white">{comment.user.name}</span>
                                          <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                       </div>
                                       <p className="text-gray-300">{comment.content}</p>
                                    </div>
                                 </div>
                              </div>
                           ))}
                           <div className="flex space-x-3">
                              <Textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Write a comment..." rows={3} className="flex-1 bg-gray-800 border-gray-600 text-white resize-none" />
                              <Button onClick={handleAddComment} className="bg-teal-500 hover:bg-teal-600 self-end">
                                 Send
                              </Button>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                     {/* Actions */}
                     <div>
                        <h3 className="text-lg font-semibold mb-3">Actions</h3>
                        <div className="space-y-2">
                           <Button className="w-full bg-gray-700 hover:bg-gray-600 text-left justify-start">
                              <AiOutlineUser className="mr-2" />
                              Members
                           </Button>
                           <Button className="w-full bg-gray-700 hover:bg-gray-600 text-left justify-start">
                              <AiOutlineCalendar className="mr-2" />
                              Due Date
                           </Button>
                           <Button className="w-full bg-gray-700 hover:bg-gray-600 text-left justify-start">
                              <AiOutlinePaperClip className="mr-2" />
                              Attachment
                           </Button>
                        </div>
                     </div>

                     {/* Priority */}
                     <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center">
                           <AiOutlineFlag className="mr-2" />
                           Priority
                        </h3>
                        <select value={priority} onChange={(e) => setPriority(e.target.value)} onBlur={handleUpdateTodo} className="w-full bg-gray-800 border-gray-600 text-white rounded px-3 py-2">
                           <option value="low">Low</option>
                           <option value="medium">Medium</option>
                           <option value="high">High</option>
                           <option value="urgent">Urgent</option>
                        </select>
                        <div className={`mt-2 h-2 rounded ${getPriorityColor(priority)}`}></div>
                     </div>

                     {/* Due Date */}
                     <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center">
                           <AiOutlineCalendar className="mr-2" />
                           Due Date
                        </h3>
                        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} onBlur={handleUpdateTodo} className="w-full bg-gray-800 border-gray-600 text-white rounded px-3 py-2" />
                     </div>

                     {/* Assigned Users */}
                     <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center">
                           <AiOutlineUser className="mr-2" />
                           Assigned Users
                        </h3>
                        <div className="space-y-2">
                           {assignedUsers.map((user) => (
                              <div key={user._id} className="flex items-center justify-between bg-gray-800 p-2 rounded">
                                 <div className="flex items-center space-x-2">
                                    <Avatar img={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} size="xs" rounded />
                                    <span className="text-sm">{user.name}</span>
                                 </div>
                                 <button onClick={() => unassignUser(user._id)} className="text-red-400 hover:text-red-300">
                                    <MdClose size={16} />
                                 </button>
                              </div>
                           ))}
                           <select
                              onChange={(e) => {
                                 const user = availableUsers.find((u) => u._id === e.target.value);
                                 if (user) assignUser(user);
                                 e.target.value = "";
                              }}
                              className="w-full bg-gray-800 border-gray-600 text-white rounded px-3 py-2">
                              <option value="">Assign user...</option>
                              {availableUsers
                                 .filter((user) => !assignedUsers.find((u) => u._id === user._id))
                                 .map((user) => (
                                    <option key={user._id} value={user._id}>
                                       {user.name}
                                    </option>
                                 ))}
                           </select>
                        </div>
                     </div>
                  </div>
               </div>
            </Modal.Body>
         </div>
      </Modal>
   );
};

export default TodoModal;
