import React, {useState, useEffect} from "react";
import axios from "axios";
import Config from "../assets/configs/configs.json";
import {useForm} from "react-hook-form";

const Signin = ({signin, signup}) => {
  const [resError, setResError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm({mode: "all"});

  const handleSignUp = async (event) => {
    const {email, password} = event;
    const data = {user: {username: email, email, password}};

    try {
      await axios.post(`${Config.BACKEND_URL}/user`, data);
      window.location.assign("/");
    } catch (error) {
      console.error(error);
      handleShowResError(error.response.data.error);
    }
  };

  const handleSignIn = async (event) => {
    const {email, password} = event;
    const data = {user: {email, password}};

    try {
      const res = await axios.post(`${Config.BACKEND_URL}/user/login`, data, {
        withCredentials: true,
      });
      const user_id = res.headers.user_id;
      const username = res.headers.username;
      localStorage.setItem("user_id", user_id);
      localStorage.setItem("username", username);
console.log("hhi");
      window.location.assign("/chat");
    } catch (error) {
      console.error(error);
      handleShowResError(
        error?.response?.data?.error
          ? error.response.data.error
          : "username or password is invalid"
      );
    }
  };

  const handleShowResError = (text) => {
    setResError(text);
    setTimeout(() => {
      setResError("");
    }, 3000);
  };

  return (
    <div className="signin-container">
      <div className="signin-box">
        <h2>{signup ? "Create New Account" : "Sign in"}</h2>
        <form
          onSubmit={handleSubmit(signup ? handleSignUp : handleSignIn)}
          className="signin-form"
        >
          <label>Username</label>
          <input
            id="email"
            placeholder="Please Enter your name"
            className={errors.email ? "error-validate" : ""}
            {...register("email", {
              required: "",
            })}
          />
          {errors.email?.message && (
            <span className="error">{errors.email?.message}</span>
          )}
          <label>Password</label>
          <input
            id="password"
            type="password"
            placeholder="Please Enter your password"
            className={errors.password ? "error-validate" : ""}
            {...register("password", {
              required: "",
              minLength: {
                value: signup ? 8 : 0,
                message: "Password required 8 characters",
              },
            })}
          />
          {errors.password?.message && (
            <span className="error">{errors.password?.message}</span>
          )}
          {signup && (
            <>
              <label>Confirm password</label>
              <input
                id="confirmPassword"
                placeholder="Please Confirm your password"
                type="password"
                className={errors.confirmPassword ? "error-validate" : ""}
                {...register("confirmPassword", {
                  required: "",
                  validate: (val) => {
                    if (watch("password") !== val) {
                      return "Passwords do not match";
                    }
                  },
                })}
              />
              {errors.confirmPassword?.message && (
                <span className="error">{errors.confirmPassword?.message}</span>
              )}
            </>
          )}

          <button type="submit">{signup ? "Let's Go!!" : "Sign in"}</button>
          {resError && <span className="error">{resError}</span>}
        </form>
      </div>
    </div>
  );
};

export default Signin;
