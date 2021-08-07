import { decryptJSON } from "../lib/utilities";
import { Trash, Share, PencilSquare } from "react-bootstrap-icons";
import { motion } from "framer-motion";

const CredItem = ({ cred, onDelete, onEdit, onShare }) => {
  return (
    <div className="m-0 my-2 m-md-3 ">
      <motion.div
        style={{ minWidth: "100%" }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ease: "easeOut", duration: 2 }}
        className="d-flex justify-content-center card p-3 shadow radify"
      >
        <div className="d-flex justify-content-between align-items-center">
          <div>#{JSON.stringify(cred.id)}</div>
          <div>
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit();
              }}
              className="btn btn-sm btn-primary text-white mx-1 radify"
            >
              <PencilSquare />
            </div>
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onShare();
              }}
              className="btn btn-sm btn-primary text-white mx-1 radify"
            >
              <Share />
            </div>
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete();
              }}
              className="btn btn-sm btn-primary text-white mx-1 radify"
            >
              <Trash />
            </div>
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
          <div className="bg-secondary radify-bottom p-2">
            <motion.div
              whileHover={{ opacity: "100%" }}
              style={{ opacity: "0%" }}
              className="p text-white "
            >
              {decryptJSON(cred.credential).pass}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CredItem;
