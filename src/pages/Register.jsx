import { Field, Formik, Form, ErrorMessage } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useState } from "react";
import { Eye, EyeOff, X, CheckCircle, AlertCircle } from "lucide-react";
import { Helmet } from "react-helmet";
import Cookies from "js-cookie";

import "../assets/styles/Style.css";
import "../assets/styles/Responsive.css";
import "../assets/styles/LoginRegister.css";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  // Validasi Yup
  const RegisterSchema = Yup.object().shape({
    fullname: Yup.string()
      .min(2, "*Too Short!")
      .max(50, "*Too Long!")
      .required("*Name is required"),
    email: Yup.string().email("*Invalid Email").required("*Email is required"),
    phoneNumber: Yup.string()
      .matches(/^[0-9]+$/, "*Phone number must contain only digits")
      .min(10, "*Phone number must be at least 10 digits")
      .max(15, "*Phone number can't be longer than 15 digits")
      .required("*Phone Number is required"),
    password: Yup.string()
      .required("*Password is required")
      .min(8, "*Min 8 chars")
      .matches(/[a-z]/, "*Must contain lowercase")
      .matches(/[A-Z]/, "*Must contain uppercase")
      .matches(/\d/, "*Must contain number"),
  });

  const handleRegister = async (item, { resetForm }) => {
    try {
      // const checkResponse = await fetch("http://localhost:5000/anggota");
      // const users = await checkResponse.json();

      // const isDuplicate = users.some(
      //   (user) =>
      //     user.fullname.toLowerCase() === item.fullname.toLowerCase() ||
      //     user.email.toLowerCase() === item.email.toLowerCase() ||
      //     user.phoneNumber.toLowerCase() === item.phoneNumber.toLowerCase(),
      // );

      // if (isDuplicate) {
      //   setMessageType("error");
      //   setMessage("Name, email, or phone number already exists!");
      //   return;
      // }

      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: item.fullname,
          email: item.email,
          number_phone: item.phoneNumber,
          password: item.password
        }),
      });
      const data = await response.json();

     
      if (!response.ok) {
        setMessageType('error')
        setMessage(data.message || "Registration feiled")
        return;
      };

      // if (!response.ok) throw new Error("Failed to register");

      setMessageType("success");
      console.log("Register success:", data);
      
      if(data.access_token){
        Cookies.set('access_token', data.access_token, {expires:1})
      }

      setShowPopup(true);
      resetForm();

      navigate('/')
      // setTimeout(() => {
      //   navigate("/login");
      // }, 1500);
    } catch (error) {
      console.error("Register failed:", error);
      setMessageType("error");
      setMessage("An error occurred during registration.");
    }
  };

  const closeMessage = () => setMessage(null);

  return (
    <>
      <Helmet>
        <title>Register - CV. KORI BALI</title>
        <meta name="description" content="Register Page CV. KORI BALI" />
      </Helmet>

      <div className="begin-page">
        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-box">
              <CheckCircle size={40} color="#2e7d32" />
              <p>Registration successful! Redirecting you to login...</p>
            </div>
          </div>
        )}

        <div className="begin-card">
          <h1 className="begin-title">Create Your Account</h1>

          {message && messageType === "error" && (
            <div className="message-box message-error">
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <AlertCircle size={20} />
                <span>{message}</span>
              </div>
              <button className="message-close" onClick={closeMessage}>
                <X size={20} />
              </button>
            </div>
          )}

          <Formik
            initialValues={{
              fullname: "",
              email: "",
              phoneNumber: "",
              password: "",
            }}
            validationSchema={RegisterSchema}
            onSubmit={handleRegister}
          >
            <Form className="register-form">
              {/* Fullname */}
              <div className="form-group">
                <Field name="fullname">
                  {({ field, meta }) => (
                    <div
                      className={`form-group ${
                        meta.touched && meta.error ? "shake" : ""
                      }`}
                    >
                      <input
                        {...field}
                        id="fullname"
                        placeholder="Name"
                        className={`input-field ${
                          meta.touched && meta.error ? "input-error" : ""
                        }`}
                      />
                      <div className="error-container">
                        <ErrorMessage
                          name="fullname"
                          component="div"
                          className="error-text"
                        />
                      </div>
                    </div>
                  )}
                </Field>
              </div>

              {/* Email */}
              <div className="form-group">
                <Field name="email">
                  {({ field, meta }) => (
                    <div
                      className={`form-group ${
                        meta.touched && meta.error ? "shake" : ""
                      }`}
                    >
                      <input
                        {...field}
                        id="email"
                        placeholder="Email"
                        className={`input-field ${
                          meta.touched && meta.error ? "input-error" : ""
                        }`}
                      />
                      <div className="error-container">
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="error-text"
                        />
                      </div>
                    </div>
                  )}
                </Field>
              </div>

              {/* Phone Number */}
              <div className="form-group">
                <Field name="phoneNumber">
                  {({ field, meta }) => (
                    <div
                      className={`form-group ${
                        meta.touched && meta.error ? "shake" : ""
                      }`}
                    >
                      <input
                        {...field}
                        id="phoneNumber"
                        placeholder="Phone Number"
                        className={`input-field ${
                          meta.touched && meta.error ? "input-error" : ""
                        }`}
                      />
                      <div className="error-container">
                        <ErrorMessage
                          name="phoneNumber"
                          component="div"
                          className="error-text"
                        />
                      </div>
                    </div>
                  )}
                </Field>
              </div>

              {/* Password */}
              <div className="form-group password-group">
                <Field name="password">
                  {({ field, meta }) => (
                    <div
                      className={`form-group password-group ${
                        meta.touched && meta.error ? "shake" : ""
                      }`}
                    >
                      <div className="password-wrapper">
                        <input
                          {...field}
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          className={`input-field password-input ${
                            meta.touched && meta.error ? "input-error" : ""
                          }`}
                        />
                        <span
                          className="eye-icon"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff size={25} />
                          ) : (
                            <Eye size={25} />
                          )}
                        </span>
                      </div>
                      <div className="error-container">
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="error-text"
                        />
                      </div>
                    </div>
                  )}
                </Field>
              </div>

              <button type="submit" className="submit-btn">
                Register
              </button>

              <p className="text">
                <Link to="/login">Already have an account? Log in here</Link>.
              </p>
            </Form>
          </Formik>
        </div>
      </div>
    </>
  );
}

export default Register;
