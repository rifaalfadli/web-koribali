import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import "../assets/styles/Logout.css";

const Logout = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  function handleLogout() {
    Cookies.remove("access_token"); // hapus cookie
    navigate("/"); // redirect ke login
  }

  return (
    <>
      <Link onClick={() => setShowModal(true)} className="logout-Link">
        Logout
      </Link>

      {showModal && (
        <div className="logout-Overlay">
          <div className="logout-Modal">
            <h2>Confirm Logout</h2>
            <p>Are you sure you want to log out of your account?</p>
            <div className="logout-Buttons">
              <button
                className="btn-Cancel"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="btn-Logout" onClick={handleLogout}>
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Logout;
