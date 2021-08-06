import { useState } from "react";
import { supabase } from "../lib/api";
import { decodeJSON } from "../lib/utilities";

const CredItem = ({ cred, onDelete }) => {
  const [isCompleted, setIsCompleted] = useState(cred.is_complete);

  const toggleCompleted = async () => {
    const { data, error } = await supabase
      .from("creds")
      .update({ is_complete: !isCompleted })
      .eq("id", cred.id)
      .single();
    if (error) {
      console.error(error);
    }
    setIsCompleted(data.is_complete);
  };

  return (
    <div className={"p-3 d-flex align-items-center justify-content-between "}>
      <span className={"form-group d-flex align-items-center "}>
        <input
          className="form-check-input p-2 m-3"
          onChange={toggleCompleted}
          type="checkbox"
          checked={isCompleted ? true : ""}
        />
        <span className={`ml-5 ${isCompleted ? "line-through" : ""}`}>
          {JSON.stringify(decodeJSON(cred.credential, supabase.auth.user().id))}
        </span>
      </span>
      <button
        className={"btn btn-danger badge-pill text-white px-2"}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDelete();
        }}
      >
        x
      </button>
    </div>
  );
};

export default CredItem;
