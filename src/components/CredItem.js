import { decryptJSON } from "../lib/utilities";
import { Trash, Share, PencilSquare } from "react-bootstrap-icons";
import { motion } from "framer-motion";

const CredItem = ({ cred, onDelete, onEdit, onShare }) => {
  return (
    <motion.div
      style={{ minWidth: "100%" }}
      initial={{ opacity: "0%" }}
      animate={{ opacity: "100%" }}
      className="d-flex justify-content-center card p-3 m-2 shadow"
    >
      <div className="d-flex justify-content-between">
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onEdit();
          }}
          className="btn btn-sm btn-primary text-white mx-1"
        >
          <PencilSquare />
        </div>
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onShare();
          }}
          className="btn btn-sm btn-primary text-white mx-1"
        >
          <Share />
        </div>
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete();
          }}
          className="btn btn-sm btn-primary text-white mx-1"
        >
          <Trash />
        </div>
      </div>
      <div className="mt-5">
        <h5 className="fw-bold">Service</h5>
        <p>{decryptJSON(cred.credential).service}</p>
        <h5 className="fw-bold">Host</h5>
        <p>{decryptJSON(cred.credential).host}</p>
        <h5 className="fw-bold">Port</h5>
        <p>{decryptJSON(cred.credential).port}</p>
        <h5 className="fw-bold">User</h5>
        <p>{decryptJSON(cred.credential).user}</p>
        <h5 className="fw-bold">Password</h5>
        <div className="bg-dark rounded p-2">
          <motion.div
            whileHover={{ opacity: "100%" }}
            style={{ opacity: "0%" }}
            className="p text-white"
          >
            {decryptJSON(cred.credential).pass}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CredItem;
