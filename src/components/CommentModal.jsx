import React, { useState } from "react";

const CommentModal = ({ isOpen, onClose, onSave, currComment }) => {
  const [comment, setComment] = useState("");

  const handleSave = () => {
    onSave(comment);
    setComment("");
    onClose();
  };

  return (
    <div className={`modal ${isOpen ? "visible" : "hidden"}`}>
      <div className="modal-content">
        <textarea
          defaultValue={currComment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add your comment..."
          autoFocus
          onFocus={(e) => e.target.select()}
        />
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default CommentModal;
