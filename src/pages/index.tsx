import * as React from "react";
import { navigate, type HeadFC, type PageProps } from "gatsby";
import Layout from "../components/Layout";
import GlassCard from "../components/GlassCard";
import AddSection from "../components/AddSection";
import { Cookies } from "react-cookie";
import GetUser from "../components/GetUser";
import { getAPI } from "../components/Api";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";

const IndexPage: React.FC<PageProps> = () => {
  const [section, setSection] = React.useState<any[]>([]);
  const [todo, setTodo] = React.useState<any[]>([]);
  const [Token, setToken] = React.useState<string>("");
  const [mainHeight, setMainHeight] = React.useState<number>(0);
  const { user, authenticated } = GetUser();
  const cookie = new Cookies();
  const sectionHandler = (token: any) => {
    getAPI("section/all", token ? token : Token).then((res) => {
      if (res.status === 200 || (res.data && res.data.status === 200)) {
        setSection(res.data.data[0].section);
        setTodo(res.data.data[0].todo);
      }
    });
  };
  const DataHandler = (newdata: any) => {
    setSection([...section, newdata]);
  };

  const ondragend = (result: DropResult) => {
    const { destination, source, type } = result;
    if (!destination) return;
    if (type === "CARD") {
      const card = section;
      const remove = card.splice(source.index, 1);
      card.splice(destination.index, 0, remove[0]);
      setSection(card);
    }
  };

  React.useEffect(() => {
    const token = cookie.get("todo-token");
    if (token) {
      setToken(token.token);
      sectionHandler(token.token);
    }
    const height = window.innerHeight;
    setMainHeight(height - 100 - 20);
  }, []);
  return (
    <DragDropContext onDragEnd={ondragend}>
      <Layout backgroundColor="#080710" activePage="home">
        <Droppable
          droppableId="droppableCard"
          type="CARD"
          direction="horizontal"
          renderClone={(provided, snapshot, rubric) => (
            <div
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
            >
              <GlassCard
                title={section[rubric.source.index].name}
                id={section[rubric.source.index]._id}
                user={user}
                todo={todo[section[rubric.source.index]._id]}
              />
            </div>
          )}
        >
          {(provided, snapshot) => (
            <div
              className="whitespace-nowrap overflow-x-scroll overflow-y-hidden scrollbar pb-24 "
              ref={provided.innerRef}
              style={{
                backgroundColor: snapshot.isDraggingOver
                  ? "#00000042"
                  : "transparent",
                height: `${mainHeight}px`,
              }}
              {...provided.droppableProps}
            >
              {section.map((item, index) => {
                return (
                  <Draggable
                    draggableId={`draggable-${index}`}
                    index={index}
                    key={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        className="inline-block align-top mx-2"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <GlassCard
                          title={item.name}
                          id={item._id}
                          user={user}
                          todo={todo[item._id]}
                        />
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
              <AddSection newData={DataHandler} userData={user} />
            </div>
          )}
        </Droppable>
      </Layout>
    </DragDropContext>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Home Page</title>;
