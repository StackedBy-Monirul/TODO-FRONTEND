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
  comments?: string[];
  level?: string;
  sorting?: number;
}
export default todoInterface;
