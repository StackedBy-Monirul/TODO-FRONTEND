import React, { FC, memo } from "react";
import sectionInterface from "../interfaces/sectionInterface";
import { dataMapInterface } from "../interfaces/todoInterface";
import GlassCard from "./GlassCard";

const MemoCard: FC<{
  item: sectionInterface;
  user?: object | any;
  index: number;
  dataMap: dataMapInterface[];
}> = memo(({ item, user, index, dataMap }) => {
  const data = dataMap.find(
    (todo) => todo.id.toString() === item._id?.toString()
  );

  return (
    <GlassCard
      title={item.name ? item.name : ""}
      id={item._id}
      user={user}
      index={index}
      todos={data?.todos}
    />
  );
});

export default MemoCard;
