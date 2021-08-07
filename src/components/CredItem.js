import { decryptJSON } from "../lib/utilities";
import { Trash, Share, PencilSquare } from "react-bootstrap-icons";

const CredItem = ({ cred, onDelete, onEdit, onShare }) => {
  return (
    <div className={"p-3 d-flex align-items-center justify-content-between "}>
      <span className={"form-group d-flex align-items-center "}>
        <span className={`ml-5 `}>
          <div className="login-main">
            <div className="login-card">
              <div className="login-icons">
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="login-img btn"
                >
                  <PencilSquare />
                </div>
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onShare();
                  }}
                  className="login-img btn"
                >
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
                <p>{decryptJSON(cred.credential).service}</p>
                <h5 className="fw-bold">Host</h5>
                <p>{decryptJSON(cred.credential).host}</p>
                <h5 className="fw-bold">Port</h5>
                <p>{decryptJSON(cred.credential).port}</p>
                <h5 className="fw-bold">User</h5>
                <p>{decryptJSON(cred.credential).user}</p>
                <h5 className="fw-bold">Password</h5>
                <p>{decryptJSON(cred.credential).pass}</p>
              </div>
            </div>
          </div>
        </span>
      </span>
    </div>
  );
};

export default CredItem;
