import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/api";
import RecoverPassword from "../components/RecoverPassword";
import CredItem from "../components/CredItem";

const Home = ({ user }) => {
  const [recoveryToken, setRecoveryToken] = useState(null);
  const [creds, setCreds] = useState([]);
  const newCredentialTextRef = useRef();
  const [errorText, setError] = useState("");

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

  const deleteCred = async (id) => {
    try {
      await supabase.from("creds").delete().eq("id", id);
      setCreds(creds.filter((x) => x.id !== id));
    } catch (error) {
      console.log("error", error);
    }
  };

  const addCred = async () => {
    let credentialText = newCredentialTextRef.current.value;
    let credential = credentialText.trim();
    if (credential.length <= 3) {
      setError("Credential length should be more than 3!");
    } else {
      let { data: cred, error } = await supabase
        .from("creds")
        .insert({ credential, user_id: user.id })
        .single();
      if (error) setError(error.message);
      else {
        setCreds([cred, ...creds]);
        setError(null);
        newCredentialTextRef.current.value = "";
      }
    }
  };

  return recoveryToken ? (
    <RecoverPassword
      token={recoveryToken}
      setRecoveryToken={setRecoveryToken}
    />
  ) : (
    <div className={"position-fixed d-flex flex-column  "}>
      <header className={"d-flex justify-content-between items-center px-4"}>
        <span className={"text-white"}>Cred List.</span>
      </header>
      <div
        className={"flex flex-col flex-grow p-4"}
        style={{ height: "calc(100vh - 11.5rem)" }}
      >
        <div
          className={`p-2 border flex-grow grid gap-2 ${
            creds.length ? "auto-rows-min" : ""
          } grid-cols-1 h-2/3 overflow-y-scroll first:mt-8`}
        >
          {creds.length ? (
            creds.map((cred) => (
              <CredItem
                key={cred.id}
                cred={cred}
                onDelete={() => deleteCred(cred.id)}
              />
            ))
          ) : (
            <span className={"h-full flex justify-center items-center"}>
              You do have any credential yet!
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
      <div className={"flex m-4 mt-0 h-10"}>
        <input
          ref={newCredentialTextRef}
          type="text"
          onKeyUp={(e) => e.key === "Enter" && addCred()}
          className={"bg-gray-200 border px-2 border-gray-300 w-full mr-4"}
        />
        <button
          onClick={addCred}
          className={
            "flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition duration-150 ease-in-out"
          }
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default Home;
