import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/api";
import RecoverPassword from "../components/RecoverPassword";
import CredItem from "../components/CredItem";
import { encodeJSON, decodeJSON } from "../lib/utilities";
import { motion } from "framer-motion";

const Home = ({ user }) => {
  const [recoveryToken, setRecoveryToken] = useState(null);
  const [creds, setCreds] = useState([]);
  const [errorText, setError] = useState("");

  const newCredentialPassTextRef = useRef();
  const newCredentialUserTextRef = useRef();
  const newCredentialPortTextRef = useRef();
  const newCredentialHostTextRef = useRef();
  const newCredentialServiceTextRef = useRef();

  const searchCredentialTextRef = useRef();

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
    let { data: creds, error } = await supabase
      .from("creds")
      .select("*")
      .order("id", { ascending: false });

    let resultCreds = [];
    for (let cred of creds) {
      if (
        JSON.stringify(decodeJSON(cred.credential))
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

  const addCred = async () => {
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
        .insert({ credential: encodeJSON(credential), user_id: user.id })
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
  };

  return recoveryToken ? (
    <RecoverPassword
      token={recoveryToken}
      setRecoveryToken={setRecoveryToken}
    />
  ) : (
    <div className={"d-flex flex-column "}>
      <div className="card card-body shadow rounded">
        <div className={"d-flex"}>
          <motion.input
            whileHover={{ width: 400 }}
            whileFocus={{ scale: 1.2 }}
            ref={newCredentialServiceTextRef}
            type="text"
            placeholder="Service"
            onKeyUp={(e) => e.key === "Enter" && addCred()}
            className={"p-3  bg-dark text-white"}
          />
          <motion.input
            whileHover={{ width: 400 }}
            whileFocus={{ scale: 1.2 }}
            ref={newCredentialHostTextRef}
            type="text"
            placeholder="Host"
            onKeyUp={(e) => e.key === "Enter" && addCred()}
            className={"p-3 bg-dark text-white"}
          />
          <motion.input
            whileHover={{ width: 400 }}
            whileFocus={{ scale: 1.2 }}
            ref={newCredentialPortTextRef}
            type="text"
            placeholder="Port"
            onKeyUp={(e) => e.key === "Enter" && addCred()}
            className={"p-3 bg-dark text-white"}
          />
          <motion.input
            whileHover={{ width: 400 }}
            whileFocus={{ scale: 1.2 }}
            ref={newCredentialUserTextRef}
            type="text"
            placeholder="User"
            onKeyUp={(e) => e.key === "Enter" && addCred()}
            className={"p-3  bg-dark text-white"}
          />
          <motion.input
            whileHover={{ width: 400 }}
            whileFocus={{ scale: 1.2 }}
            ref={newCredentialPassTextRef}
            type="password"
            placeholder="Password"
            onKeyUp={(e) => e.key === "Enter" && addCred()}
            className={"p-3   bg-dark text-white"}
          />
        </div>

        <button
          onClick={addCred}
          className={
            "d-flex btn btn-block btn-danger text-dark justify-content-center py-2 px-4"
          }
          style={{ width: "100%" }}
        >
          Store +
        </button>

        <div className="d-flex align-items-center mt-3">
          <motion.input
            whileHover={{ height: 100 }}
            whileFocus={{ scale: 1.2 }}
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
