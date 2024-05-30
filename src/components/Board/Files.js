import React from "react";
import { getCharacter } from "./../../helper";

const Files = ({ files }) => (
  <div className="FILES absolute bottom-[-50px] left-0 flex w-[800px]">
    {files.map((file, index) => (
      <div
        key={file}
        className="w-[100px] flex justify-center items-center text-dark_tile p-4"
      >
        {getCharacter(index)}
      </div>
    ))}
  </div>
);

export default Files;
