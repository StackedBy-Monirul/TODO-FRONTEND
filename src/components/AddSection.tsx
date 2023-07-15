import React, { ChangeEventHandler, FC, useState } from "react";
import axios from "axios";
import { Cookies } from "react-cookie";

const AddSection: FC<{
  newData?: any;
  userData?: any;
}> = ({ newData, userData }) => {
  const [active, setActive] = useState<boolean>(false);
  const [newsection, setNewSection] = useState<string>("");
  const cookie = new Cookies();
  const token = cookie.get("todo-token");
  const submitHandler = async () => {
    await axios
      .post(
        "http://localhost:8000/api/v1/section/create",
        {
          name: newsection,
          user_id: userData && userData._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token && token.token}`,
          },
        }
      )
      .then((response) => {
        newData(response.data.data[0]);
        setNewSection("");
        setActive(!active);
      })
      .catch((error) => {});
  };
  return (
    <div className="p-3 min-w-[400px]">
      {active ? (
        <>
          <input
            className="px-2 text-white w-full py-5 bg-transparent border rounded"
            placeholder="Section Title"
            onChange={(e) => setNewSection(e.target.value)}
          />
          <div className="w-full flex items-center gap-5 mt-5">
            <button
              className="w-full bg-teal-500 text-black py-2 rounded"
              onClick={() => submitHandler()}
            >
              Submit
            </button>
            <button
              className="w-full bg-red-500 text-white py-2 rounded"
              onClick={() => setActive(!active)}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <div
          className="bg-gray-700 text-white text-lg px-3 py-4 w-full rounded hover:bg-darkop duration-300 transition-all cursor-pointer"
          onClick={() => setActive(!active)}
        >
          + Add Section
        </div>
      )}
    </div>
  );
};

export default AddSection;
