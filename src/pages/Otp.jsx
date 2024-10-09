import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/otp.css"; // Assuming you'll add the styles here
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormErrMsg from "../components/FormErrMsg";
import axios from "axios";
import BASE_URL from "../components/urls";

// Schema for validation
const schema = yup.object().shape({
  otp: yup
    .string()
    .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
    .required("OTP is required"),
});

const Otp = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);

  // Handle input changes and focus shifts
  const handleChange = (element, index) => {
    const value = element.value;
    if (!/^\d$/.test(value)) return; // Only accept digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 5 && value !== "") {
      document.getElementById(`otp-${index + 1}`).focus(); // Move to next input
    }

    setValue("otp", newOtp.join("")); // Set pin value for validation
  };

  const submitForm = (data) => {
    setLoading(true);
    axios
      .post(`${BASE_URL}/otp`, data)
      .then((response) => {
        console.log(response.data);
        setOtp(new Array(6).fill("")); // Clear the inputs after successful submission
        navigate("/otp"); // Navigate to the next page on success
      })
      .catch((error) => {
        console.error("There was an error!", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  

  return (
    <div className="otp">
      <div className="otp-container">
        <div className="otp-header">
          <h2>Enter The OTP code sent to your email</h2>
          <p>We just want to protect your account <span role="img" aria-label="lock">🔒</span></p>
        </div>

        <form onSubmit={handleSubmit(submitForm)} className="otp-form">
          <div className="otp-input-group">
            {otp.map((data, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="password"
                maxLength="1"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
                className="otp-input"
                inputMode="numeric"
              />
            ))}
          </div>

          <FormErrMsg errors={errors} inputName="otp" />

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Loading..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Otp;
