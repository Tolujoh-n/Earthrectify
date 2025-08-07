import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../components/UserContext";
import { BACKEND_URL } from "../config/constants";

const BecomeVerifierScreen = () => {
  const { user, setUser } = useUser();
  const [idType, setIdType] = useState("NIN");
  const [idNumber, setIdNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [activeMail, setActiveMail] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

    const formData = new FormData();
    formData.append("idType", idType);
    formData.append("idNumber", idNumber);
    formData.append("phoneNumber", phoneNumber);
    formData.append("activeMail", activeMail);
    if (image) formData.append("image", image);

    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.put(
        `${BACKEND_URL}/api/users/become-verifier`,
        formData,
        config
      );
      setLoading(false);
      // Update local storage with new user info
      const { data } = await axios.get(
        `${BACKEND_URL}/api/users/profile`,
        config
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/");
    } catch (error: any) {
      setLoading(false);
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Become a Verifier</h1>
      {error && (
        <div className="p-2 text-white bg-red-500 rounded">{error}</div>
      )}
      {loading && (
        <div className="p-2 text-white bg-blue-500 rounded">Loading...</div>
      )}
      <form onSubmit={submitHandler} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            ID Type
          </label>
          <select
            value={idType}
            onChange={(e) => setIdType(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option>NIN</option>
            <option>VoterCard</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            ID Number
          </label>
          <input
            type="text"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
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
          <label className="block text-sm font-medium text-gray-700">
            Active Mail
          </label>
          <input
            type="email"
            value={activeMail}
            onChange={(e) => setActiveMail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Image
          </label>
          <input
            type="file"
            onChange={(e) =>
              setImage(e.target.files ? e.target.files[0] : null)
            }
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
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

export default BecomeVerifierScreen;
