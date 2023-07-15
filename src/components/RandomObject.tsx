import React, { FC, CSSProperties } from "react";

const RandomObject: FC = () => {
  const styles: CSSProperties[] = [
    {
      position: "absolute",
      top: "500px",
      left: "200px",
      height: "200px",
      width: "200px",
      borderRadius: "100%",
      background: "#673ab7",
      opacity: "0.8",
    },
    {
      position: "absolute",
      top: "300px",
      left: "800px",
      height: "100px",
      width: "100px",
      borderRadius: "100%",
      background:
        "linear-gradient(153deg,rgba(107,99,247,1)0%,rgba(76,76,255,1)42%,rgba(0,212,255,1)100%)",
      opacity: "0.8",
    },
    {
      position: "absolute",
      top: "800px",
      left: "800px",
      height: "200px",
      width: "200px",
      borderRadius: "100%",
      background:
        "linear-gradient(153deg,rgba(252,0,255,1)0%,rgba(0,219,222,1)100%)",
      opacity: "0.8",
    },
    {
      position: "absolute",
      top: "100px",
      left: "1500px",
      height: "200px",
      width: "200px",
      borderRadius: "100%",
      background:
        "linear-gradient(211deg,rgba(123,67,151,1)0%,rgba(220,36,48,1)100%)",
      opacity: "0.8",
    },
  ];
  return (
    <>
      {styles &&
        styles
          .map((value, index) => {
            const order = Math.floor(Math.random() * (index + 1));
            return { value, order };
          })
          .sort((a, b) => a.order - b.order)
          .map((item, index) => <div key={index} style={item.value}></div>)}
    </>
  );
};

export default RandomObject;
