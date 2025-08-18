// Mock data for testing when API is not available
export const mockUsers = [
  {
    _id: "user1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://ui-avatars.com/api/?name=John+Doe",
    role: "admin" as const,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    _id: "user2", 
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "https://ui-avatars.com/api/?name=Jane+Smith",
    role: "member" as const,
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02")
  },
  {
    _id: "user3",
    name: "Mike Johnson", 
    email: "mike@example.com",
    avatar: "https://ui-avatars.com/api/?name=Mike+Johnson",
    role: "viewer" as const,
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-03")
  }
];

export const mockProjects = [
  {
    _id: "project1",
    name: "Website Redesign",
    color: "#3b82f6",
    description: "Complete redesign of company website",
    owner: "user1",
    members: ["user1", "user2"],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    _id: "project2",
    name: "Mobile App",
    color: "#10b981",
    description: "New mobile application development",
    owner: "user2",
    members: ["user2", "user3"],
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02")
  }
];

export const mockComments = [
  {
    _id: "comment1",
    content: "This task needs to be completed by end of week",
    user: mockUsers[0],
    todo: "todo1",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15")
  },
  {
    _id: "comment2",
    content: "I've started working on this",
    user: mockUsers[1], 
    todo: "todo1",
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-16")
  }
];

export const mockTodos = [
  {
    _id: "todo1",
    name: "Design new landing page",
    description: "Create a modern, responsive landing page with glass morphism effects",
    user: "user1",
    date: new Date("2024-01-20"),
    section: "section1",
    priority: "high" as const,
    dueDate: new Date("2024-01-25"),
    comments: mockComments,
    assignedUsers: [mockUsers[0], mockUsers[1]],
    attachments: [
      {
        _id: "att1",
        name: "design-mockup.png",
        url: "https://via.placeholder.com/400x300/3b82f6/ffffff?text=Design+Mockup",
        type: "image",
        size: 245760,
        uploadedBy: "user1",
        uploadedAt: new Date("2024-01-20")
      },
      {
        _id: "att2", 
        name: "requirements.pdf",
        url: "#",
        type: "document",
        size: 1048576,
        uploadedBy: "user2",
        uploadedAt: new Date("2024-01-21")
      }
    ],
    checklist: [
      { _id: "check1", text: "Create wireframes", completed: true },
      { _id: "check2", text: "Design mockups", completed: false },
      { _id: "check3", text: "Implement responsive design", completed: false }
    ],
    sorting: 1,
    project: "project1"
  },
  {
    _id: "todo2", 
    name: "Setup authentication system",
    description: "Implement secure user authentication with JWT tokens",
    user: "user2",
    date: new Date("2024-01-18"),
    section: "section1", 
    priority: "urgent" as const,
    dueDate: new Date("2024-01-22"),
    comments: [],
    assignedUsers: [mockUsers[1]],
    attachments: [],
    checklist: [
      { _id: "check4", text: "Setup JWT middleware", completed: true },
      { _id: "check5", text: "Create login/register forms", completed: false }
    ],
    sorting: 2,
    project: "project1"
  },
  {
    _id: "todo3",
    name: "Database optimization",
    description: "Optimize database queries for better performance",
    user: "user1", 
    date: new Date("2024-01-19"),
    section: "section2",
    priority: "medium" as const,
    dueDate: new Date("2024-01-30"),
    comments: [],
    assignedUsers: [mockUsers[2]],
    attachments: [],
    checklist: [],
    sorting: 1,
    project: "project2"
  }
];

export const mockNotifications = [
  {
    _id: "notif1",
    title: "Task assigned to you",
    message: "You have been assigned to 'Design new landing page'",
    type: "assignment",
    read: false,
    createdAt: new Date("2024-01-20T10:30:00"),
    user: "user1",
    relatedTodo: "todo1"
  },
  {
    _id: "notif2",
    title: "Due date approaching",
    message: "Task 'Setup authentication system' is due tomorrow",
    type: "due_date",
    read: false,
    createdAt: new Date("2024-01-21T09:00:00"),
    user: "user2",
    relatedTodo: "todo2"
  },
  {
    _id: "notif3",
    title: "Comment added",
    message: "John Doe commented on 'Design new landing page'",
    type: "comment",
    read: true,
    createdAt: new Date("2024-01-19T14:15:00"),
    user: "user1",
    relatedTodo: "todo1"
  }
];

export const mockSections = [
  {
    _id: "section1",
    name: "To Do",
    project_id: "project1",
    user_id: "user1"
  },
  {
    _id: "section2", 
    name: "In Progress",
    project_id: "project1",
    user_id: "user1"
  },
  {
    _id: "section3",
    name: "Done",
    project_id: "project1",
    user_id: "user1"
  }
];

// LocalStorage utilities
export const LocalStorageKeys = {
  USERS: 'trello_users',
  TODOS: 'trello_todos', 
  SECTIONS: 'trello_sections',
  COMMENTS: 'trello_comments',
  PROJECTS: 'trello_projects',
  CURRENT_USER: 'trello_current_user',
  AUTH_TOKEN: 'trello_auth_token',
  NOTIFICATIONS: 'trello_notifications'
};

export const initializeLocalStorage = () => {
  if (typeof window === 'undefined') return;
  
  try {
    if (!localStorage.getItem(LocalStorageKeys.USERS)) {
      localStorage.setItem(LocalStorageKeys.USERS, JSON.stringify(mockUsers));
    }
    if (!localStorage.getItem(LocalStorageKeys.TODOS)) {
      localStorage.setItem(LocalStorageKeys.TODOS, JSON.stringify(mockTodos));
    }
    if (!localStorage.getItem(LocalStorageKeys.SECTIONS)) {
      localStorage.setItem(LocalStorageKeys.SECTIONS, JSON.stringify(mockSections));
    }
    if (!localStorage.getItem(LocalStorageKeys.COMMENTS)) {
      localStorage.setItem(LocalStorageKeys.COMMENTS, JSON.stringify(mockComments));
    }
    if (!localStorage.getItem(LocalStorageKeys.PROJECTS)) {
      localStorage.setItem(LocalStorageKeys.PROJECTS, JSON.stringify(mockProjects));
    }
    if (!localStorage.getItem(LocalStorageKeys.NOTIFICATIONS)) {
      localStorage.setItem(LocalStorageKeys.NOTIFICATIONS, JSON.stringify(mockNotifications));
    }
  } catch (error) {
    console.error('Error initializing localStorage:', error);
  }
};

export const getFromLocalStorage = (key: string) => {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error parsing localStorage data:', error);
    return null;
  }
};

export const saveToLocalStorage = (key: string, data: any) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const generateId = () => `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Helper functions for mock data operations
export const findUserById = (userId: string) => {
  const users = getFromLocalStorage(LocalStorageKeys.USERS) || [];
  return users.find((user: any) => user._id === userId);
};

export const updateTodoInStorage = (todoId: string, updates: any) => {
  const todos = getFromLocalStorage(LocalStorageKeys.TODOS) || [];
  const todoIndex = todos.findIndex((todo: any) => todo._id === todoId);
  
  if (todoIndex !== -1) {
    todos[todoIndex] = { ...todos[todoIndex], ...updates, updatedAt: new Date() };
    saveToLocalStorage(LocalStorageKeys.TODOS, todos);
    return todos[todoIndex];
  }
  return null;
};

export const deleteTodoFromStorage = (todoId: string) => {
  const todos = getFromLocalStorage(LocalStorageKeys.TODOS) || [];
  const filteredTodos = todos.filter((todo: any) => todo._id !== todoId);
  saveToLocalStorage(LocalStorageKeys.TODOS, filteredTodos);
  return { id: todoId };
};