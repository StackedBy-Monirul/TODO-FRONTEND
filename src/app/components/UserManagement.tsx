"use client";
import React, { FC, useState, useEffect } from "react";
import { Modal, Button, TextInput, Select, Avatar, Badge } from "flowbite-react";
import userInterface from "../interfaces/userInterface";
import { getAPI, postAPI, putAPI, deleteAPI } from "./Api";
import { Cookies } from "react-cookie";
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete, AiOutlineUser } from "react-icons/ai";
import { MdClose } from "react-icons/md";

interface UserManagementProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserManagement: FC<UserManagementProps> = ({ isOpen, onClose }) => {
  const [users, setUsers] = useState<userInterface[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<userInterface | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "member" as "admin" | "member" | "viewer"
  });
  const [loading, setLoading] = useState(false);

  const cookie = new Cookies();
  const token: any = cookie.get("todo-token") || "";

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await getAPI("users/all", token?.token);
      if (response.status === 200) {
        setUsers(response.data.data || []);
      }
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!formData.name.trim() || !formData.email.trim()) return;

    try {
      const response = await postAPI("users/create", token?.token, formData);
      if (response.status === 200) {
        setUsers([...users, response.data.data]);
        resetForm();
        setIsAddModalOpen(false);
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser || !formData.name.trim() || !formData.email.trim()) return;

    try {
      const response = await putAPI(`users/${editingUser._id}`, token?.token, formData);
      if (response.status === 200) {
        setUsers(users.map(user => 
          user._id === editingUser._id ? response.data.data : user
        ));
        resetForm();
        setEditingUser(null);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await deleteAPI(`users/${userId}`, token?.token);
      if (response.status === 200) {
        setUsers(users.filter(user => user._id !== userId));
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "member"
    });
  };

  const openEditModal = (user: userInterface) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role || "member"
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500';
      case 'member': return 'bg-blue-500';
      case 'viewer': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <>
      <Modal show={isOpen} onClose={onClose} size="6xl" className="backdrop-blur-sm">
        <div className="bg-gray-900 text-white rounded-lg shadow-2xl border border-gray-700">
          <Modal.Header className="bg-gray-800 border-b border-gray-700 rounded-t-lg">
            <div className="flex items-center justify-between w-full">
              <h2 className="text-xl font-bold flex items-center">
                <AiOutlineUser className="mr-2" />
                User Management
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <MdClose size={24} />
              </button>
            </div>
          </Modal.Header>

          <Modal.Body className="bg-gray-900 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Team Members ({users.length})</h3>
              <Button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-teal-500 hover:bg-teal-600"
              >
                <AiOutlinePlus className="mr-2" />
                Add User
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
                <p className="mt-4 text-gray-400">Loading users...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map((user) => (
                  <div key={user._id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center space-x-3 mb-3">
                      <Avatar
                        img={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`}
                        size="md"
                        rounded
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{user.name}</h4>
                        <p className="text-sm text-gray-400">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge className={`${getRoleColor(user.role || 'member')} text-white`}>
                        {user.role || 'member'}
                      </Badge>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="text-blue-400 hover:text-blue-300 p-1"
                        >
                          <AiOutlineEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <AiOutlineDelete size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-xs text-gray-500">
                      Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Modal.Body>
        </div>
      </Modal>

      {/* Add User Modal */}
      <Modal show={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} size="md">
        <div className="bg-gray-900 text-white rounded-lg shadow-2xl border border-gray-700">
          <Modal.Header className="bg-gray-800 border-b border-gray-700">
            <h3 className="text-lg font-semibold">Add New User</h3>
          </Modal.Header>
          <Modal.Body className="bg-gray-900 p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <TextInput
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter user name"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <TextInput
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Enter email address"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <Select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                  className="bg-gray-800 border-gray-600 text-white"
                >
                  <option value="viewer">Viewer</option>
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </Select>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="bg-gray-800 border-t border-gray-700">
            <Button onClick={handleAddUser} className="bg-teal-500 hover:bg-teal-600">
              Add User
            </Button>
            <Button 
              onClick={() => {
                setIsAddModalOpen(false);
                resetForm();
              }}
              className="bg-gray-600 hover:bg-gray-700"
            >
              Cancel
            </Button>
          </Modal.Footer>
        </div>
      </Modal>

      {/* Edit User Modal */}
      <Modal show={!!editingUser} onClose={() => setEditingUser(null)} size="md">
        <div className="bg-gray-900 text-white rounded-lg shadow-2xl border border-gray-700">
          <Modal.Header className="bg-gray-800 border-b border-gray-700">
            <h3 className="text-lg font-semibold">Edit User</h3>
          </Modal.Header>
          <Modal.Body className="bg-gray-900 p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <TextInput
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter user name"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <TextInput
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Enter email address"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <Select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                  className="bg-gray-800 border-gray-600 text-white"
                >
                  <option value="viewer">Viewer</option>
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </Select>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="bg-gray-800 border-t border-gray-700">
            <Button onClick={handleUpdateUser} className="bg-teal-500 hover:bg-teal-600">
              Update User
            </Button>
            <Button 
              onClick={() => {
                setEditingUser(null);
                resetForm();
              }}
              className="bg-gray-600 hover:bg-gray-700"
            >
              Cancel
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};

export default UserManagement;