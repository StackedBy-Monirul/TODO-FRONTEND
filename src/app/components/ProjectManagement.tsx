"use client";
import React, { FC, useState, useEffect } from "react";
import { Modal, Button, TextInput, Textarea, Avatar, Badge } from "flowbite-react";
import projectInterface from "../interfaces/projectInterface";
import { getAPI, postAPI, putAPI, deleteAPI } from "./Api";
import { Cookies } from "react-cookie";
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete, AiOutlineFolderOpen } from "react-icons/ai";
import { MdClose, MdColorLens } from "react-icons/md";

interface ProjectManagementProps {
   isOpen: boolean;
   onClose: () => void;
}

const ProjectManagement: FC<ProjectManagementProps> = ({ isOpen, onClose }) => {
   const [projects, setProjects] = useState<projectInterface[]>([]);
   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
   const [editingProject, setEditingProject] = useState<projectInterface | null>(null);
   const [formData, setFormData] = useState({
      name: "",
      description: "",
      color: "#3b82f6",
   });
   const [loading, setLoading] = useState(false);

   const cookie = new Cookies();
   const token: any = cookie.get("todo-token") || "";

   const colorOptions = [
      "#3b82f6", "#10b981", "#f59e0b", "#ef4444", 
      "#8b5cf6", "#06b6d4", "#84cc16", "#f97316"
   ];

   useEffect(() => {
      if (isOpen) {
         loadProjects();
      }
   }, [isOpen]);

   const loadProjects = async () => {
      setLoading(true);
      try {
         const response = await getAPI("projects/all", token?.token);
         if (response.status === 200) {
            setProjects(Array.isArray(response.data.data) ? response.data.data : []);
         }
      } catch (error) {
         console.error("Error loading projects:", error);
         setProjects([]);
      } finally {
         setLoading(false);
      }
   };

   const handleAddProject = async () => {
      if (!formData.name.trim()) return;

      try {
         const response = await postAPI("projects/create", token?.token, formData);
         if (response.status === 200) {
            setProjects([...projects, response.data.data]);
            resetForm();
            setIsAddModalOpen(false);
         }
      } catch (error) {
         console.error("Error adding project:", error);
      }
   };

   const handleUpdateProject = async () => {
      if (!editingProject || !formData.name.trim()) return;

      try {
         const response = await putAPI(`projects/${editingProject._id}`, token?.token, formData);
         if (response.status === 200) {
            const updatedProject = response.data.data;
            setProjects(projects.map((project) => (project._id === editingProject._id ? updatedProject : project)));
            resetForm();
            setEditingProject(null);
         }
      } catch (error) {
         console.error("Error updating project:", error);
      }
   };

   const handleDeleteProject = async (projectId: string) => {
      if (!confirm("Are you sure you want to delete this project? This will also delete all associated sections and tasks.")) return;

      try {
         const response = await deleteAPI(`projects/${projectId}`, token?.token);
         if (response.status === 200) {
            setProjects(projects.filter((project) => project._id !== projectId));
         }
      } catch (error) {
         console.error("Error deleting project:", error);
      }
   };

   const resetForm = () => {
      setFormData({
         name: "",
         description: "",
         color: "#3b82f6",
      });
   };

   const openEditModal = (project: projectInterface) => {
      setEditingProject(project);
      setFormData({
         name: project.name || "",
         description: project.description || "",
         color: project.color || "#3b82f6",
      });
   };

   return (
      <>
         <Modal show={isOpen} onClose={onClose} size="6xl" className="backdrop-blur-sm">
            <div className="bg-gray-900 text-white rounded-lg shadow-2xl border border-gray-700">
               <Modal.Header className="bg-gray-800 border-b border-gray-700 rounded-t-lg">
                  <div className="flex items-center justify-between w-full">
                     <h2 className="text-xl font-bold flex items-center">
                        <AiOutlineFolderOpen className="mr-2" />
                        Project Management
                     </h2>
                     <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <MdClose size={24} />
                     </button>
                  </div>
               </Modal.Header>

               <Modal.Body className="bg-gray-900 p-6">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-lg font-semibold">Projects ({projects.length})</h3>
                     <Button onClick={() => setIsAddModalOpen(true)} className="bg-teal-500 hover:bg-teal-600">
                        <AiOutlinePlus className="mr-2" />
                        Add Project
                     </Button>
                  </div>

                  {loading ? (
                     <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
                        <p className="mt-4 text-gray-400">Loading projects...</p>
                     </div>
                  ) : (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projects.map((project) => (
                           <div key={project._id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                              <div className="flex items-start justify-between mb-3">
                                 <div className="flex items-center space-x-3">
                                    <div 
                                       className="w-4 h-4 rounded-full" 
                                       style={{ backgroundColor: project.color || "#3b82f6" }}
                                    ></div>
                                    <h4 className="font-semibold text-white">{project.name || 'Untitled Project'}</h4>
                                 </div>
                                 <div className="flex space-x-2">
                                    <button onClick={() => openEditModal(project)} className="text-blue-400 hover:text-blue-300 p-1">
                                       <AiOutlineEdit size={16} />
                                    </button>
                                    <button onClick={() => handleDeleteProject(project._id || '')} className="text-red-400 hover:text-red-300 p-1">
                                       <AiOutlineDelete size={16} />
                                    </button>
                                 </div>
                              </div>

                              {project.description && (
                                 <p className="text-sm text-gray-400 mb-3">{project.description}</p>
                              )}

                              <div className="flex items-center justify-between text-xs text-gray-500">
                                 <span>Created: {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Unknown'}</span>
                                 <Badge className="bg-gray-700 text-gray-300">
                                    {project.members?.length || 0} members
                                 </Badge>
                              </div>
                           </div>
                        ))}
                     </div>
                  )}
               </Modal.Body>
            </div>
         </Modal>

         {/* Add Project Modal */}
         <Modal show={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} size="md">
            <div className="bg-gray-900 text-white rounded-lg shadow-2xl border border-gray-700">
               <Modal.Header className="bg-gray-800 border-b border-gray-700">
                  <h3 className="text-lg font-semibold">Add New Project</h3>
               </Modal.Header>
               <Modal.Body className="bg-gray-900 p-6">
                  <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium mb-2">Project Name</label>
                        <TextInput 
                           value={formData.name} 
                           onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                           placeholder="Enter project name" 
                           className="bg-gray-800 border-gray-600 text-white" 
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <Textarea 
                           value={formData.description} 
                           onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                           placeholder="Enter project description" 
                           rows={3}
                           className="bg-gray-800 border-gray-600 text-white resize-none" 
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium mb-2 flex items-center">
                           <MdColorLens className="mr-2" />
                           Project Color
                        </label>
                        <div className="flex space-x-2">
                           {colorOptions.map((color) => (
                              <button
                                 key={color}
                                 onClick={() => setFormData({ ...formData, color })}
                                 className={`w-8 h-8 rounded-full border-2 ${
                                    formData.color === color ? 'border-white' : 'border-gray-600'
                                 }`}
                                 style={{ backgroundColor: color }}
                              />
                           ))}
                        </div>
                     </div>
                  </div>
               </Modal.Body>
               <Modal.Footer className="bg-gray-800 border-t border-gray-700">
                  <Button onClick={handleAddProject} className="bg-teal-500 hover:bg-teal-600">
                     Add Project
                  </Button>
                  <Button
                     onClick={() => {
                        setIsAddModalOpen(false);
                        resetForm();
                     }}
                     className="bg-gray-600 hover:bg-gray-700">
                     Cancel
                  </Button>
               </Modal.Footer>
            </div>
         </Modal>

         {/* Edit Project Modal */}
         <Modal show={!!editingProject} onClose={() => setEditingProject(null)} size="md">
            <div className="bg-gray-900 text-white rounded-lg shadow-2xl border border-gray-700">
               <Modal.Header className="bg-gray-800 border-b border-gray-700">
                  <h3 className="text-lg font-semibold">Edit Project</h3>
               </Modal.Header>
               <Modal.Body className="bg-gray-900 p-6">
                  <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium mb-2">Project Name</label>
                        <TextInput 
                           value={formData.name} 
                           onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                           placeholder="Enter project name" 
                           className="bg-gray-800 border-gray-600 text-white" 
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <Textarea 
                           value={formData.description} 
                           onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                           placeholder="Enter project description" 
                           rows={3}
                           className="bg-gray-800 border-gray-600 text-white resize-none" 
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium mb-2 flex items-center">
                           <MdColorLens className="mr-2" />
                           Project Color
                        </label>
                        <div className="flex space-x-2">
                           {colorOptions.map((color) => (
                              <button
                                 key={color}
                                 onClick={() => setFormData({ ...formData, color })}
                                 className={`w-8 h-8 rounded-full border-2 ${
                                    formData.color === color ? 'border-white' : 'border-gray-600'
                                 }`}
                                 style={{ backgroundColor: color }}
                              />
                           ))}
                        </div>
                     </div>
                  </div>
               </Modal.Body>
               <Modal.Footer className="bg-gray-800 border-t border-gray-700">
                  <Button onClick={handleUpdateProject} className="bg-teal-500 hover:bg-teal-600">
                     Update Project
                  </Button>
                  <Button
                     onClick={() => {
                        setEditingProject(null);
                        resetForm();
                     }}
                     className="bg-gray-600 hover:bg-gray-700">
                     Cancel
                  </Button>
               </Modal.Footer>
            </div>
         </Modal>
      </>
   );
};

export default ProjectManagement;