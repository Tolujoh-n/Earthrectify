import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../components/UserContext";
import HBARLogo from "../assets/hbar-logo.svg";
import { useWalletInterface } from "../services/wallets/useWalletInterface";
import { WalletSelectionDialog } from "../components/WalletSelectionDialog";
import { BACKEND_URL } from "../config/constants";

const RegisterScreen = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletRegistering, setWalletRegistering] = useState(false);

  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [open, setOpen] = useState(false);
  const { accountId, walletInterface } = useWalletInterface();

  useEffect(() => {
    const registerWithWallet = async () => {
      if (!accountId || user?.token) return;

      setWalletRegistering(true);
      setMessage(null);
      setError(null);

      try {
        const { data } = await axios.post(
          `${BACKEND_URL}/api/users/register`,
          { wallet_address: accountId },
          { headers: { "Content-Type": "application/json" } }
        );

        localStorage.setItem("userInfo", JSON.stringify(data));
        setUser(data);
        navigate("/login");
      } catch (error: any) {
        setError(
          error.response?.data?.message ||
            error.message ||
            "Wallet registration failed"
        );
      } finally {
        setWalletRegistering(false);
      }
    };

    if (accountId && !user?.token) {
      registerWithWallet();
      setOpen(false); // close wallet dialog after connecting
    }
  }, [accountId]);

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

  useEffect(() => {
    if (user?.token) {
      navigate("/");
    }
  }, [user, navigate]);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setMessage(null);
    setError(null);

    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${BACKEND_URL}/api/users/register`,
        {
          username,
          email,
          password,
          wallet_address: accountId || undefined,
        },
        config
      );

      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);

      setLoading(false);
      navigate("/login");
    } catch (error: any) {
      setLoading(false);
      setError(
        error.response?.data?.message || error.message || "Registration failed"
      );
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-green-700">
            Create Your Account
          </h2>

          {message && (
            <div className="p-2 text-white bg-red-500 rounded">{message}</div>
          )}
          {error && (
            <div className="p-2 text-white bg-red-500 rounded">{error}</div>
          )}
          {loading && (
            <div className="p-2 text-white bg-blue-500 rounded">Loading...</div>
          )}

          <form onSubmit={submitHandler} className="space-y-6">
            <div>
              <label className="text-sm font-bold text-gray-600">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 mt-1 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="text-sm font-bold text-gray-600">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

            <div>
              <label className="text-sm font-bold text-gray-600">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 mt-1 border rounded-md"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
              disabled={loading || walletRegistering}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
          <div className="text-center">
            <p className="text-sm text-red-600">
              Recommended: Register with usename instead of wallet
            </p>
          </div>
          <div>
            <button
              type="button"
              onClick={handleConnect}
              className="w-full py-2 mt-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
              disabled={walletRegistering}
            >
              {walletRegistering
                ? "Registering..."
                : accountId
                ? `Connected: ${accountId}`
                : "Connect Wallet"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-green-600 hover:text-green-500"
              >
                Login here
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

export default RegisterScreen;
