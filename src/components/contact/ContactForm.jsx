import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import { MapEmbed } from "../shared/MapEmbed";
import { motion } from "framer-motion";
import "../../assets/styles/Style.css";
import "../../assets/styles/Responsive.css";
import "../../assets/styles/LoginRegister.css";

export const ContactForm = () => {
  // State untuk pesan sukses/error
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const initialValues = {
    name: "",
    email: "",
    telephone: "",
    message: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("*Nama wajib diisi"),
    email: Yup.string()
      .email("*Email tidak valid")
      .required("*Email wajib diisi"),
    telephone: Yup.number()
      .typeError("*Nomor telepon hanya boleh berisi angka")
      .required("*Nomor telepon wajib diisi"),
    message: Yup.string()
      .required("*Pesan wajib diisi")
      .max(500, "*Max 500 characters"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const now = new Date();
      const timestamp = now.toLocaleString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      const payload = { ...values, timestamp };

      const response = await fetch("http://localhost:5000/pesan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        setMessageType("error");
        setMessage("Failed to send message: " + errorText);
        return;
      }

      const data = await response.json();
      console.log("Pesan terkirim:", data);

      resetForm();
      setMessageType("success");
      setShowPopup(true);

      setTimeout(() => {
        setShowPopup(false);
      }, 2700);
    } catch (err) {
      console.error("Gagal mengirim pesan:", err);
      setMessageType("error");
      setMessage("Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.");
    }
  };

  const closeMessage = () => {
    setMessage(null);
  };

  return (
    <>
      {showPopup && (
        <motion.div
          className="popup-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="popup-box"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <CheckCircle size={40} color="#2e7d32" />
            <p>
              Pesan Anda berhasil dikirim! Terima kasih telah menghubungi kami.
            </p>
          </motion.div>
        </motion.div>
      )}
      <section className="form-area container">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Hubungi Kami
        </motion.h2>
        <motion.div
          className="form-kontak"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form className="contact-form">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  {/* Name Field */}
                  <div className="form-group">
                    {message && messageType === "error" && (
                      <div className="message-box message-error">
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <AlertCircle size={20} />
                          <span>{message}</span>
                        </div>
                        <button
                          className="message-close"
                          onClick={closeMessage}
                        >
                          <X size={20} />
                        </button>
                      </div>
                    )}
                    <label htmlFor="name">Nama:</label>
                    <Field name="name">
                      {({ field, meta }) => (
                        <div
                          className={`form-group ${
                            meta.touched && meta.error ? "shake" : ""
                          }`}
                        >
                          <input
                            {...field}
                            id="name"
                            placeholder="Masukkan Nama Anda"
                            className={`form-control ${
                              meta.touched && meta.error ? "input-error" : ""
                            }`}
                          />
                          <div className="error-container">
                            <ErrorMessage
                              name="name"
                              component="div"
                              className="error-text"
                            />
                          </div>
                        </div>
                      )}
                    </Field>
                  </div>
                </motion.div>

                <div className="form-row">
                  {/* Email Field */}
                  <div className="form-group">
                    <label htmlFor="email">Email:</label>
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
                            placeholder="Masukkan Email Anda"
                            className={`form-control ${
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

                  {/* Telephone Field */}
                  <div className="form-group">
                    <label htmlFor="telephone">No Telepon:</label>
                    <Field name="telephone">
                      {({ field, meta }) => (
                        <div
                          className={`form-group ${
                            meta.touched && meta.error ? "shake" : ""
                          }`}
                        >
                          <input
                            {...field}
                            id="telephone"
                            placeholder="Masukkan Nomor Telepon Anda"
                            className={`form-control ${
                              meta.touched && meta.error ? "input-error" : ""
                            }`}
                          />
                          <div className="error-container">
                            <ErrorMessage
                              name="telephone"
                              component="div"
                              className="error-text"
                            />
                          </div>
                        </div>
                      )}
                    </Field>
                  </div>
                </div>

                {/* Message Field */}
                <div className="form-group">
                  <label htmlFor="message">Pesan:</label>
                  <Field name="message">
                    {({ field, meta }) => (
                      <div
                        className={`form-group ${
                          meta.touched && meta.error ? "shake" : ""
                        }`}
                      >
                        <textarea
                          {...field}
                          id="message"
                          placeholder="Masukkan Pesan Anda"
                          rows="5"
                          className={`form-control ${
                            meta.touched && meta.error ? "input-error" : ""
                          }`}
                        />
                        <div className="error-container">
                          <ErrorMessage
                            name="message"
                            component="div"
                            className="error-text"
                          />
                        </div>
                      </div>
                    )}
                  </Field>
                </div>

                <div>
                  <button type="submit" className="btn-form">
                    Kirim
                  </button>
                </div>
              </Form>
            )}
          </Formik>
          <MapEmbed />
        </motion.div>
      </section>
    </>
  );
};
