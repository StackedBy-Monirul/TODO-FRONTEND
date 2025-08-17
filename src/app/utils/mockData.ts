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
    checklist: [
      { _id: "check1", text: "Create wireframes", completed: true },
      { _id: "check2", text: "Design mockups", completed: false },
      { _id: "check3", text: "Implement responsive design", completed: false }
    ],
    sorting: 1
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
    checklist: [
      { _id: "check4", text: "Setup JWT middleware", completed: true },
      { _id: "check5", text: "Create login/register forms", completed: false }
    ],
    sorting: 2
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
    checklist: [],
    sorting: 1
  }
];

export const mockSections = [
  {
    _id: "section1",
    name: "To Do",
    project_id: null,
    user_id: "user1"
  },
  {
    _id: "section2", 
    name: "In Progress",
    project_id: null,
    user_id: "user1"
  },
  {
    _id: "section3",
    name: "Done",
    project_id: null,
    user_id: "user1"
  }
];

// LocalStorage utilities
export const LocalStorageKeys = {
  USERS: 'trello_users',
  TODOS: 'trello_todos', 
  SECTIONS: 'trello_sections',
  COMMENTS: 'trello_comments'
};

export const initializeLocalStorage = () => {
  if (typeof window === 'undefined') return;
  
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
};

export const getFromLocalStorage = (key: string) => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const saveToLocalStorage = (key: string, data: any) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
};