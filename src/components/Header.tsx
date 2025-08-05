import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../components/UserContext";
import logo from "../assets/img/earthec-white-no-bg.png";

const Header = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/login");
  };

  const loginHandler = () => {
    navigate("/login");
  };

  return (
    <header className="bg-green-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="flex items-center">
        <img src={logo} alt="EarthRectify Logo" className="h-8 w-8 mr-0" />
        <span className="text-xl font-bold ml-0">arthRectify</span>
      </Link>

      <nav className="space-x-4 flex items-center">
        {user?.token ? (
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
            <button
              onClick={logoutHandler}
              className="bg-white text-green-600 px-3 py-1 rounded hover:bg-gray-100"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={loginHandler}
            className="bg-white text-green-600 px-3 py-1 rounded hover:bg-gray-100"
          >
            Login
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
