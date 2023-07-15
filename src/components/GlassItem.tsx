import React, { FC } from "react";
import { AiFillEdit } from "react-icons/ai";

const GlassItem: FC<{ title?: string }> = ({ title }) => {
  return (
    <div className="p-2 bg-darkop rounded-md group mb-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-base text-[#e0e0e0]">{title}</p>
        <div className="p-2 rounded bg-[#50505036] group-hover:opacity-100 opacity-0 transition-all duration-300 cursor-pointer">
          <AiFillEdit className="text-white text-base group-hover:opacity-100 opacity-0 transition-all duration-300" />
        </div>
      </div>
    </div>
  );
};

export default GlassItem;
