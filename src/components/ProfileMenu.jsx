import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import Logout from "./Logout";
import "../assets/styles/ProfileMenu.css";
import "../assets/styles/Style.css";
import "../assets/styles/Responsive.css";
import { useUser } from "../hooks/useAuth";

export default function ProfileMenu() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  // const [username, setUsername] = useState("");

  const { user, loading } = useUser();

  const profileImage = user?.profile?.path_image_profile
  ? `http://localhost:5000/${user.profile.path_image_profile}`
  : "/images/avatar.svg";

  // Tutup menu saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".profile-section")) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (loading) return null;

  if (!user) {
    return (
      <div className="flex gap-4 w-32 justify-center items-center">
        <Link to="/login" className="profile-link">
          Login
        </Link>
        <Link to="/register">Register</Link>
      </div>
    );
  }

  return (
    <div
      className="profile-section"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <img
        src={profileImage}
        alt="User"
        className="profile-avatar"
        onClick={() => setShowProfileMenu(!showProfileMenu)}
      />

      {showTooltip && !showProfileMenu && (
        <span className="profile-tooltip">My Account</span>
      )}

      {showProfileMenu && (
        <div className="profile-popup">
          <img
            src={profileImage}
            alt="Profile"
            className="profile-popup-img"
          />
          <p className="profile-username">{user?.username || "Loading..."}</p>
          <div className="profile-popup-actions">
            <Link to="/profile" className="profile-link">
              Profile
            </Link>
            <Logout />
          </div>
        </div>
      )}
    </div>
  );
}
