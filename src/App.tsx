import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import DashboardScreen from "./screens/DashboardScreen";
import AddFarmScreen from "./screens/AddFarmScreen";
import FarmDetailsScreen from "./screens/FarmDetailsScreen";
import VerifierFarmListScreen from "./screens/VerifierFarmListScreen";
import Header from "./components/Header";
import BecomeVerifierScreen from "./screens/BecomeVerifierScreen";
import ProfileScreen from "./screens/ProfileScreen";
import WalletScreen from "./screens/WalletScreen";
import ProfileEditScreen from "./screens/ProfileEditScreen";
import { UserProvider } from "./components/UserContext";
import { AllWalletsProvider } from "./services/wallets/AllWalletsProvider";

function App() {
  useEffect(() => {
    window.addEventListener("error", function (e) {
      if (e.message.includes("WebSocket connection failed")) {
        e.preventDefault();
        console.warn("Suppressed WalletConnect WebSocket error");
      }
    });
  }, []);
  return (
    <UserProvider>
      <AllWalletsProvider>
        <Router>
          <Header />
          <main className="py-3">
            <div className="container mx-auto">
              <Routes>
                <Route path="/register" element={<RegisterScreen />} />
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/add-farm" element={<AddFarmScreen />} />
                <Route path="/farm/:id" element={<FarmDetailsScreen />} />
                <Route
                  path="/verifier/farms"
                  element={<VerifierFarmListScreen />}
                />
                <Route
                  path="/become-verifier"
                  element={<BecomeVerifierScreen />}
                />
                <Route path="/profile" element={<ProfileScreen />} />
                <Route path="/profile/edit" element={<ProfileEditScreen />} />
                <Route path="/wallet" element={<WalletScreen />} />
                <Route path="/" element={<DashboardScreen />} />
              </Routes>
            </div>
          </main>
        </Router>
      </AllWalletsProvider>
    </UserProvider>
  );
}

export default App;
