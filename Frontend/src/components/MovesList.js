import React, { useState, useEffect } from "react";

const MovesTable = ({ moves = [] }) => {
  const [movesData, setMovesData] = useState([]);

  useEffect(() => {
    // Only update movesData if the moves prop changes or is different from the current movesData
    if (
      Array.isArray(moves) &&
      JSON.stringify(moves) !== JSON.stringify(movesData)
    ) {
      setMovesData(moves);
    }
  }, [moves, movesData]); // Adding movesData to the dependency array

  if (movesData.length === 0) {
    return <div></div>; // Fallback message
  }

  return (
    <div className="bg-black">
      <div className="bg-gray-900 border border-gray-800 rounded shadow p-4">
        <h2 className="text-lg font-bold mb-4 text-white">Moves Table</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-slate-400">
            <thead>
              <tr>
                <th className="px-4 py-2 bg-gray-800 text-white border border-gray-700">
                  From
                </th>
                <th className="px-4 py-2 bg-gray-800 text-white border border-gray-700">
                  To
                </th>
              </tr>
            </thead>
            <tbody>
              {movesData.map((move, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"}
                >
                  <td className="px-4 py-2 text-white border border-gray-700">
                    {move.from}
                  </td>
                  <td className="px-4 py-2 text-white border border-gray-700">
                    {move.to}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MovesTable;
