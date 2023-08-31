import React from "react";

export default function PrevVersionsModal({
  prevVerionsArray,
  prevVerModalOpen,
  setPrevVerModalOpen,
}) {
  console.log("prevVerionsArray", prevVerionsArray);

  const show = prevVerModalOpen ? "block" : "hidden";

  return (
    <div className={`modal ${show}`}>
      <div className="card">
        <div
          className="absolute right-4 text-xl top-2 cursor-pointer text-theme-dark hover:text-theme-yellow-dark"
          onClick={() => {
            setPrevVerModalOpen(false);
          }}
        >
          <i className="fa-solid fa-xmark"></i>
        </div>
        <div className="pt-5">
          <table className="table-auto border-collapse border w-full bg-theme-gray">
            <thead>
              <tr>
                <th className="border border-gray-500 px-3 py-2 bg-theme-yellow-dark ">
                  Date
                </th>
                <th className="border border-gray-500 px-3 py-2 bg-theme-yellow-dark">
                  Month
                </th>
                <th className="border border-gray-500 px-3 py-2 bg-theme-yellow-dark">
                  Year
                </th>
                <th className="border border-gray-500 px-3 py-2 bg-theme-yellow-dark">
                  Type
                </th>
                <th className="border border-gray-500 px-3 py-2 bg-theme-yellow-dark">
                  ClassName
                </th>
                <th className="border border-gray-500 px-3 py-2 bg-theme-yellow-dark">
                  Hours
                </th>
                <th className="border border-gray-500 px-3 py-2 bg-theme-yellow-dark">
                  Minutes
                </th>
                <th className="border border-gray-500 px-3 py-2 bg-theme-yellow-dark">
                  Comment
                </th>
                <th className="border border-gray-500 px-3 py-2 bg-theme-yellow-dark">
                  Edited
                </th>
              </tr>
            </thead>
            <tbody>
              {prevVerionsArray.map((version) => (
                <tr key={version.Id}>
                  <td className="border border-gray-500 px-3 py-2">
                    {version.Date}
                  </td>
                  <td className="border border-gray-500 px-3 py-2">
                    {version.Month}
                  </td>
                  <td className="border border-gray-500 px-3 py-2">
                    {version.Year}
                  </td>
                  <td className="border border-gray-500 px-3 py-2">
                    {version.Type}
                  </td>
                  <td className="border border-gray-500 px-3 py-2">
                    {version.ClassName}
                  </td>
                  <td className="border border-gray-500 px-3 py-2">
                    {version.Hours}
                  </td>
                  <td className="border border-gray-500 px-3 py-2">
                    {version.Minutes}
                  </td>
                  <td className="border border-gray-500 px-3 py-2">
                    {version.Comment}
                  </td>
                  <td className="border border-gray-500 px-3 py-2">
                    {version.Edited}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
