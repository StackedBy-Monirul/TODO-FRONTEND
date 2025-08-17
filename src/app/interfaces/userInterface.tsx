interface userInterface {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: 'admin' | 'member' | 'viewer';
  createdAt: Date;
  updatedAt: Date;
}

export default userInterface;