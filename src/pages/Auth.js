import { useRef, useState } from "react";
import { supabase } from "../lib/api";
import { SocialIcon } from "react-social-icons";
import { motion } from "framer-motion";

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
      <form className="container">
        <h1 className="pt-5 logo-auth">accio</h1>

        <h5 className="mb-5 mt-3">
          a <strong>developer</strong> friendly credential manager.
        </h5>

        <div className="mx-5 mb-5 ">
          <div className="form-group">
            <motion.input
              whileFocus={{ scale: 1.05 }}
              type="email"
              id="inputEmail"
              className=" w-100 bg-dark text-white text-center mb-4 p-3 radify-more focus-primary"
              placeholder="Email address"
              required
              autoFocus
              name={"email"}
              ref={emailRef}
            />
          </div>
          <div className="form-group">
            <motion.input
              whileFocus={{ scale: 1.05 }}
              type="password"
              id="inputPassword"
              className="w-100 bg-dark text-white  text-center mb-4 p-3 radify-more focus-primary"
              placeholder="Password"
              required
              name={"password"}
              ref={passwordRef}
            />
          </div>
        </div>
        <div className="mb-3 d-flex justify-content-center">
          <button
            onClick={() => handleLogin("LOGIN")}
            className="btn btn-primary text-white btn-lg mx-2"
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
        <span className={"btn"} onClick={forgotPassword}>
          Forgot Password?
        </span>

        <hr className="mt-5 " />

        <span className="text-center texh-white mt-3">or Log In with</span>
        <div className="mt-3 d-flex justify-content-center">
          <div className="mx-3 btn" onClick={() => handleOAuthLogin("github")}>
            <SocialIcon network="github" fgColor="#ffffff" bgColor="#211F1F" />
            <span className="d-md-inline d-none btn social-pill mr-5 font-weight-bold radify">
              Github
            </span>
          </div>

          <div className="mx-3 btn" onClick={() => handleOAuthLogin("google")}>
            <SocialIcon network="google" fgColor="#ffffff" bgColor="#DE5246" />
            <span className="d-md-inline d-none  btn social-pill mr-5 font-weight-bold radify">
              Google
            </span>
          </div>

          <div className="mx-3 btn" onClick={() => handleOAuthLogin("discord")}>
            <SocialIcon network="discord" fgColor="#ffffff" bgColor="#5865F2" />
            <span className="d-md-inline d-none btn social-pill mr-5 font-weight-bold radify">
              Discord
            </span>
          </div>
        </div>

        {!!helperText.text && (
          <div
            className={`my-4 text-center ${
              helperText.error
                ? "bg-danger text-white"
                : "bg-success text-white"
            }`}
          >
            {helperText.text}
          </div>
        )}
        <hr className="mt-5 " />
        <span className="text-center texh-white my-3 pb-3">
          Developed by <br />
          <a className="text-primary" href="https://github.com/fabianferno">
            Fabian Ferno
          </a>{" "}
          &{" "}
          <a className="text-primary" href="https://github.com/Joshuafrankle">
            Joshua Frankle
          </a>
        </span>
      </form>
    </div>
  );
};

export default Auth;
