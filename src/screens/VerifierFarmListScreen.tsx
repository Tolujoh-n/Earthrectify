import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../config/constants";

const VerifierFarmListScreen = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const { data } = await axios.get(
          `${BACKEND_URL}/api/farms?status=unapproved`
        );
        setFarms(data);
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

    fetchFarms();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Verifier Farm List</h1>
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
                  src={`/${farm.thumbnail_image}`}
                  alt={farm.farm_business_name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold">
                      {farm.farm_business_name}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-800`}
                    >
                      {farm.status}
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
  );
};

export default VerifierFarmListScreen;
