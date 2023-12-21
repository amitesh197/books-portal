import React, { useState } from "react";

const ChangeStatusModal = ({
  isOpen,
  onClose,
  handleChangeStatus,
  currentStatus,
}) => {
  const [status, setStatus] = useState("");

  const handleSave = ({ status }) => {
    handleChangeStatus(status);
    onClose();
  };

  return (
    <div className={`modal `}>
      {currentStatus === "Pending" ? (
        <div className="modal-content">
          Are you sure you want to change the status?
          <br /> This will send an email to the student.
          <button
            onClick={() => {
              handleSave({ status: "Done" });
            }}
            className="bg-green-500"
          >
            Mark Done
          </button>
          <button onClick={onClose}>Cancel</button>
        </div>
      ) : (
        <div className="modal-content ">
          Are you sure you want to change the status ?
          <button
            onClick={() => {
              handleSave({ status: "Pending" });
            }}
            className="bg-red-500"
          >
            Mark Pending
          </button>
          <button onClick={onClose}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default ChangeStatusModal;
