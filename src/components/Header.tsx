import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <header className="bg-green-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        EarthRectify
      </Link>
      <nav className="space-x-4">
        {userInfo.token && (
          <Link to="/wallet" className="hover:text-gray-200">
            Wallet
          </Link>
        )}
        {userInfo.token && (
          <Link to="/profile" className="hover:text-gray-200">
            Profile
          </Link>
        )}
        {userInfo.token && userInfo.isVerifier && (
          <Link to="/verifier/farms" className="hover:text-gray-200">
            Verify Farms
          </Link>
        )}
        {userInfo.token ? (
          <button onClick={logoutHandler} className="hover:text-gray-200">
            Logout
          </button>
        ) : (
          <Link to="/login" className="hover:text-gray-200">
            Login
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
