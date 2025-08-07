import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useUser } from "../components/UserContext";
import { BACKEND_URL } from "../config/constants";

const DashboardScreen = () => {
  const { user, setUser } = useUser();
  const [stats, setStats] = useState({
    totalFarmers: 0,
    totalVerifiers: 0,
    totalLandmass: 0,
    totalCarbonYield: 0,
  });
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("recent");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: statsData } = await axios.get(`${BACKEND_URL}/api/stats`);
        setStats(statsData);

        const { data: farmsData } = await axios.get(`${BACKEND_URL}/api/farms?search=${searchTerm}&filter=${filter}`
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
  }, [searchTerm, filter]);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      {/* Stats */}
      <div>
        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div
            key="Total Farmers"
            className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
          >
            <dt>
              <p className="text-sm font-medium text-gray-500 truncate">
                Total Farmers
              </p>
            </dt>
            <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalFarmers}
              </p>
            </dd>
          </div>
          <div
            key="Total Verifiers"
            className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
          >
            <dt>
              <p className="text-sm font-medium text-gray-500 truncate">
                Total Verifiers
              </p>
            </dt>
            <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalVerifiers}
              </p>
            </dd>
          </div>
          <div
            key="Total Landmass"
            className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
          >
            <dt>
              <p className="text-sm font-medium text-gray-500 truncate">
                Total Landmass (acres)
              </p>
            </dt>
            <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalLandmass}
              </p>
            </dd>
          </div>
          <div
            key="Total Carbon Yield"
            className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
          >
            <dt>
              <p className="text-sm font-medium text-gray-500 truncate">
                Total Carbon Yield (tons)
              </p>
            </dt>
            <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalCarbonYield}
              </p>
            </dd>
          </div>
        </dl>
      </div>

      {/* Actions */}
      <div className="my-5 flex justify-end space-x-3">
        <Link
          to="/add-farm"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Add New Farm
        </Link>
        <Link
          to="/become-verifier"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Become a Verifier
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <select
            onChange={(e) => setFilter(e.target.value)}
            value={filter}
            className="border p-2 rounded-md"
          >
            <option value="recent">Recent</option>
            <option value="yield_high_to_low">Yield (High to Low)</option>
            <option value="yield_low_to_high">Yield (Low to High)</option>
          </select>
        </div>
        <input
          type="text"
          placeholder="Search farms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded-md"
        />
      </div>

      {/* Farm List */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Farms on the Platform</h2>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="p-2 text-white bg-red-500 rounded">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farms.map((farm: any) => (
              <div
                key={farm._id}
                className="bg-white shadow-lg rounded-lg overflow-hidden"
              >
                <Link to={`/farm/${farm._id}`}>
                  <img
                    src={farm.thumbnail_image}
                    alt={farm.farm_business_name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold">
                        {farm.farm_business_name}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          farm.status === "Approved"
                            ? "bg-green-200 text-green-800"
                            : "bg-yellow-200 text-yellow-800"
                        }`}
                      >
                        {farm.status === "Approved" ? "Active" : "On-check"}
                      </span>
                    </div>
                    <p className="text-gray-600">{`${farm.land_mass.length}m x ${farm.land_mass.width}m`}</p>
                    <p className="text-gray-600">
                      Carbon Yield: {farm.carbon_credit_yield}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Reg No: {farm._id}
                    </p>
                    <p className="text-sm text-gray-500">
                      Reg Date: {new Date(farm.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Farmer: {farm.user.username}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardScreen;
