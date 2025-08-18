import axios from "axios";
import { 
  initializeLocalStorage, 
  getFromLocalStorage, 
  saveToLocalStorage, 
  LocalStorageKeys,
  generateId,
  findUserById,
  updateTodoInStorage,
  deleteTodoFromStorage
} from "../utils/mockData";

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
        const currentUser = getFromLocalStorage(LocalStorageKeys.CURRENT_USER);
        if (currentUser) {
          return mockApiResponse(currentUser);
        }
        return mockApiResponse(null, 401);
        
      case "users/all":
        const users = getFromLocalStorage(LocalStorageKeys.USERS) || [];
        return mockApiResponse(users);
        
      case "projects/all":
        const projects = getFromLocalStorage(LocalStorageKeys.PROJECTS) || [];
        return mockApiResponse(projects);
        
      case "section/all":
        const sections = getFromLocalStorage(LocalStorageKeys.SECTIONS) || [];
        const todos = getFromLocalStorage(LocalStorageKeys.TODOS) || [];
        const comments = getFromLocalStorage(LocalStorageKeys.COMMENTS) || [];
        
        // Enhance todos with comments
        const enhancedTodos = todos.map((todo: any) => ({
          ...todo,
          comments: comments.filter((comment: any) => comment.todo === todo._id),
          assignedUsers: todo.assignedUsers || []
        }));
        
        // Group todos by section
        const todosBySection = enhancedTodos.reduce((acc: any, todo: any) => {
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
        if (endpoint.startsWith("comments/")) {
          const todoId = endpoint.split("/")[1];
          const comments = getFromLocalStorage(LocalStorageKeys.COMMENTS) || [];
          const todoComments = comments.filter((comment: any) => comment.todo === todoId);
          return mockApiResponse(todoComments);
        }
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
          const users = getFromLocalStorage(LocalStorageKeys.USERS) || [];
          let user = users.find((u: any) => u.email === data.email);
          
          // If user doesn't exist, create one
          if (!user) {
            user = {
              _id: generateId(),
              name: data.email.split('@')[0],
              email: data.email,
              role: "member",
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.email.split('@')[0])}`,
              createdAt: new Date(),
              updatedAt: new Date()
            };
            users.push(user);
            saveToLocalStorage(LocalStorageKeys.USERS, users);
          }
          
          const mockToken = `mock_token_${Date.now()}`;
          saveToLocalStorage(LocalStorageKeys.CURRENT_USER, user);
          saveToLocalStorage(LocalStorageKeys.AUTH_TOKEN, mockToken);
          
          return mockApiResponse({
            token: mockToken,
            user: user
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
        const users = getFromLocalStorage(LocalStorageKeys.USERS) || [];
        const currentUser = users.find((u: any) => u._id === data?.user) || users[0];
        
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
          assignedUsers: data?.assignedUsers ? data.assignedUsers.map((id: string) => findUserById(id)).filter(Boolean) : [],
          checklist: data?.checklist || [],
          sorting: todos.filter((t: any) => t.section === data?.section).length + 1,
          project: data?.project || null
        };
        todos.push(newTodo);
        saveToLocalStorage(LocalStorageKeys.TODOS, todos);
        return mockApiResponse([newTodo]);
        
      case "comments/create":
        const comments = getFromLocalStorage(LocalStorageKeys.COMMENTS) || [];
        const allUsers = getFromLocalStorage(LocalStorageKeys.USERS) || [];
        const currentUserForComment = getFromLocalStorage(LocalStorageKeys.CURRENT_USER) || allUsers[0];
        
        const newComment = {
          _id: generateId(),
          content: data?.content || "",
          user: currentUserForComment,
          todo: data?.todo,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        comments.push(newComment);
        saveToLocalStorage(LocalStorageKeys.COMMENTS, comments);
        return mockApiResponse(newComment);
        
      case "users/create":
        const existingUsers = getFromLocalStorage(LocalStorageKeys.USERS) || [];
        const newUser = {
          _id: generateId(),
          name: data?.name || "New User",
          email: data?.email || "user@example.com",
          role: data?.role || "member",
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data?.name || "New User")}`,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        existingUsers.push(newUser);
        saveToLocalStorage(LocalStorageKeys.USERS, existingUsers);
        return mockApiResponse(newUser);
        
      case "projects/create":
        const projects = getFromLocalStorage(LocalStorageKeys.PROJECTS) || [];
        const newProject = {
          _id: generateId(),
          name: data?.name || "New Project",
          color: data?.color || "#3b82f6",
          description: data?.description || "",
          owner: data?.owner || "user1",
          members: data?.members || [],
          createdAt: new Date(),
          updatedAt: new Date()
        };
        projects.push(newProject);
        saveToLocalStorage(LocalStorageKeys.PROJECTS, projects);
        return mockApiResponse(newProject);
        
      case "section/sort":
      case "todo/sort":
        // Mock sorting - just return success
        if (data?.data && Array.isArray(data.data)) {
          // Update sorting in localStorage
          const currentTodos = getFromLocalStorage(LocalStorageKeys.TODOS) || [];
          data.data.forEach((item: any) => {
            if (item.todos) {
              item.todos.forEach((todo: any, index: number) => {
                updateTodoInStorage(todo._id, { sorting: index });
              });
            }
          });
        }
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
      const updatedTodo = updateTodoInStorage(todoId, data);
      if (updatedTodo) {
        return mockApiResponse([updatedTodo]);
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
    
    if (endpoint.startsWith("projects/")) {
      const projectId = endpoint.split("/")[1];
      const projects = getFromLocalStorage(LocalStorageKeys.PROJECTS) || [];
      const projectIndex = projects.findIndex((p: any) => p._id === projectId);
      
      if (projectIndex !== -1) {
        projects[projectIndex] = { ...projects[projectIndex], ...data, updatedAt: new Date() };
        saveToLocalStorage(LocalStorageKeys.PROJECTS, projects);
        return mockApiResponse(projects[projectIndex]);
      }
    }
    
    if (endpoint.startsWith("sections/")) {
      const sectionId = endpoint.split("/")[1];
      const sections = getFromLocalStorage(LocalStorageKeys.SECTIONS) || [];
      const sectionIndex = sections.findIndex((s: any) => s._id === sectionId);
      
      if (sectionIndex !== -1) {
        sections[sectionIndex] = { ...sections[sectionIndex], ...data, updatedAt: new Date() };
        saveToLocalStorage(LocalStorageKeys.SECTIONS, sections);
        return mockApiResponse(sections[sectionIndex]);
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
      const result = deleteTodoFromStorage(todoId);
      return mockApiResponse([result]);
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
    
    if (endpoint.startsWith("projects/")) {
      const projectId = endpoint.split("/")[1];
      const projects = getFromLocalStorage(LocalStorageKeys.PROJECTS) || [];
      const projectIndex = projects.findIndex((p: any) => p._id === projectId);
      
      if (projectIndex !== -1) {
        const deletedProject = projects[projectIndex];
        projects.splice(projectIndex, 1);
        saveToLocalStorage(LocalStorageKeys.PROJECTS, projects);
        return mockApiResponse({ id: deletedProject._id });
      }
    }
    
    if (endpoint.startsWith("sections/")) {
      const sectionId = endpoint.split("/")[1];
      const sections = getFromLocalStorage(LocalStorageKeys.SECTIONS) || [];
      const sectionIndex = sections.findIndex((s: any) => s._id === sectionId);
      
      if (sectionIndex !== -1) {
        const deletedSection = sections[sectionIndex];
        sections.splice(sectionIndex, 1);
        saveToLocalStorage(LocalStorageKeys.SECTIONS, sections);
        
        // Also delete todos in this section
        const todos = getFromLocalStorage(LocalStorageKeys.TODOS) || [];
        const filteredTodos = todos.filter((todo: any) => todo.section !== sectionId);
        saveToLocalStorage(LocalStorageKeys.TODOS, filteredTodos);
        
        return mockApiResponse({ id: deletedSection._id });
      }
    }
    
    return mockApiResponse(null, 404);
  }
};