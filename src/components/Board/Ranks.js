import React from "react";

const Ranks = ({ ranks }) => (
  <div className="RANKS absolute top-0 left-[-50px] flex flex-col justify-center p-4">
    {ranks.map((rank) => (
      <div key={rank} className="h-[100px] flex text-dark_tile py-2">
        {rank}
      </div>
    ))}
  </div>
);

export default Ranks;
