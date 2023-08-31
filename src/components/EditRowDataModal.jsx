import React from "react";

export default function EditRowDataModal({
  setIsModalOpen,
  isModalOpen,
  rowData,
  handleEditRowData,
  editingRowData,
}) {
  //rowData is an object =
  /* {
      dataId,
      currentDay,
      currentMonth,
      currentYear,
      type,
      count,
      comment,
      edited
    }
*/
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const show = isModalOpen ? "block" : "hidden";

  const handleSubmit = (e) => {
    e.preventDefault();
    //putting the form data into an object
    const formData = {
      Id: rowData.Id,
      Date: e.target.date.value,
      Month: e.target.month.value,
      Year: e.target.year.value,
      Type: e.target.type.value,
      Count: e.target.count.value,
      Comment: e.target.comment.value,
      Edited: rowData.Edited + 1,
    };
    console.log("Form submitted", formData);
    handleEditRowData(formData);
  };

  return (
    <div className={`modal ${show}`}>
      <div className="card">
        <div
          className="absolute right-2 text-xl top-1 cursor-pointer text-theme-dark hover:text-theme-yellow-dark z-10 p-1"
          onClick={() => {
            setIsModalOpen(false);
          }}
        >
          <i className="fa-solid fa-xmark"></i>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-row gap-4 w-fit h-fit form relative"
        >
          <div className="flex flex-col">
            <label htmlFor="date">Date</label>
            <input
              className=" focus px-2 py-1 rounded-md"
              type="number"
              name="date"
              id="date"
              defaultValue={rowData.Date}
              required
            />

            <label htmlFor="month">Month</label>
            <select
              className="px-2 py-1 border rounded-md"
              name="month"
              id="month"
              required
              defaultValue={rowData.Month}
            >
              {monthNames.map((month, index) => (
                <option key={index} value={month}>
                  {month}
                </option>
              ))}
            </select>

            <label htmlFor="year">Year</label>
            <input
              type="number"
              name="year"
              id="year"
              defaultValue={rowData.Year}
              required
            />

            <label htmlFor="type">Type</label>
            <select
              className=""
              id="type"
              name="type"
              defaultValue={rowData.Type}
              required
            >
              <option value="call">Call</option>
              <option value="chat">Chat</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="count">Count</label>
            <input
              type="number"
              id="count"
              placeholder="Count"
              name="count"
              defaultValue={rowData.Count}
              required
            />

            <label htmlFor="comment">Comment</label>
            <textarea
              className="resize-none"
              name="comment"
              id="comment"
              defaultValue={rowData.Comment}
              placeholder="Reason for this edit"
              rows={3}
            ></textarea>
          </div>
          <div className="flex flex-row gap-3 absolute bottom-0 right-0">
            <button
              className="px-3 py-2 rounded-lg  text-theme-dark bg-theme-gray font-semibold hover:bg-theme-dark hover:text-theme-yellow-dark"
              onClick={() => {
                setIsModalOpen(false);
              }}
            >
              Cancel
            </button>
            <button
              className="px-3 py-2 rounded-lg  text-theme-dark bg-theme-yellow-dark font-semibold hover:bg-theme-dark hover:text-theme-yellow-dark w-20"
              type="submit"
              disabled={editingRowData}
            >
              {editingRowData ? (
                <i className="fa-solid fa-spinner animate-spin"></i>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
