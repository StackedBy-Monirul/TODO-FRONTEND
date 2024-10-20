import React, { FC, memo } from "react";
import sectionInterface from "../interfaces/sectionInterface";
import { dataMapInterface, todoInterface } from "../interfaces/todoInterface";
import GlassCard from "./GlassCard";
import GlassItem from "./GlassItem";

const MemoList: FC<{
  dataMap: todoInterface[];
}> = memo(({ dataMap }) => {
  return (
    dataMap &&
    dataMap.map((data, index) => (
      <GlassItem item={data} key={data._id} />
    ))
  );
});

export default MemoList;
