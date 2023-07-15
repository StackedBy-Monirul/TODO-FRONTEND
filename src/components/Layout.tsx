import React, { FC, useState, MouseEvent, useEffect } from "react";
import layoutInterface from "../interfaces/LayoutInterface";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import RandomObject from "./RandomObject";
import GetUser from "./GetUser";
const Layout: FC<layoutInterface> = ({
  backgroundColor,
  color,
  children,
  activePage,
}) => {
  const [mainHeight, setMainHeight] = useState<number>(0);
  const { user, authenticated } = GetUser();
  useEffect(() => {
    const height = window.innerHeight;
    setMainHeight(height - 100 - 20);
  });
  const style = {
    backgroundColor: backgroundColor,
    color: color,
  };
  const [active, setActive] = useState<boolean>(true);
  const [tagActive, setTagActive] = useState<boolean>(true);
  const [projectActive, setProjectActive] = useState<boolean>(true);
  const menuHandler = (e: MouseEvent<HTMLElement>) => {
    setActive(!active);
  };
  const tagHandler = (e: MouseEvent<HTMLElement>) => {
    setTagActive(!tagActive);
  };
  const projectHandler = (e: MouseEvent<HTMLElement>) => {
    setProjectActive(!projectActive);
  };
  return (
    user && (
      <div style={style} className="min-h-screen overflow-hidden relative">
        <Navbar active={active} onClick={menuHandler} />
        <RandomObject />
        <Sidebar
          activePage={activePage}
          active={active}
          tagActive={tagActive}
          tagClick={tagHandler}
          projectActive={projectActive}
          projectClick={projectHandler}
        />

        <main
          className={`min-w-[1400px] ${
            active ? "ml-[320px]" : "mx-auto"
          } pb-24 pt-10 overflow-x-scroll overflow-y-hidden relative z-40 scrollbar`}
          style={{ height: `${mainHeight}px` }}
        >
          {children}
        </main>
      </div>
    )
  );
};

export default Layout;
