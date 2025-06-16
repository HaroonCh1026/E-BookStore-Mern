import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import { Link } from "react-router-dom";

const UserOrderHistory = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await axios.get(
          "https://e-bookstore-mern.onrender.com/api/v1/get-order-history",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.status === "Success") {
          setOrderHistory(response.data.data);
        } else {
          setError("Failed to fetch order history.");
        }
      } catch (err) {
        console.error("Error fetching order history:", err);
        setError("An error occurred while fetching order history.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="text-red-500 text-center mt-4">
        <p>{error}</p>
      </div>
    );

  if (orderHistory.length === 0)
    return (
      <div className="h-[80vh] p-4 text-zinc-100 flex flex-col items-center justify-center">
        <h1 className="text-5xl font-semibold text-zinc-500 mb-8">
          No Order History
        </h1>
        <img
          src="https://cdn-icons-png.flaticon.com/128/9961/9961218.png"
          alt="No Orders"
          className="h-[20vh] mb-8"
        />
      </div>
    );

  return (
    <div className="h-[100%] p-4 text-zinc-100">
      <h1 className="text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">
        Your Order History
      </h1>

      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full bg-zinc-800 text-zinc-100 border border-zinc-700">
          <thead className="bg-zinc-900 sticky top-0 z-10">
            <tr>
              <th className="border-b border-zinc-700 p-3 text-center">#</th>
              <th className="border-b border-zinc-700 p-3 text-left">Books</th>
              <th className="border-b border-zinc-700 p-3 text-left">Description</th>
              <th className="border-b border-zinc-700 p-3 text-center">Price</th>
              <th className="border-b border-zinc-700 p-3 text-center">Status</th>
              <th className="border-b border-zinc-700 p-3 text-center hidden md:table-cell">Mode</th>
            </tr>
          </thead>

          <tbody>
            {orderHistory.map((order, i) => (
              <tr
                key={i}
                className="hover:bg-zinc-700 transition duration-200"
              >
                <td className="border-b border-zinc-700 p-3 text-center">{i + 1}</td>

                <td className="border-b border-zinc-700 p-3">
                  {order.books && order.books.length > 0 ? (
                    order.books.map((book, index) => (
                      <Link
                        key={index}
                        to={`/view-book-details/${book._id}`}
                        className="hover:text-blue-300 block"
                      >
                        {book.title || "Untitled Book"}
                      </Link>
                    ))
                  ) : (
                    <p className="text-red-400">No Book Details</p>
                  )}
                </td>

                <td className="border-b border-zinc-700 p-3">
                  {order.books && order.books.length > 0 ? (
                    order.books.map((book, index) => (
                      <p key={index}>
                        {(book.description || "No Description").slice(0, 50)}...
                      </p>
                    ))
                  ) : (
                    <p className="text-red-400">No Description</p>
                  )}
                </td>

                <td className="border-b border-zinc-700 p-3 text-center">
                  {order.books && order.books.length > 0 ? (
                    order.books.map((book, index) => (
                      <p key={index}>$ {book.price?.toFixed(2) || "0.00"}</p>
                    ))
                  ) : (
                    <p>$ 0.00</p>
                  )}
                </td>

                <td className="border-b border-zinc-700 p-3 text-center">
                  <span
                    className={`font-semibold ${
                      order.status === "Order placed"
                        ? "text-yellow-500"
                        : order.status === "Cancelled"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="border-b border-zinc-700 p-3 text-center hidden md:table-cell">
                  <p className="text-sm text-zinc-400">COD</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserOrderHistory;
