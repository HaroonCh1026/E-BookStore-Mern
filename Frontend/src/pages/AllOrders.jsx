import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { VscGoToSearch } from "react-icons/vsc";
import SeeUserData from "./SeeUserData";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userDiv, setUserDiv] = useState("hidden");
  const [userDivData, setUserDivData] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        };

        const response = await axios.get(
          "http://localhost:4000/api/v1/get-all-orders",
          { headers }
        );

        setOrders(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      await axios.put(
        `http://localhost:4000/api/v1/update-status/${orderId}`,
        JSON.stringify({ status: newStatus }),
        { headers }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Failed to update status", error);
      alert(
        error.response?.data?.message || "An error occurred while updating the status."
      );
    }
  };

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="h-full p-4 text-zinc-100">
        <h1 className="text-3xl md:text-4xl font-semibold text-zinc-500 mb-6 text-center">
          All Orders
        </h1>
        <div className="overflow-x-auto">
          <table className="w-full max-w-4xl mx-auto bg-zinc-800 rounded-md shadow-md text-sm md:text-base">
            <thead>
              <tr className="bg-zinc-700 text-white text-center">
                <th className="p-2">Sr.</th>
                <th className="p-2">Books</th>
                <th className="p-2 hidden md:table-cell">Description</th>
                <th className="p-2">Price</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
                <th className="p-2">
                  <FaUser />
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((items, i) => (
                <tr
                  key={items._id}
                  className="text-center hover:bg-zinc-900 transition duration-300"
                >
                  <td className="p-2">{i + 1}</td>
                  <td className="p-2">
                    {items.books && items.books.length > 0 ? (
                      <Link
                        to={`/view-book-details/${items.books[0]._id}`}
                        className="hover:text-blue-300"
                      >
                        {items.books[0].title || "N/A"}
                      </Link>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="p-2 hidden md:table-cell">
                    {items.books &&
                    items.books.length > 0 &&
                    items.books[0].description
                      ? items.books[0].description.slice(0, 50) + "..."
                      : "N/A"}
                  </td>
                  <td className="p-2">
                    {items.books &&
                    items.books.length > 0 &&
                    items.books[0].price
                      ? `$${items.books[0].price}`
                      : "N/A"}
                  </td>
                  <td
                    className={`p-2 font-semibold ${
                      {
                        "Order placed": "text-yellow-500",
                        Cancelled: "text-red-500",
                      }[items.status] || "text-green-500"
                    }`}
                  >
                    {items.status || "N/A"}
                  </td>
                  <td className="p-2">
                    <select
                      name="status"
                      className="bg-gray-800 text-white p-1 rounded hover:bg-zinc-900"
                      value={items.status}
                      onChange={(e) =>
                        handleStatusChange(items._id, e.target.value)
                      }
                    >
                      {[
                        "Pending",
                        "Ordered placed",
                        "Out for delivery",
                        "Delivered",
                        "Cancelled",
                      ].map((statusOption, index) => (
                        <option key={index} value={statusOption}>
                          {statusOption}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => {
                        setUserDiv("fixed");
                        setUserDivData(items.user || {});
                      }}
                    >
                      <VscGoToSearch />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {userDiv === "fixed" && (
        <SeeUserData
          userDivData={userDivData}
          userDiv={userDiv}
          setUserDiv={setUserDiv}
        />
      )}
    </>
  );
};

export default AllOrders;
