import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, X, CheckCircle, AlertCircle } from "lucide-react";
import { Helmet } from "react-helmet";
import "../assets/styles/Style.css";
import "../assets/styles/Responsive.css";
import "../assets/styles/LoginRegister.css";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(null); // untuk pesan sukses/error
  const [messageType, setMessageType] = useState(""); // "success" atau "error"
  const navigate = useNavigate();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email("*Invalid Email").required("*Email is required"),
    password: Yup.string().required("*Password is required"),
  });

  const handleLogin = async (values, { resetForm }) => {
    try {
      const res = await fetch("http://localhost:5000/anggota");
      const users = await res.json();

      const foundUser = users.find(
        (u) =>
          u.email === values.email.trim() &&
          u.password === values.password.trim(),
      );

      if (foundUser) {
        setMessageType("success");
        setMessage("Login successful!");
        Cookies.set("user", JSON.stringify({ id: foundUser.id }), {
          expires: 1,
        });
        sessionStorage.setItem("showTransition", "true");

        resetForm();

        // Redirect setelah 2 detik
        setTimeout(() => navigate("/"), 2000);
      } else {
        setMessageType("error");
        setMessage("Email or password is incorrect!");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessageType("error");
      setMessage("An error occurred during login.");
    }
  };

  const closeMessage = () => {
    setMessage(null);
  };

  return (
    <>
      <Helmet>
        <title>Login - CV. KORI BALI</title>
        <meta name="description" content="Login Page CV. KORI BALI" />
      </Helmet>

      <div className="begin-page">
        <div className="begin-card">
          <h1 className="begin-title">Welcome Back!</h1>

          {/* Kotak pesan notifikasi */}
          {message && (
            <div
              className={`message-box ${
                messageType === "error" ? "message-error" : "message-success"
              }`}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                {messageType === "error" && <AlertCircle size={20} />}
                <span>{message}</span>
              </div>

              {messageType === "error" ? (
                <button className="message-close" onClick={closeMessage}>
                  <X size={20} />
                </button>
              ) : (
                <CheckCircle size={20} />
              )}
            </div>
          )}

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
          >
            {({ isSubmitting }) => (
              <Form className="register-form">
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

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="submit-btn"
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>

                <p className="text">
                  <Link to="/register">
                    Don't have an account? Register here.
                  </Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
