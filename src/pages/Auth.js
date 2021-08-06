import { useRef, useState } from "react";
import { supabase } from "../lib/api";

import { SocialIcon } from "react-social-icons";

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
    const email = emailRef.current?.value;

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
      style={{ minHeight: "100vh" }}
      className="d-flex justify-content-center align-items-center text-center"
    >
      <form>
        <h1
          className="font-weight-bold text-success mb-5"
          style={{ fontSize: "5rem", fontWeight: "bold" }}
        >
          accio&trade;
        </h1>
        <input
          type="email"
          id="inputEmail"
          className="form-control bg-dark text-white mb-4 py-3"
          placeholder="Email address"
          required
          autoFocus
          name={"email"}
          ref={emailRef}
        />
        <input
          type="password"
          id="inputPassword"
          className="form-control bg-dark text-white mb-4 py-3"
          placeholder="Password"
          required
          name={"password"}
          ref={passwordRef}
        />
        <div className="mb-3 d-flex justify-content-center">
          <button
            onClick={() => handleLogin("LOGIN")}
            className="btn btn-primary btn-lg mx-2"
            type="submit"
          >
            Sign in
          </button>
          <button
            type="submit"
            onClick={() => handleLogin("REGISTER").catch(console.error)}
            className="btn btn-dark btn-lg mx-2"
          >
            Sign Up
          </button>
        </div>
        <span className={"mt-3"} onClick={forgotPassword}>
          Forgot Password?
        </span>

        <hr className="mt-5 " />

        <span className="text-center texh-white mt-3">Log In with</span>
        <div className="mt-3 d-flex">
          <div className="mx-3" onClick={() => handleOAuthLogin("github")}>
            <SocialIcon network="github" fgColor="#ffffff" bgColor="#211F1F" />
            <span className="btn social-pill mr-5 font-weight-bold text-capitalize">
              Github
            </span>
          </div>

          <div className="mx-3" onClick={() => handleOAuthLogin("google")}>
            <SocialIcon network="google" fgColor="#ffffff" bgColor="#DE5246" />
            <span className="btn social-pill mr-5 font-weight-bold">
              Google
            </span>
          </div>

          <div className="mx-3" onClick={() => handleOAuthLogin("discord")}>
            <SocialIcon network="discord" fgColor="#ffffff" bgColor="#5865F2" />
            <span className="btn social-pill mr-5 font-weight-bold">
              Discord
            </span>
          </div>
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
