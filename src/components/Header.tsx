import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../components/UserContext";
import logo from "../assets/img/earthec-white-no-bg.png";
import { useWalletInterface } from "../services/wallets/useWalletInterface";
import { WalletSelectionDialog } from "./WalletSelectionDialog";

const Header = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [open, setOpen] = useState(false);
  const { accountId, walletInterface } = useWalletInterface();

  useEffect(() => {
    if (accountId) {
      setOpen(false);
    }
  }, [accountId]);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/login");
  };

  const loginHandler = () => {
    navigate("/login");
  };

  return (
    <>
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
              <div className="flex items-center space-x-2">
                <span className="text-sm text-white font-medium">
                  {user?.username || accountId}
                </span>
                <button
                  onClick={logoutHandler}
                  className="bg-white text-green-600 px-3 py-1 rounded hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
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
      <WalletSelectionDialog
        open={open}
        setOpen={setOpen}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

export default Header;
