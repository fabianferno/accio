import { useRef, useState } from "react";
import { supabase } from "../lib/api";

const Auth = () => {
  const [helperText, setHelperText] = useState({ error: null, text: null });
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleLogin = async (type) => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    const { user, error } =
      type === "LOGIN"
        ? await supabase.auth.signIn({ email, password })
        : await supabase.auth.signUp({ email, password });

    if (error) {
      setHelperText({ error: true, text: error.message });
    } else if (!user && !error) {
      setHelperText({
        error: false,
        text: "An email has been sent to you for verification!",
      });
    }
  };

  const handleOAuthLogin = async (provider) => {
    // You need to enable the third party auth you want in Authentication > Settings
    // Read more on: https://supabase.io/docs/guides/auth#third-party-logins
    let { error } = await supabase.auth.signIn({ provider });
    if (error) console.log("Error: ", error.message);
  };

  const forgotPassword = async (e) => {
    // Read more on https://supabase.io/docs/reference/javascript/reset-password-email#notes
    e.preventDefault();
    const email = prompt("Please enter your email:");

    if (email === null || email === "") {
      setHelperText({ error: true, text: "You must enter your email." });
    } else {
      let { error } = await supabase.auth.api.resetPasswordForEmail(email);
      if (error) {
        console.error("Error: ", error.message);
      } else {
        setHelperText({
          error: false,
          text: "Password recovery email has been sent.",
        });
      }
    }
  };

  return (
    <div
      className={"p-5 shadow d-flex justify-content-center mt-5 text-center"}
    >
      <form className="form-signin">
        <h1 className="font-weight-bold text-white mb-5">accio</h1>
        <h4 className="h3 mb-3 text-success font-weight-normal">
          Please sign in
        </h4>
        <label for="inputEmail" className="sr-only mb-2">
          Email
        </label>
        <input
          type="email"
          id="inputEmail"
          className="form-control mb-4"
          placeholder="Email address"
          required
          autofocus
          name={"email"}
          ref={emailRef}
        />
        <label for="inputPassword" className="sr-only mb-2">
          Password
        </label>
        <input
          type="password"
          id="inputPassword"
          className="form-control mb-4"
          placeholder="Password"
          required
          name={"password"}
          ref={passwordRef}
        />
        <div className="mb-3 d-flex justify-content-center">
          <button
            onClick={() => handleLogin("LOGIN")}
            className="btn btn-primary "
            type="submit"
          >
            Sign in
          </button>
          <button
            type="submit"
            onClick={() => handleLogin("REGISTER").catch(console.error)}
            className="btn  btn-secondary"
          >
            Sign Up
          </button>
        </div>
        <span className={"mt-3"} onClick={forgotPassword}>
          Forgot Password?
        </span>

        <div className="d-flex mt-5">
          <button
            onClick={() => handleOAuthLogin("github")}
            type="button"
            className="btn btn-dark py-2 px-4  text-white"
          >
            GitHub
          </button>

          <button
            onClick={() => handleOAuthLogin("discord")}
            type="button"
            className="btn btn-success py-2 px-4  text-dark"
          >
            Discord
          </button>
        </div>
        {!!helperText.text && (
          <div
            className={`px-1 py-2 my-2 text-center ${
              helperText.error
                ? "bg-danger text-white"
                : "bg-success text-white"
            }`}
          >
            {helperText.text}
          </div>
        )}
      </form>
    </div>
  );
};

export default Auth;
