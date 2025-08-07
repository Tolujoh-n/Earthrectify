import React, { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Modal from "../components/Modal";
import { useUser } from "../components/UserContext";
import { BACKEND_URL } from "../config/constants";

const FarmDetailsScreen = () => {
  const { user, setUser } = useUser();
  const { id } = useParams<{ id: string }>();
  const [farm, setFarm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("activity");
  const [comment, setComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [landLength, setLandLength] = useState("");
  const [landWidth, setLandWidth] = useState("");
  const [activityComment, setActivityComment] = useState("");
  const [submittingActivity, setSubmittingActivity] = useState(false);
  const navigate = useNavigate();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reporterName, setReporterName] = useState("");
  const [reporterEmail, setReporterEmail] = useState("");
  const [reportText, setReportText] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [farmName, setFarmName] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const isOwner = farm && userInfo && farm.user === userInfo._id;
  const isVerifier = userInfo.isVerifier;

  useEffect(() => {
    const fetchFarm = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/api/farms/${id}`);
        console.log("Fetched farm data:", data);
        setFarm(data);
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

    fetchFarm();
  }, [id]);

  useEffect(() => {
    if (farm) {
      setLandLength(farm.land_mass.length);
      setLandWidth(farm.land_mass.width);
      setFarmName(farm.farm_business_name);
    }
  }, [farm]);

  const commentSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();
    setSubmittingComment(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.post(
        `${BACKEND_URL}/api/farms/${id}/comments`,
        { comment },
        config
      );
      setSubmittingComment(false);
      setComment("");
      // Refetch farm to see new comment
      const { data } = await axios.get(`${BACKEND_URL}/api/farms/${id}`);
      setFarm(data);
    } catch (error) {
      setSubmittingComment(false);
      // Handle error
    }
  };

  const updateHandler = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.put(
        `${BACKEND_URL}/api/farms/${id}`,
        { land_mass: { length: landLength, width: landWidth } },
        config
      );
      setFarm(data);
      setIsModalOpen(false);
    } catch (error) {
      // Handle error
    }
  };

  const deleteHandler = async () => {
    if (window.confirm("Are you sure you want to delete this farm?")) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        await axios.delete(`${BACKEND_URL}/api/farms/${id}`, config);
        navigate("/");
      } catch (error) {
        // Handle error
      }
    }
  };

  const damagedHandler = async () => {
    if (
      window.confirm(
        "Are you sure you want to mark this farm as damaged? This will stop carbon credit yield."
      )
    ) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.put(
          `${BACKEND_URL}/api/farms/${id}`,
          { status: "Damaged" },
          config
        );
        setFarm(data);
      } catch (error) {
        // Handle error
      }
    }
  };

  const activitySubmitHandler = async (e: FormEvent) => {
    e.preventDefault();
    setSubmittingActivity(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.post(
        `${BACKEND_URL}/api/farms/${id}/activities`,
        { comment: activityComment },
        config
      );
      setSubmittingActivity(false);
      setActivityComment("");
      // Refetch farm to see new activity
      const { data } = await axios.get(`${BACKEND_URL}/api/farms/${id}`);
      setFarm(data);
    } catch (error) {
      setSubmittingActivity(false);
      // Handle error
    }
  };

  const reportSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.post(
        `${BACKEND_URL}/api/farms/${id}/report`,
        { reporterName, reporterEmail, reportText },
        config
      );
      setIsReportModalOpen(false);
      setReporterName("");
      setReporterEmail("");
      setReportText("");
      // Refetch farm to see new report
      const { data } = await axios.get(`${BACKEND_URL}/api/farms/${id}`);
      setFarm(data);
    } catch (error) {
      // Handle error
    }
  };

  const editHandler = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const formData = new FormData();
      if (thumbnail) {
        formData.append("thumbnail_image", thumbnail);
      }
      formData.append("farm_business_name", farmName);
      formData.append(
        "land_mass",
        JSON.stringify({ length: landLength, width: landWidth })
      );

      const { data } = await axios.put(
        `${BACKEND_URL}/api/farms/${id}`,
        formData,
        config
      );
      setFarm(data);
      setIsEditModalOpen(false);
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div className="p-4">
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="p-2 text-white bg-red-500 rounded">{error}</div>
      ) : farm ? (
        <>
          <div className="relative">
            <img
              src={farm.thumbnail_image}
              alt={farm.farm_business_name}
              className="w-full h-64 object-cover rounded-lg"
            />
            {isOwner && (
              <div className="absolute top-2 right-2 flex items-center space-x-2">
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-200 text-blue-800">
                  Your Farm
                </span>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="p-2 bg-white rounded-full shadow"
                >
                  {/* Edit icon */}
                </button>
              </div>
            )}
          </div>
          <div className="mt-4">
            <h1 className="text-3xl font-bold">{farm.farm_business_name}</h1>
            {/* other details */}
          </div>

          <div className="border-b border-gray-200 mt-4">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("activity")}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "activity"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Activity
              </button>
              <button
                onClick={() => setActiveTab("review")}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "review"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Review
              </button>
              <button
                onClick={() => setActiveTab("comments")}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "comments"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Comments
              </button>
            </nav>
          </div>

          <div className="mt-4">
            {activeTab === "activity" && (
              <div>
                <h3 className="text-xl font-bold mb-2">Activity</h3>
                {(isOwner || isVerifier) && (
                  <form onSubmit={activitySubmitHandler}>
                    <textarea
                      value={activityComment}
                      onChange={(e) => setActivityComment(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      rows={3}
                      placeholder="Add a new activity..."
                      required
                    ></textarea>
                    <button
                      type="submit"
                      disabled={submittingActivity}
                      className="mt-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                      {submittingActivity ? "Submitting..." : "Submit Activity"}
                    </button>
                  </form>
                )}
                <div className="mt-4 space-y-4">
                  {farm.activities.map((a: any) => (
                    <div key={a._id} className="p-4 bg-gray-100 rounded-lg">
                      <p className="font-bold">{a.username}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(a.createdAt).toLocaleString()}
                      </p>
                      <p className="mt-2">{a.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === "review" && (
              <div>
                <h3 className="text-xl font-bold mb-2">Review</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Map Section */}
                    <div className="md:w-2/3 w-full">
                      <h4 className="font-bold mb-2">Farm Location</h4>
                      <MapContainer
                        center={[51.505, -0.09]}
                        zoom={13}
                        scrollWheelZoom={false}
                        style={{ height: "400px", width: "100%" }}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[51.505, -0.09]}>
                          <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                          </Popup>
                        </Marker>
                      </MapContainer>
                    </div>

                    {/* Info Section */}
                    <div className="md:w-1/3 w-full space-y-4">
                      <h4 className="font-bold mb-2">Farm Details</h4>
                      <p className="text-gray-700">Soil Type: Loamy</p>
                      <p className="text-gray-700">Altitude: 250 meters</p>
                      <p className="text-gray-700">Crop: Cassava</p>
                      {/* You can add more info here */}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold mb-2">Land Photos</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {farm.land_photos.map((photo: string, index: number) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`Land photo ${index + 1}`}
                          className="w-full h-auto rounded-lg"
                        />
                      ))}
                    </div>
                    <h4 className="font-bold mt-4 mb-2">
                      Land Ownership Document
                    </h4>
                    <a
                      href={`/${farm.land_ownership_documents}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline"
                    >
                      View Document
                    </a>

                    {(isOwner || isVerifier) && (
                      <div className="mt-4 space-x-2">
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                          Update Farm Parameters
                        </button>
                        <button
                          onClick={damagedHandler}
                          className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
                        >
                          Damaged
                        </button>
                        <button
                          onClick={deleteHandler}
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                        >
                          Delete Farm
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {activeTab === "comments" && (
              <div>
                <h3 className="text-xl font-bold mb-2">Comments</h3>
                <form onSubmit={commentSubmitHandler}>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    placeholder="Add a comment..."
                    required
                  ></textarea>
                  <button
                    type="submit"
                    disabled={submittingComment}
                    className="mt-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    {submittingComment ? "Submitting..." : "Submit"}
                  </button>
                </form>
                <div className="mt-4 space-y-4">
                  {farm.comments.map((c: any) => (
                    <div key={c._id} className="p-4 bg-gray-100 rounded-lg">
                      <p className="font-bold">{c.username}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(c.createdAt).toLocaleString()}
                      </p>
                      <p className="mt-2">{c.comment}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Report Farm
                </button>
              </div>
            )}
          </div>
        </>
      ) : null}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3 className="text-lg font-bold mb-4">Update Farm Parameters</h3>
        <form onSubmit={updateHandler}>
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
          <button
            type="submit"
            className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Update
          </button>
        </form>
      </Modal>
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      >
        <h3 className="text-lg font-bold mb-4">Report Farm</h3>
        <form onSubmit={reportSubmitHandler}>
          <div className="mb-4">
            <label
              htmlFor="reporterName"
              className="block text-sm font-medium text-gray-700"
            >
              Your Name
            </label>
            <input
              type="text"
              id="reporterName"
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="reporterEmail"
              className="block text-sm font-medium text-gray-700"
            >
              Your Email (optional)
            </label>
            <input
              type="email"
              id="reporterEmail"
              value={reporterEmail}
              onChange={(e) => setReporterEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="reportText"
              className="block text-sm font-medium text-gray-700"
            >
              Report Details
            </label>
            <textarea
              id="reportText"
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              rows={4}
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="mt-4 w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Submit Report
          </button>
        </form>
      </Modal>
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h3 className="text-lg font-bold mb-4">Edit Farm Details</h3>
        <form onSubmit={editHandler}>
          <div className="mb-4">
            <label
              htmlFor="farmName"
              className="block text-sm font-medium text-gray-700"
            >
              Farm Business Name
            </label>
            <input
              type="text"
              id="farmName"
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="thumbnail"
              className="block text-sm font-medium text-gray-700"
            >
              Thumbnail Image (optional)
            </label>
            <input
              type="file"
              id="thumbnail"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
              className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
          </div>
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
          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default FarmDetailsScreen;
