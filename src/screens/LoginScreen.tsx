import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../components/UserContext"; // ✅ Make sure this path is correct
import HBARLogo from "../assets/hbar-logo.svg";
import { useWalletInterface } from "../services/wallets/useWalletInterface";
import { WalletSelectionDialog } from "../components/WalletSelectionDialog";

const LoginScreen = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const { accountId, walletInterface } = useWalletInterface();

  const handleConnect = async () => {
    if (accountId) {
      walletInterface.disconnect();
    } else {
      setOpen(true);
    }
  };

  useEffect(() => {
    if (accountId) {
      setOpen(false);
    }
  }, [accountId]);

  const navigate = useNavigate();
  const { user, setUser } = useUser(); // ✅ Get user and setUser from context

  useEffect(() => {
    if (user?.token) {
      navigate("/");
    }
  }, [user, navigate]);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/users/login",
        {
          usernameOrEmail: usernameOrEmail || undefined,
          password: password || undefined,
          wallet_address: accountId || undefined,
        },
        config
      );

      // ✅ Save to localStorage and update context
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);

      setLoading(false);
      navigate("/");
    } catch (error: any) {
      setLoading(false);
      setError(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-green-700">
            Login to Your Account
          </h2>
          {error && (
            <div className="p-2 text-white bg-red-500 rounded">{error}</div>
          )}
          {loading && (
            <div className="p-2 text-white bg-blue-500 rounded">Loading...</div>
          )}
          <form onSubmit={submitHandler} className="space-y-6">
            <div>
              <label className="text-sm font-bold text-gray-600">
                Username or Email
              </label>
              <input
                type="text"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                className="w-full p-2 mt-1 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-600">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 mt-1 border rounded-md"
                required
              />
            </div>
            <div className="text-center text-gray-600">OR</div>

            <div>
              <button
                type="submit"
                className="w-full py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                Login
              </button>
            </div>
          </form>
          <div>
            <button
              type="button"
              onClick={handleConnect}
              className="w-full py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              {accountId ? `Connected: ${accountId}` : "Connect Wallet"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              New to EarthRectify?{" "}
              <Link
                to="/register"
                className="font-medium text-green-600 hover:text-green-500"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
      <WalletSelectionDialog
        open={open}
        setOpen={setOpen}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

export default LoginScreen;
