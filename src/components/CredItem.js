import { useState } from "react";
import { supabase } from "../lib/api";
import { decodeJSON } from "../lib/utilities";
import { Trash, Share, PencilSquare } from "react-bootstrap-icons";
import logo from "../assets/img/accio.svg";

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
        {/* <input
          className="form-check-input p-2 m-3"
          onChange={toggleCompleted}
          type="checkbox"
          checked={isCompleted ? true : ""}
        /> */}
        <span className={`ml-5 ${isCompleted ? "line-through" : ""}`}>
          <div className="login-main">
            <div className="login-card">
              <div className="login-icons">
                <div className="login-img btn">
                  <PencilSquare />
                </div>
                <div className="login-img btn">
                  <Share />
                </div>
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="login-img btn"
                >
                  <Trash />
                </div>
              </div>
              <div className="details">
                <h5 className="fw-bold">Service</h5>
                <p>{decodeJSON(cred.credential).service}</p>
                <h5 className="fw-bold">Host</h5>
                <p>{decodeJSON(cred.credential).host}</p>
                <h5 className="fw-bold">Port</h5>
                <p>{decodeJSON(cred.credential).port}</p>
                <h5 className="fw-bold">User</h5>
                <p>{decodeJSON(cred.credential).user}</p>
                <h5 className="fw-bold">Password</h5>
                <p>{decodeJSON(cred.credential).pass}</p>
              </div>
            </div>
          </div>
        </span>
      </span>
    </div>
  );
};

export default CredItem;
