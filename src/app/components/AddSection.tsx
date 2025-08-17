import React, { FC, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { postAPI } from "./Api";
import { Cookies } from "react-cookie";

const AddSection: FC<{
  newData: (data: any) => void;
  userData: any;
}> = ({ newData, userData }) => {
  const [active, setActive] = useState<boolean>(false);
  const [sectionName, setSectionName] = useState<string>("");
  const cookie = new Cookies();
  const token: any = cookie.get("todo-token") || "";

  const submitHandler = async () => {
    if (!sectionName.trim()) return;

    try {
      const response = await postAPI("section/create", token?.token, {
        name: sectionName,
        user_id: userData?._id
      });

      if (response.status === 200 && response.data) {
        newData(response.data.data);
        setActive(false);
        setSectionName("");
      }
    } catch (error) {
      console.error("Error creating section:", error);
      // Fallback creation
      const newSection = {
        _id: `section_${Date.now()}`,
        name: sectionName,
        project_id: null,
        user_id: userData?._id
      };
      newData(newSection);
      setActive(false);
      setSectionName("");
    }
  };

  return (
    <div className="inline-block align-top mx-2 min-w-[400px]">
      {active ? (
        <div className="glass-card rounded-lg p-5 text-white animate-fade-in-up">
          <input
            type="text"
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
            placeholder="Enter section name..."
            className="w-full bg-transparent border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400 focus:border-teal-500 focus:outline-none mb-3"
            autoFocus
            onKeyPress={(e) => e.key === 'Enter' && submitHandler()}
          />
          <div className="flex space-x-2">
            <button
              onClick={submitHandler}
              className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded font-medium transition-colors"
            >
              Add Section
            </button>
            <button
              onClick={() => {
                setActive(false);
                setSectionName("");
              }}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => setActive(true)}
          className="glass-card hover:bg-gray-700/30 rounded-lg p-5 text-gray-300 hover:text-white cursor-pointer transition-all duration-300 border border-gray-600/50 hover:border-teal-500/50 min-h-[100px] flex items-center justify-center"
        >
          <div className="flex items-center space-x-2">
            <AiOutlinePlus className="text-xl" />
            <span className="font-medium">Add New Section</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddSection;