import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/api";
import RecoverPassword from "../components/RecoverPassword";
import CredItem from "../components/CredItem";
import { encryptJSON, decryptJSON } from "../lib/utilities";
import { motion } from "framer-motion";

import { sendMail } from "../lib/sendinblue";

import { Button, Modal } from "react-bootstrap";

const Home = ({ user }) => {
  const [recoveryToken, setRecoveryToken] = useState(null);
  const [creds, setCreds] = useState([]);
  const [currentCredId, setCurrentCredId] = useState(null);
  const [shareCredential, setShareCredential] = useState(null);
  const [errorText, setError] = useState("");

  const [showShareModal, setShowShareModal] = useState(false);

  const emailTextRef = useRef();
  const nameTextRef = useRef();

  const newCredentialPassTextRef = useRef();
  const newCredentialUserTextRef = useRef();
  const newCredentialPortTextRef = useRef();
  const newCredentialHostTextRef = useRef();
  const newCredentialServiceTextRef = useRef();

  const searchCredentialTextRef = useRef();

  const storeButtonRef = useRef();

  useEffect(() => {
    /* Recovery url is of the form
     * <SITE_URL>#access_token=x&refresh_token=y&expires_in=z&token_type=bearer&type=recovery
     * Read more on https://supabase.io/docs/reference/javascript/reset-password-email#notes
     */
    let url = window.location.hash;
    let query = url.substr(1);
    let result = {};

    query.split("&").forEach((part) => {
      const item = part.split("=");
      result[item[0]] = decodeURIComponent(item[1]);
    });

    if (result.type === "recovery") {
      setRecoveryToken(result.access_token);
    }

    fetchCreds().catch(console.error);
  }, []);

  const fetchCreds = async () => {
    let { data: creds, error } = await supabase
      .from("creds")
      .select("*")
      .order("id", { ascending: false });
    if (error) console.log("error", error);
    else setCreds(creds);
  };

  const searchCred = async () => {
    let { data: creds } = await supabase
      .from("creds")
      .select("*")
      .order("id", { ascending: false });

    let resultCreds = [];
    for (let cred of creds) {
      if (
        JSON.stringify(decryptJSON(cred.credential))
          .toLowerCase()
          .indexOf(
            searchCredentialTextRef.current.value.trim().toLowerCase()
          ) !== -1
      ) {
        resultCreds.push(cred);
      }
    }
    setCreds(resultCreds);
  };

  const deleteCred = async (id) => {
    try {
      await supabase.from("creds").delete().eq("id", id);
      setCreds(creds.filter((x) => x.id !== id));
    } catch (error) {
      console.log("error", error);
    }
  };

  const shareCred = async (id) => {
    let { data: creds, error } = await supabase
      .from("creds")
      .select("*")
      .eq("id", id);
    if (error) console.log("error", error);

    setShareCredential(decryptJSON(creds[0].credential));

    setShowShareModal(true);
  };

  const editCred = async (id) => {
    let { data: creds, error } = await supabase
      .from("creds")
      .select("*")
      .eq("id", id);
    if (error) console.log("error", error);

    newCredentialPassTextRef.current.value = decryptJSON(
      creds[0].credential
    ).pass;
    newCredentialUserTextRef.current.value = decryptJSON(
      creds[0].credential
    ).user;
    newCredentialPortTextRef.current.value = decryptJSON(
      creds[0].credential
    ).port;
    newCredentialHostTextRef.current.value = decryptJSON(
      creds[0].credential
    ).host;
    newCredentialServiceTextRef.current.value = decryptJSON(
      creds[0].credential
    ).service;

    setCurrentCredId(id);
  };

  const updateCred = async () => {
    if (currentCredId !== null) {
      //console.log(id);
      let credentialPass = newCredentialPassTextRef.current.value.trim();
      let credentialUser = newCredentialUserTextRef.current.value.trim();
      let credentialPort = newCredentialPortTextRef.current.value.trim();
      let credentialHost = newCredentialHostTextRef.current.value.trim();
      let credentialService = newCredentialServiceTextRef.current.value.trim();
      let credential = {
        service: credentialService,
        host: credentialHost,
        port: credentialPort,
        user: credentialUser,
        pass: credentialPass,
      };

      if (
        credentialService === "" ||
        credentialHost === "" ||
        credentialUser === "" ||
        credentialPass === ""
      ) {
        setError("Incomplete Credentials");
      } else {
        let { data: error } = await supabase
          .from("creds")
          .update({ credential: encryptJSON(credential) })
          .eq("id", currentCredId);
        if (error) setError(error.message);
        else {
          fetchCreds();
          setError(null);
          newCredentialServiceTextRef.current.value = "";
          newCredentialHostTextRef.current.value = "";
          newCredentialPortTextRef.current.value = "";
          newCredentialUserTextRef.current.value = "";
          newCredentialPassTextRef.current.value = "";
        }
      }
    } else {
      let credentialPass = newCredentialPassTextRef.current.value.trim();
      let credentialUser = newCredentialUserTextRef.current.value.trim();
      let credentialPort = newCredentialPortTextRef.current.value.trim();
      let credentialHost = newCredentialHostTextRef.current.value.trim();
      let credentialService = newCredentialServiceTextRef.current.value.trim();
      let credential = {
        service: credentialService,
        host: credentialHost,
        port: credentialPort,
        user: credentialUser,
        pass: credentialPass,
      };

      if (
        credentialService === "" ||
        credentialHost === "" ||
        credentialUser === "" ||
        credentialPass === ""
      ) {
        setError("Incomplete Credentials");
      } else {
        let { data: cred, error } = await supabase
          .from("creds")
          .insert({ credential: encryptJSON(credential), user_id: user.id })
          .single();
        if (error) setError(error.message);
        else {
          setCreds([cred, ...creds]);
          setError(null);
          newCredentialServiceTextRef.current.value = "";
          newCredentialHostTextRef.current.value = "";
          newCredentialPortTextRef.current.value = "";
          newCredentialUserTextRef.current.value = "";
          newCredentialPassTextRef.current.value = "";
        }
      }
    }
  };

  function ShareModal() {
    const handleClose = () => setShowShareModal(false);

    const handleShare = () => {
      sendMail(
        emailTextRef.current.value.trim(),
        nameTextRef.current.value,
        shareCredential
      );
    };

    return (
      <Modal show={showShareModal} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Share</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="p">Do not send your credentials to untrusted emails.</p>
          <p className="p">Are you sure you want to share this credential?</p>
          <div className="p-3 bg-dark text-white mb-5">
            <code>{JSON.stringify(shareCredential)}</code>
          </div>
          <div className="bg-danger">
            <motion.input
              whileHover={{ height: 100 }}
              whileFocus={{ scale: 1.2 }}
              ref={emailTextRef}
              type="text"
              placeholder="Email"
              className={"p-3 d-flex bg-dark text-white rounded"}
              style={{ width: "100%" }}
            />
            <motion.input
              whileHover={{ height: 100 }}
              whileFocus={{ scale: 1.2 }}
              ref={nameTextRef}
              type="text"
              placeholder="Name"
              className={"p-3 d-flex bg-dark text-white rounded"}
              style={{ width: "100%" }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleShare}>
            Share
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return recoveryToken ? (
    <RecoverPassword
      token={recoveryToken}
      setRecoveryToken={setRecoveryToken}
    />
  ) : (
    <div className={"d-flex flex-column "}>
      <ShareModal />
      <div className=" card-body shadow rounded">
        <div className={"d-flex"}>
          <motion.input
            style={{ width: 200 }}
            whileHover={{ scale: 1.2 }}
            whileFocus={{ scale: 1.2 }}
            ref={newCredentialServiceTextRef}
            type="text"
            placeholder="Service"
            onKeyUp={(e) => e.key === "Enter" && updateCred()}
            className={"p-3 form-control bg-dark text-white"}
          />
          <motion.input
            style={{ width: 200 }}
            whileHover={{ scale: 1.2 }}
            whileFocus={{ scale: 1.2 }}
            ref={newCredentialHostTextRef}
            type="text"
            placeholder="Host"
            onKeyUp={(e) => e.key === "Enter" && updateCred()}
            className={"p-3 form-control bg-dark text-white"}
          />
          <motion.input
            style={{ width: 200 }}
            whileHover={{ scale: 1.2 }}
            whileFocus={{ scale: 1.2 }}
            ref={newCredentialPortTextRef}
            type="text"
            placeholder="Port"
            onKeyUp={(e) => e.key === "Enter" && updateCred()}
            className={"p-3 form-control bg-dark text-white"}
          />
          <motion.input
            style={{ width: 200 }}
            whileHover={{ scale: 1.2 }}
            whileFocus={{ scale: 1.2 }}
            ref={newCredentialUserTextRef}
            type="text"
            placeholder="User"
            onKeyUp={(e) => e.key === "Enter" && updateCred()}
            className={"p-3 form-control bg-dark text-white"}
          />
          <motion.input
            style={{ width: 200 }}
            whileHover={{ scale: 1.2 }}
            whileFocus={{ scale: 1.2 }}
            ref={newCredentialPassTextRef}
            type="password"
            placeholder="Password"
            onKeyUp={(e) => e.key === "Enter" && updateCred()}
            className={"p-3   bg-dark text-white"}
          />
        </div>

        <button
          onClick={updateCred}
          ref={storeButtonRef}
          className={
            "d-flex btn btn-block btn-primary  text-white justify-content-center py-2 px-4"
          }
          style={{ width: "100%" }}
        >
          <strong> Store +</strong>
        </button>

        <div className="d-flex align-items-center mt-3">
          <motion.input
            whileHover={{ height: 100 }}
            whileFocus={{ scale: 1.07 }}
            ref={searchCredentialTextRef}
            type="text"
            placeholder="Search for Credentials"
            onKeyUp={(e) => e.key === "Enter" && searchCred()}
            className={"p-3 d-flex bg-dark text-white rounded"}
            style={{ width: "100%" }}
            onChange={searchCred}
          />
        </div>
      </div>

      <div className={"d-flex flex-column  p-4"}>
        <div className={`d-flex`}>
          {creds.length ? (
            creds.map((cred) => (
              <CredItem
                key={cred.id}
                cred={cred}
                onDelete={() => deleteCred(cred.id)}
                onEdit={() => editCred(cred.id)}
                onShare={() => shareCred(cred.id)}
              />
            ))
          ) : (
            <span
              className={"d-flex justify-content-center align-items-center"}
            >
              You do not have any credentials yet!
            </span>
          )}
        </div>
        {!!errorText && (
          <div
            className={
              "border max-w-sm self-center px-4 py-2 mt-4 text-center text-sm bg-red-100 border-red-300 text-red-400"
            }
          >
            {errorText}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
