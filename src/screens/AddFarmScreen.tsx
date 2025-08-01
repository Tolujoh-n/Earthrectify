import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../components/UserContext"; // adjust path

const AddFarmScreen = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [farmBusinessName, setFarmBusinessName] = useState("");
  const [country, setCountry] = useState("");
  const [farmAddress, setFarmAddress] = useState("");
  const [landLength, setLandLength] = useState("");
  const [landWidth, setLandWidth] = useState("");
  const [isNewFarm, setIsNewFarm] = useState(true);
  const [ownershipDocs, setOwnershipDocs] = useState<File | null>(null);
  const [landPhotos, setLandPhotos] = useState<File[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [farms, setFarms] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.token) {
      navigate("/login");
    }
  }, [user, navigate]);

  // optional: fetch farms to display
  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const res = await axios.get("/api/farms");
        setFarms(res.data);
      } catch {}
    };
    fetchFarms();
  }, []);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user?.token) {
      setError("You must be logged in");
      return;
    }

    const formData = new FormData();
    formData.append("farm_business_name", farmBusinessName);
    formData.append("country", country);
    formData.append("farm_address", farmAddress);
    formData.append(
      "land_mass",
      JSON.stringify({ length: landLength, width: landWidth })
    );
    formData.append("is_new_farm", String(isNewFarm));
    ownershipDocs && formData.append("land_ownership_documents", ownershipDocs);
    landPhotos.forEach((file) => formData.append("land_photos", file));
    thumbnail && formData.append("thumbnail_image", thumbnail);
    formData.append("phone_number", phoneNumber);

    try {
      setLoading(true);
      await axios.post("/api/farms", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      });
      setLoading(false);
      navigate("/profile");
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || err.message);
    }
  };
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Add a New Farm</h1>
      {error && (
        <div className="p-2 text-white bg-red-500 rounded">{error}</div>
      )}
      {loading && (
        <div className="p-2 text-white bg-blue-500 rounded">Loading...</div>
      )}
      <form onSubmit={submitHandler} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Farm Business Name
          </label>
          <input
            type="text"
            value={farmBusinessName}
            onChange={(e) => setFarmBusinessName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Country
          </label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Farm Address
          </label>
          <input
            type="text"
            value={farmAddress}
            onChange={(e) => setFarmAddress(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Land Mass
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Length (meters)"
              value={landLength}
              onChange={(e) => setLandLength(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
            <input
              type="number"
              placeholder="Width (meters)"
              value={landWidth}
              onChange={(e) => setLandWidth(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Is this a new farm?
          </label>
          <div className="mt-1">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="isNewFarm"
                checked={isNewFarm}
                onChange={() => setIsNewFarm(true)}
                className="form-radio"
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center ml-6">
              <input
                type="radio"
                name="isNewFarm"
                checked={!isNewFarm}
                onChange={() => setIsNewFarm(false)}
                className="form-radio"
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Land Ownership Documents
          </label>
          <input
            type="file"
            onChange={(e) =>
              setOwnershipDocs(e.target.files ? e.target.files[0] : null)
            }
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Land Photos
          </label>
          <input
            type="file"
            multiple
            onChange={(e) => setLandPhotos(Array.from(e.target.files || []))}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Set Thumbnail Image
          </label>
          <input
            type="file"
            onChange={(e) =>
              setThumbnail(e.target.files ? e.target.files[0] : null)
            }
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddFarmScreen;
