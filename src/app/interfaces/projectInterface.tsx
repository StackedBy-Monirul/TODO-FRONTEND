interface projectInterface {
  _id?: string;
  name?: string;
  color?: string;
  description?: string;
  owner?: string;
  members?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export default projectInterface;