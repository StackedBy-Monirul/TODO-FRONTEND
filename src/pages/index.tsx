import * as React from "react";
import { navigate, type HeadFC, type PageProps } from "gatsby";
import Layout from "../components/Layout";
import GlassCard from "../components/GlassCard";
import AddSection from "../components/AddSection";
import axios from "axios";
import { Cookies } from "react-cookie";
import GetUser from "../components/GetUser";

const IndexPage: React.FC<PageProps> = () => {
  const [data, setData] = React.useState<any[]>([]);
  const [Token, setToken] = React.useState<string | null>(null);
  const { user, authenticated } = GetUser();
  const cookie = new Cookies();
  const sectionHandler = async (token: string) => {
    await axios
      .get("http://localhost:8000/api/v1/section/all", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token ? token : Token}`,
        },
      })
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        if (error.response.data.status) {
          navigate("/login");
        }
        console.log(error);
      });
  };
  const DataHandler = (newdata: any) => {
    setData([...data, newdata]);
  };
  React.useEffect(() => {
    const token = cookie.get("todo-token");
    if (token) {
      setToken(token.token);
      sectionHandler(token.token);
    }
  }, []);
  return (
    <Layout backgroundColor="#080710" activePage="home">
      <div className="flex gap-5 items-start">
        {data.map((item, index) => {
          return (
            <GlassCard
              key={index}
              title={item.name}
              id={item._id}
              user={user}
            />
          );
        })}

        <AddSection newData={DataHandler} userData={user} />
      </div>
    </Layout>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Home Page</title>;
