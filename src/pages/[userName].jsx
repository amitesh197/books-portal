import React from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function UserHistory() {
  const navigate = useNavigate();
  //get user name from url
  const { userName } = useParams();
  return (
    <div>
      <div
        onClick={() => {
          navigate("/dashboard");
        }}
      >
        back
      </div>
      <div>{userName}</div>
    </div>
  );
}
