import { useState } from "react";
import { supabase } from "../lib/api";

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
    <div className={"p-3 max-h-14 flex align-center justify-between border"}>
      <span className={"truncate flex-grow"}>
        <input
          className="cursor-pointer mr-2"
          onChange={toggleCompleted}
          type="checkbox"
          checked={isCompleted ? true : ""}
        />
        <span
          className={`w-full flex-grow ${isCompleted ? "line-through" : ""}`}
        >
          {cred.credential}
        </span>
      </span>
      <button
        className={"font-mono text-red-500 text-xl border px-2"}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDelete();
        }}
      >
        X
      </button>
    </div>
  );
};

export default CredItem;
