import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useUser } from "../components/UserContext";

const ProfileScreen = () => {
  const [user, setUser] = useState<any>(null);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data: userData } = await axios.get(
          "/api/users/profile",
          config
        );
        setUser(userData);

        const { data: farmsData } = await axios.get(
          `/api/farms?user=${userData._id}`,
          config
        );
        setFarms(farmsData);

        setLoading(false);
      } catch (error: any) {
        setError(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        );
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalLandmass = farms.reduce(
    (acc, farm: any) => acc + farm.land_mass.length * farm.land_mass.width,
    0
  );
  const totalCarbonYield = farms.reduce(
    (acc, farm: any) => acc + farm.carbon_credit_yield,
    0
  );

  return (
    <div className="p-4">
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="p-2 text-white bg-red-500 rounded">{error}</div>
      ) : (
        user && (
          <div>
            <div className="flex items-center space-x-4">
              <img
                src={
                  user.isVerifier
                    ? `/${user.verifierInfo.image}`
                    : "https://via.placeholder.com/150"
                }
                alt={user.username}
                className="w-24 h-24 rounded-full"
              />
              <div>
                <h1 className="text-3xl font-bold">{user.username}</h1>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-gray-600">{user.bio || "No bio yet."}</p>
              </div>
            </div>
            <Link to="/profile/edit" className="absolute top-4 right-4">
              {/* Edit icon */}
            </Link>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="p-4 bg-white rounded-lg shadow">
                <h4 className="font-bold text-gray-500">Number of Farms</h4>
                <p className="text-2xl font-bold">{farms.length}</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow">
                <h4 className="font-bold text-gray-500">
                  Total Land Mass (m²)
                </h4>
                <p className="text-2xl font-bold">{totalLandmass}</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow">
                <h4 className="font-bold text-gray-500">
                  Total Carbon Credit Yield
                </h4>
                <p className="text-2xl font-bold">{totalCarbonYield}</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow">
                <h4 className="font-bold text-gray-500">Credit Balance</h4>
                <p className="text-2xl font-bold">
                  {user.carbon_credit_balance}
                </p>
              </div>
              {user.isVerifier && (
                <>
                  <div className="p-4 bg-white rounded-lg shadow">
                    <h4 className="font-bold text-gray-500">
                      Total Farms Verified
                    </h4>
                    <p className="text-2xl font-bold">
                      {user.totalFarmsVerified || 0}
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg shadow">
                    <h4 className="font-bold text-gray-500">
                      Total Verifier Credit Yield
                    </h4>
                    <p className="text-2xl font-bold">
                      {user.totalVerifierCreditYield || 0}
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg shadow">
                    <h4 className="font-bold text-gray-500">
                      Verifier Credit Balance
                    </h4>
                    <p className="text-2xl font-bold">
                      {user.verifier_credit_balance}
                    </p>
                  </div>
                </>
              )}
            </div>
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Your Farms</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {farms.map((farm: any) => (
                  <div
                    key={farm._id}
                    className="bg-white shadow-lg rounded-lg overflow-hidden"
                  >
                    <Link to={`/farm/${farm._id}`}>
                      <div className="p-4">
                        <h3 className="text-xl font-bold">{farm.name}</h3>
                        <p className="text-gray-600">
                          Land Mass:{" "}
                          {farm.land_mass.length * farm.land_mass.width} m²
                        </p>
                        <p className="text-gray-600">
                          Carbon Credit Yield: {farm.carbon_credit_yield}
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default ProfileScreen;
