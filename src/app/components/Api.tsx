import axios from "axios";
import { initializeLocalStorage, getFromLocalStorage, saveToLocalStorage, LocalStorageKeys } from "../utils/mockData";

// Initialize localStorage on first load
if (typeof window !== 'undefined') {
  initializeLocalStorage();
}

const BASE_URL = "http://localhost:8000/api/v1/";

// Mock API responses when real API is not available
const mockApiResponse = (data: any, status: number = 200) => ({
  status,
  data: {
    status,
    data,
    message: status === 200 ? "Success" : "Error"
  }
});

const generateId = () => `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const getAPI = async (endpoint: string, token?: string) => {
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return response;
  } catch (error) {
    console.log("API not available, using mock data for:", endpoint);
    
    // Handle different endpoints with mock data
    switch (endpoint) {
      case "auth/check":
        const mockUser = {
          _id: "user1",
          name: "John Doe",
          email: "john@example.com",
          avatar: "https://ui-avatars.com/api/?name=John+Doe",
          role: "admin"
        };
        return mockApiResponse(mockUser);
        
      case "users/all":
        const users = getFromLocalStorage(LocalStorageKeys.USERS) || [];
        return mockApiResponse(users);
        
      case "section/all":
        const sections = getFromLocalStorage(LocalStorageKeys.SECTIONS) || [];
        const todos = getFromLocalStorage(LocalStorageKeys.TODOS) || [];
        
        // Group todos by section
        const todosBySection = todos.reduce((acc: any, todo: any) => {
          if (!acc[todo.section]) {
            acc[todo.section] = [];
          }
          acc[todo.section].push(todo);
          return acc;
        }, {});
        
        const mappedTodos = sections.map((section: any) => ({
          id: section._id,
          todos: todosBySection[section._id] || []
        }));
        
        return mockApiResponse([{
          section: sections,
          todos: mappedTodos
        }]);
        
      default:
        return mockApiResponse(null, 404);
    }
  }
};

export const postAPI = async (endpoint: string, token?: string, data?: any) => {
  try {
    const response = await axios.post(`${BASE_URL}${endpoint}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return response;
  } catch (error) {
    console.log("API not available, using mock data for:", endpoint);
    
    switch (endpoint) {
      case "auth/login":
        // Mock login - always succeed for demo
        if (data?.email && data?.password) {
          const mockToken = `mock_token_${Date.now()}`;
          return mockApiResponse({
            token: mockToken,
            user: {
              _id: "user1",
              name: "John Doe",
              email: data.email,
              role: "admin"
            }
          });
        }
        return mockApiResponse(null, 401);
        
      case "section/create":
        const sections = getFromLocalStorage(LocalStorageKeys.SECTIONS) || [];
        const newSection = {
          _id: generateId(),
          name: data?.name || "New Section",
          project_id: data?.project_id || null,
          user_id: data?.user_id || "user1"
        };
        sections.push(newSection);
        saveToLocalStorage(LocalStorageKeys.SECTIONS, sections);
        return mockApiResponse(newSection);
        
      case "todo/create":
        const todos = getFromLocalStorage(LocalStorageKeys.TODOS) || [];
        const newTodo = {
          _id: generateId(),
          name: data?.name || "New Task",
          description: data?.description || "",
          user: data?.user || "user1",
          section: data?.section,
          date: new Date(),
          priority: data?.priority || "medium",
          dueDate: data?.dueDate || null,
          comments: [],
          assignedUsers: [],
          checklist: [],
          sorting: todos.filter((t: any) => t.section === data?.section).length + 1
        };
        todos.push(newTodo);
        saveToLocalStorage(LocalStorageKeys.TODOS, todos);
        return mockApiResponse([newTodo]);
        
      case "comments/create":
        const comments = getFromLocalStorage(LocalStorageKeys.COMMENTS) || [];
        const users = getFromLocalStorage(LocalStorageKeys.USERS) || [];
        const currentUser = users[0] || { _id: "user1", name: "John Doe", email: "john@example.com" };
        
        const newComment = {
          _id: generateId(),
          content: data?.content || "",
          user: currentUser,
          todo: data?.todo,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        comments.push(newComment);
        saveToLocalStorage(LocalStorageKeys.COMMENTS, comments);
        return mockApiResponse(newComment);
        
      case "users/create":
        const allUsers = getFromLocalStorage(LocalStorageKeys.USERS) || [];
        const newUser = {
          _id: generateId(),
          name: data?.name || "New User",
          email: data?.email || "user@example.com",
          role: data?.role || "member",
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data?.name || "New User")}`,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        allUsers.push(newUser);
        saveToLocalStorage(LocalStorageKeys.USERS, allUsers);
        return mockApiResponse(newUser);
        
      case "section/sort":
      case "todo/sort":
        // Mock sorting - just return success
        return mockApiResponse({ success: true });
        
      default:
        return mockApiResponse(null, 404);
    }
  }
};

export const putAPI = async (endpoint: string, token?: string, data?: any) => {
  try {
    const response = await axios.put(`${BASE_URL}${endpoint}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return response;
  } catch (error) {
    console.log("API not available, using mock data for:", endpoint);
    
    if (endpoint.startsWith("todo/")) {
      const todoId = endpoint.split("/")[1];
      const todos = getFromLocalStorage(LocalStorageKeys.TODOS) || [];
      const todoIndex = todos.findIndex((t: any) => t._id === todoId);
      
      if (todoIndex !== -1) {
        todos[todoIndex] = { ...todos[todoIndex], ...data };
        saveToLocalStorage(LocalStorageKeys.TODOS, todos);
        return mockApiResponse([todos[todoIndex]]);
      }
    }
    
    if (endpoint.startsWith("users/")) {
      const userId = endpoint.split("/")[1];
      const users = getFromLocalStorage(LocalStorageKeys.USERS) || [];
      const userIndex = users.findIndex((u: any) => u._id === userId);
      
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...data, updatedAt: new Date() };
        saveToLocalStorage(LocalStorageKeys.USERS, users);
        return mockApiResponse(users[userIndex]);
      }
    }
    
    return mockApiResponse(null, 404);
  }
};

export const deleteAPI = async (endpoint: string, token?: string) => {
  try {
    const response = await axios.delete(`${BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return response;
  } catch (error) {
    console.log("API not available, using mock data for:", endpoint);
    
    if (endpoint.startsWith("todo/")) {
      const todoId = endpoint.split("/")[1];
      const todos = getFromLocalStorage(LocalStorageKeys.TODOS) || [];
      const todoIndex = todos.findIndex((t: any) => t._id === todoId);
      
      if (todoIndex !== -1) {
        const deletedTodo = todos[todoIndex];
        todos.splice(todoIndex, 1);
        saveToLocalStorage(LocalStorageKeys.TODOS, todos);
        return mockApiResponse([{ id: deletedTodo._id }]);
      }
    }
    
    if (endpoint.startsWith("users/")) {
      const userId = endpoint.split("/")[1];
      const users = getFromLocalStorage(LocalStorageKeys.USERS) || [];
      const userIndex = users.findIndex((u: any) => u._id === userId);
      
      if (userIndex !== -1) {
        const deletedUser = users[userIndex];
        users.splice(userIndex, 1);
        saveToLocalStorage(LocalStorageKeys.USERS, users);
        return mockApiResponse({ id: deletedUser._id });
      }
    }
    
    return mockApiResponse(null, 404);
  }
};