import { useState } from "react";
import "../styles/Login.scss";
import image from "../assets/icon-left-font-monochrome-white.webp";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const Login = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [isLogIn, setIsLogIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [stateForm, setStateForm] = useState("login");

  const handleLogin = async (data) => {
    const { email, password } = data;
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();
      localStorage.setItem("token", result.accessToken);
      localStorage.setItem("email", result.email);
      localStorage.setItem("userid", result.userId);

      console.log("Login Successful");
      navigate("/home");
    } catch (error) {
      console.error("Login Error:", error.message);
      messageApi.open({
        type: "error",
        content: "Login Error Please Sign Up",
      });
    } finally {
      setLoading(false);
      reset();
    }
  };

  const handleSignup = async (data) => {
    const { email, password } = data;
    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      console.log("Signup Successful:");
      await handleLogin(data);
    } catch (error) {
      console.error("Signup Error:", error.message);
      messageApi.open({
        type: "error",
        content: "SignUp Error",
      });
    } finally {
      setLoading(false);
      reset();
    }
  };

  return (
    <>
      {contextHolder}
      <div className="loginPage">
        <div className="form_container">
          <img src={image} alt="Logo" className="logo" />
          <div className="options">
            <ul>
              <li
                style={{
                  borderBottomWidth: "2px",
                  backgroundColor:
                    stateForm === "login" ? "black" : "transparent",
                }}
              >
                <a
                  onClick={() => {
                    setIsLogIn(true);
                    setStateForm("login");
                  }}
                >
                  Login
                </a>
              </li>
              <li
                style={{
                  backgroundColor:
                    stateForm === "signup" ? "black" : "transparent",
                }}
              >
                <a
                  onClick={() => {
                    setIsLogIn(false);
                    setStateForm("signup");
                  }}
                >
                  Sign Up
                </a>
              </li>
            </ul>
          </div>

          {isLogIn ? (
            <form onSubmit={handleSubmit(handleLogin)}>
              <div className="input_container">
                <input
                  type="email"
                  placeholder="Email"
                  {...register("email", { required: "Email is required" })}
                />
              </div>
              <div className="input_container">
                <input
                  type="password"
                  placeholder="Password"
                  {...register("password", {
                    minLength: {
                      value: 4,
                      message: "Password must be at least 4 characters",
                    },
                    required: "Password is required",
                  })}
                />
              </div>
              <button type="submit" id="login_btn" disabled={loading}>
                {loading ? "Loading..." : "Login"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit(handleSignup)}>
              <div className="input_container">
                <input
                  type="email"
                  placeholder="Email"
                  {...register("email", { required: "Email is required" })}
                />
              </div>
              <div className="input_container">
                <input
                  type="password"
                  placeholder="Password"
                  {...register("password", {
                    minLength: {
                      value: 4,
                      message: "Password must be at least 4 characters",
                    },
                    required: "Password is required",
                  })}
                />
              </div>
              <button type="submit" id="sign_up" disabled={loading}>
                {loading ? "Loading..." : "Sign Up"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
