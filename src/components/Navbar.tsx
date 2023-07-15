import React, { FC } from "react";
import { LiaBarsSolid } from "react-icons/lia";
import { TbArrowBack } from "react-icons/tb";

const Navbar: FC<{ active: boolean; onClick: any }> = ({ active, onClick }) => {
  return (
    <div className="border-b border-[#b3b3b3]">
      <div className="px-40 flex items-center justify-between">
        <div className="flex item-center justify-between">
          {!active ? (
            <LiaBarsSolid
              className="text-white text-3xl cursor-pointer"
              onClick={onClick}
            />
          ) : (
            <TbArrowBack
              className="text-white text-3xl cursor-pointer"
              onClick={onClick}
            />
          )}
        </div>
        <div className="flex item-center justify-between">
          <img src="https://ui-avatars.com/api/?name=John+Doe" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
