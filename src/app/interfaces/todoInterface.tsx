import commentInterface from "./commentInterface";
import userInterface from "./userInterface";

interface todoInterface {
  _id: string;
  name: string;
  user?: string;
  description?: string;
  date: Date;
  section?: string;
  time?: string;
  tag?: string[];
  project?: string;
  comments?: commentInterface[];
  assignedUsers?: userInterface[];
  level?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date;
  attachments?: string[];
  sorting?: number;
  checklist?: {
    _id: string;
    text: string;
    completed: boolean;
  }[];
  updatedAt?: Date;
  createdAt?: Date;
}

interface dataMapInterface {
  id: string;
  todos: todoInterface[];
}

export type { todoInterface, dataMapInterface };