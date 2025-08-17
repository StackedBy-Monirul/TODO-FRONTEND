interface commentInterface {
  _id: string;
  content: string;
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  todo: string;
  createdAt: Date;
  updatedAt: Date;
}

export default commentInterface;