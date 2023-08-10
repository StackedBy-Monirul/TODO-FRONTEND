import projectInterface from "./projectInterface";
import todoInterface from "./todoInterface";

interface sectionInterface {
  _id?: string;
  name?: string;
  project_id?: projectInterface;
  user_id?: any;
  todos?: todoInterface[];
}

export default sectionInterface;
