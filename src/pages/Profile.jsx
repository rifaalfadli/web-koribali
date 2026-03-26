import { Field, Formik, Form } from "formik";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import * as Yup from "yup";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import Hero from "../components/Hero";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";
import "../assets/styles/ProfilePage.css";
import "../assets/styles/Style.css";
import "../assets/styles/Responsive.css";
import { useUser } from "../hooks/useAuth";

export default function ProfilePage() {
  const { user, loading, refreshUser } = useUser();
  console.log("ini user", user);
  const [originalUser, setOriginalUser] = useState(null);
  console.log("ini ori user: ", originalUser);
  // State untuk pesan sukses/error
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  // State untuk menandai apakah dalam mode edit atau tidak
  const [editMode, setEditMode] = useState(false);
  // NOTE: allValid state dihapus — kita akan compute secara langsung di render

  // State untuk menampung preview foto baru (base64) dan menampilkan foto penuh
  const [photoState, setPhotoState] = useState({
    preview: null,
    showFull: false,
  });

  // State untuk fokus ke input
  const [lastFocus, setLastFocus] = useState(null);
  const handleFocus = (e) => setLastFocus(e.target.id);

  const profileImage = user?.profile?.path_image_profile
  ? `http://localhost:5000/${user.profile.path_image_profile}`
  : "/images/avatar.svg";

  useEffect(() => {
    if (editMode && lastFocus) {
      setTimeout(() => {
        const input = document.getElementById(lastFocus);
        if (input) input.focus();
      }, 0);
    }
  }, [editMode, user, lastFocus]); // dependency updated: remove allValid, add lastFocus

  // Fungsi untuk toggle foto besar
  const toggleFullImage = () =>
    setPhotoState((prev) => ({ ...prev, showFull: !prev.showFull }));

  // Validation schema using Yup
  const ProfileSchema = Yup.object().shape({
    username: Yup.string(),
    full_name: Yup.string().min(2, "Too Short!").required("Name is required"),
    email: Yup.string().email("Invalid Email").required("Email is required"),
    number_phone: Yup.string()
      .matches(/^[0-9]+$/, "Phone number must contain only digits")
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number can't be longer than 15 digits")
      .required("Phone Number is required"),
    address: Yup.string().required("Address is required"),
    employee_id: Yup.string(),
    division: Yup.string(),
    joined_date: Yup.date(),
    photo: Yup.mixed().test(
      "fileSize",
      "File too large (max 2MB)",
      (value) => !value || (value && value.size <= 2000000),
    ),
  });

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setPhotoState((prev) => ({ 
        ...prev, 
        preview: reader.result,
        file : file
      }));
    reader.readAsDataURL(file);
  };

  const handleSave = async (updatedUser) => {
    if (!updatedUser) return;
    try {
      const token = Cookies.get("access_token");
      
      const formData = new FormData()

      Object.entries(updatedUser).forEach(([key, value]) => {
        formData.append(key, value ?? "")
      })
      // console.log('photostate:',photoState, photoState.file instanceof File)
      if (photoState?.file) {
        console.log('ini jalan photostate')
        formData.append('profile_image', photoState.file)
      }

      // console.log('ini form data:', formData)

      const response = await fetch("http://localhost:5000/user/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Update failed");
      }

      setShowPopup(true);
      setTimeout(() => {
        setEditMode(false);
        setShowPopup(false);
      }, 1000);

      if (refreshUser) await refreshUser();

      console.log("Profile updated:", data);

      setOriginalUser(updatedUser);

      // setUser((prev) => ({
      //   ...prev,
      //   profile: {
      //     ...prev.profile,
      //     full_name: values.full_name,
      //     address: values.address
      //   }
      // }));
    } catch (error) {
      console.error("Update profile error:", error);
    }
  };

  const closeMessage = () => {
    setMessage(null);
  };

  // Tampilkan pesan loading jika data belum tersedia
  if (loading) return <div className="profile-Loading">Loading profile...</div>;

  // Komponen input
  const InputField = ({
    name,
    label,
    readOnly,
    values,
    errors,
    originalUser,
    touched,
  }) => {
    const originalValue = String(originalUser?.[name] ?? "");
    const currentValue = String(values?.[name] ?? "");
    console.log(currentValue, originalValue);
    const isChanged = currentValue !== originalValue;

    let stateColor = "null";
    if (!readOnly && isChanged) {
      stateColor = errors[name] ? "red" : "green";
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={clsx("form-group", "info-row")}
      >
        <Field name={name}>
          {({ field }) => (
            <div className={`form-group ${errors[name] ? "shake" : ""}`}>
              <label>{label}:</label>
              <input
                {...field}
                id={name}
                readOnly={readOnly}
                onFocus={handleFocus}
                placeholder={label}
                className={clsx(
                  "input-field",
                  stateColor === "green" && "input-green",
                  stateColor === "red" && "input-error",
                )}
              />

              <div className="error-container">
                {!readOnly && errors[name] && (
                  <div className="error-text">
                    <AlertCircle size={14} strokeWidth={2.5} />
                    {errors[name]}
                  </div>
                )}
                {!readOnly && !errors[name] && isChanged && (
                  <div className="success-container active">
                    <div className="success-text">
                      <CheckCircle size={14} strokeWidth={2.5} />
                      Verified
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </Field>
      </motion.div>
    );
  };

  return (
    <>
      <Header />
      <div className="page-wrapper">
        <Helmet>
          <title>User Profile - CV. KORI BALI</title>
          <meta
            name="description"
            content="Halaman profil pengguna CV. KORI BALI untuk melihat dan mengedit data pribadi akun Anda."
          />
        </Helmet>

        {showPopup && (
          <motion.div
            className="popup-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="popup-box"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <CheckCircle size={40} color="#2e7d32" />
              <p>Profile updated successfully!</p>
            </motion.div>
          </motion.div>
        )}

        <Hero title="My Profile" />
        <Breadcrumb page="Profile" />

        <motion.div
          className="profile-container"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className={`profile-card ${editMode ? "profile-card-edit" : ""}`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="profile-photo-section">
              <motion.img
                src={photoState.preview || profileImage}
                alt="Profile"
                className="profile-photo"
                onClick={toggleFullImage}
                style={{ cursor: "pointer" }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              />
              {editMode && (
                <motion.label
                  className="photo-upload-btn"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </motion.label>
              )}
            </div>

            {message && messageType === "error" && (
              <motion.div
                className="message-box message-error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <AlertCircle size={20} />
                  <span>{message}</span>
                </div>
                <button className="message-close" onClick={closeMessage}>
                  <X size={20} />
                </button>
              </motion.div>
            )}

            <Formik
              enableReinitialize
              initialValues={{
                id: user.id,
                username: user.username,
                full_name: user.profile?.full_name || "",
                email: user.email || "",
                number_phone: user.number_phone || "",
                address: user.profile?.address || "",
                division: user.employee_detail?.division || "",
                joined_date: user.employee_detail?.joined_date || "",
                employee_id: user.employee_detail?.employee_id || "",
              }}
              validationSchema={ProfileSchema}
              onSubmit={handleSave}
            >
              {({ values, errors, touched, isValid, dirty, resetForm }) => {
                return (
                  <Form className="profile-info">
                    <InputField
                      name="username"
                      label="Username"
                      readOnly={!editMode}
                      values={values}
                      errors={errors}
                      touched={touched}
                      originalUser={originalUser}
                    />
                    <InputField
                      name="full_name"
                      label="Nama Lengkap"
                      readOnly={!editMode}
                      values={values}
                      errors={errors}
                      touched={touched}
                      originalUser={originalUser}
                    />
                    <InputField
                      name="email"
                      label="Email"
                      readOnly={!editMode}
                      values={values}
                      errors={errors}
                      touched={touched}
                      originalUser={originalUser}
                    />
                    <InputField
                      name="number_phone"
                      label="Phone Number"
                      readOnly={!editMode}
                      values={values}
                      errors={errors}
                      touched={touched}
                      originalUser={originalUser}
                    />
                    <InputField
                      name="address"
                      label="Alamat"
                      readOnly={!editMode}
                      values={values}
                      errors={errors}
                      touched={touched}
                      originalUser={originalUser}
                    />
                    {user.role === "member" && (
                      <>
                        <InputField
                          name="division"
                          label="Divisi"
                          readOnly={editMode}
                          values={values}
                          errors={errors}
                          touched={touched}
                          originalUser={originalUser}
                        />
                        <InputField
                          name="employee_id"
                          label="ID Karyawan"
                          readOnly={editMode}
                          values={values}
                          errors={errors}
                          touched={touched}
                          originalUser={originalUser}
                        />
                        <InputField
                          name="joined_date"
                          label="Tanggal Bergabung"
                          readOnly={editMode}
                          values={values}
                          errors={errors}
                          touched={touched}
                          originalUser={originalUser}
                        />
                      </>
                    )}
                    <motion.div
                      className="profile-buttons"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      {editMode ? (
                        <>
                          <button
                            type="button"
                            className={clsx("btn-cancel", "button-profile")}
                            onClick={(e) => {
                              e.preventDefault();
                              // setUser(originalUser);
                              setEditMode(false);
                              setPhotoState((prev) => ({
                                ...prev,
                                preview: null,
                              }));
                              resetForm({ values: originalUser });
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className={clsx("btn-save", "button-profile")}
                            // disabled={!isValid || !dirty}
                            disabled={false}
                            // onClick={() => console.log("clicked")}
                          >
                            Save
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          className={clsx("btn-edit", "button-profile")}
                          onClick={() => {
                            const flatUser = {
                              id: user.id,
                              username: user.username || "",
                              full_name: user.profile?.full_name || "",
                              email: user.email || "",
                              number_phone: user.number_phone || "",
                              address: user.profile?.address || "",
                              division: user.employee_detail?.division || "",
                              joined_date:
                                user.employee_detail?.joined_date || "",
                              employee_id:
                                user.employee_detail?.employee_id || "",
                            };

                            setOriginalUser(flatUser);
                            setEditMode(true);
                          }}
                        >
                          Edit Profile
                        </button>
                      )}
                    </motion.div>
                  </Form>
                );
              }}
            </Formik>
          </motion.div>
        </motion.div>

        {photoState.showFull && (
          <motion.div
            className="image-overlay"
            onClick={toggleFullImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="image-popup"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={photoState.preview || profileImage}
                alt="Full Profile"
                className="image-full"
              />
            </motion.div>
          </motion.div>
        )}
      </div>
      <Footer />
    </>
  );
}
