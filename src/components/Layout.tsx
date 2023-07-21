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
  const { user, authenticated } = GetUser();

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
          } pt-10 relative z-40`}
        >
          {children}
        </main>
      </div>
    )
  );
};

export default Layout;
