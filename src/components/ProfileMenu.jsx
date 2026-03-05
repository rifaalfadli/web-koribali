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

  const {user, loading} = useUser()
  // console.log("Rendering ProfileMenu, user data:", user);

  
  // useEffect(() => {
  //   if(user){
  //     setUsername(user.username)
  //   }
  // }, [user])

  // Ambil user berdasarkan ID di cookie
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const userCookie = Cookies.get("user");
  //       if (!userCookie) return;

  //       const { id } = JSON.parse(userCookie);
  //       const res = await fetch(`http://localhost:5000/anggota/${id}`);
  //       if (!res.ok) throw new Error("Failed to fetch user data");

  //       const data = await res.json();
  //       setUsername(data.fullname);
  //     } catch (error) {
  //       console.error("Error fetching user:", error);
  //     }
  //   };

  //   fetchUser();
  // }, []);

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

  return (
    <div
      className="profile-section"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <img
        src="/images/avatar.svg"
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
            src="/images/avatar.svg"
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
