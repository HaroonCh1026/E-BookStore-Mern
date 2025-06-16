import React, { useEffect, useState } from "react";
import axios from "axios";

const UserSetting = () => {
  const [value, setValue] = useState({ address: "" });
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "https://e-bookstore-mern.onrender.com/api/v1/get-user-information",
          { headers }
        );
        setProfileData(response.data.user);
        setValue({ address: response.data.user.address });
      } catch (err) {
        console.error("Error fetching user information:", err);
        setError("Failed to load user data.");
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        "http://localhost:4000/api/v1/update-address",
        { address: value.address },
        { headers }
      );
      alert("Address updated successfully!");
    } catch (err) {
      console.error("Error updating address:", err);
      alert("Failed to update address.");
    }
  };

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <>
      {!profileData && (
        <div className="w-full h-full flex items-center justify-center">
          <p>Loading user data...</p>
        </div>
      )}

      {profileData && (
        <div className="h-full p-4 text-zinc-100">
          <h1 className="text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">
            Settings
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label>Username</label>
              <input
                type="text"
                className="p-2 rounded bg-zinc-800 mt-2 font-semibold w-full cursor-not-allowed text-gray-400"
                value={profileData.username}
                readOnly
              />
            </div>
            <div>
              <label>Email</label>
              <input
                type="email"
                className="p-2 rounded bg-zinc-800 mt-2 font-semibold w-full cursor-not-allowed text-gray-400"
                value={profileData.email}
                readOnly
              />
            </div>
            <div>
              <label>Address</label>
              <textarea
                className="p-2 rounded bg-zinc-800 mt-2 font-semibold w-full"
                rows="5"
                placeholder="Address"
                name="address"
                value={value.address}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-yellow-500 text-zinc-900 font-semibold px-3 py-2 rounded hover:bg-yellow-400"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default UserSetting;
