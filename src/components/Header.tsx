import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../components/UserContext"; // Make sure this path is correct

const Header = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="bg-green-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        EarthRectify
      </Link>
      <nav className="space-x-4">
        {user?.token && (
          <>
            <Link to="/wallet" className="hover:text-gray-200">
              Wallet
            </Link>
            <Link to="/profile" className="hover:text-gray-200">
              Profile
            </Link>
            {user.isVerifier && (
              <Link to="/verifier/farms" className="hover:text-gray-200">
                Verify Farms
              </Link>
            )}
            <button onClick={logoutHandler} className="hover:text-gray-200">
              Logout
            </button>
          </>
        )}
        {!user?.token && (
          <Link to="/login" className="hover:text-gray-200">
            Login
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
