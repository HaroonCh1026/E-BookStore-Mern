import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../Loader/Loader";
import { GrLanguage } from "react-icons/gr";
import { FaHeart } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";

const ViewBookDetails = () => {
  const [data, setData] = useState(null);
  const { id } = useParams();

  const navigate = useNavigate()

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/v1/get-book-by-id/${id}`
        );
        setData(response.data.book); 
      } catch (error) {
        console.error("Error fetching book:", error);
      }
    };
    fetchBooks();
  }, [id]);

  const handleFavourite = async (bookId) => {
    try {
      if (!bookId) {
        console.error("Book ID is required");
        return;
      }

     
      const token = localStorage.getItem("token");

      if (!token) {
        alert("User not authenticated. Please log in.");
        return;
      }

      const response = await axios.put(
        "http://localhost:4000/api/v1/add-book-to-favourite",
        { bookid: bookId },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data.message);
      alert("Book added to favourites successfully!");
    } catch (error) {
      if (error.response) {
        console.error("Error:", error.response);
        alert(
          `Error: ${error.response.data.message || error.response.statusText}`
        );
      } else {
        console.error("Error:", error.message);
        alert(`Error: ${error.message}`);
      }
    }
  };

  const handleCart = async (bookId) => {
    try {
      if (!bookId) {
        console.error("Book ID is required");
        return;
      }
  
      
      const token = localStorage.getItem("token");
  
      if (!token) {
        alert("User not authenticated. Please log in.");
        return;
      }
  
      
      const response = await axios.put(
        "http://localhost:4000/api/v1/add-to-cart", 
        { bookid: bookId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
     
      console.log(response.data.message);
      alert(response.data.message);
    } catch (error) {
     
      if (error.response) {
        console.error("Error:", error.response);
        alert(
          `Error: ${error.response.data.message || error.response.statusText}`
        );
      } else {
        console.error("Error:", error.message);
        alert(`Error: ${error.message}`);
      }
    }
  };
  

  const handleDeleteBook = async (bookId) => {
    try {

      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("id");

      if (!token || !userId) {
        alert("Unauthorized. Please log in.");
        return;
      }

      const headers = {
        id: userId,
        authorization: `Bearer ${token}`,
        bookid: bookId, 
      };

      const response = await axios.delete(
        "http://localhost:4000/api/v1/delete-book",
        {
          headers,
        }
      );

      if (response.data.success) {
        alert("Book deleted successfully!");
       
        navigate("/all-books")
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Failed to delete the book. Please try again later.");
    }
  };

  return (
    <div className="bg-zinc-900 px-4 md:px-12 py-8 flex  flex-col lg:flex-row gap-8">
      {data && (
        <>
          <div className=" px-4 w-full lg:w-3/6 ">
            <div className="flex flex-col lg:flex-row justify-around  py-12 bg-zinc-800  rounded">
              <img
                src={data.url}
                alt={data.title}
                className="h-[50vh] md:h[60vh] lg:h-[60vh] rounded"
              />
              {isLoggedIn && role === "user" && (
                <div className="flex flex-col md:flex-row lg:flex-col items-center justify-between lg:justify-start mt-4 lg:mt-0 ">
                  <button
                    className="bg-white rounded lg:rounded-full p-2 text-3xl text-red-500 flex items-center justify-center"
                    onClick={() => handleFavourite(data._id, token)}
                  >
                    <FaHeart />{" "}
                    <span className="ms-4 block lg:hidden">Favourites</span>
                  </button>
                  <button
                    className="text-white rounded mt-8 md:mt-0 lg:rounded-full p-2 text-3xl lg:mt-8 bg-blue-500 flex items-center justify-center "
                    onClick={() => handleCart(data._id)}
                  >
                    <FaCartShopping />
                    <span className="ms-4 block lg:hidden">Cart</span>
                  </button>
                </div>
              )}
              {isLoggedIn && role === "admin" && (
                <div className="flex flex-col md:flex-row lg:flex-col items-center justify-between lg:justify-start mt-4 lg:mt-0 ">
                  <Link to={`/update-book/${id}`} className="bg-white rounded lg:rounded-full p-2 text-3xl flex items-center justify-center">
                    <FaEdit />{" "}
                    <span className="ms-4 block lg:hidden">Edit</span>
                  </Link>
                  <button
                    className=" text-red-500 rounded  mt-8 md:mt-0  lg:rounded-full p-2 text-3xl lg:mt-8 bg-white flex items-center justify-center"
                    onClick={() => handleDeleteBook(data._id)}
                  >
                    <MdDelete />{" "}
                    <span className="ms-4 block lg:hidden">Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 w-full lg:w-3/6">
            <h1 className="text-4xl text-zinc-300 font-semibold">
              {data.title}
            </h1>

            <p className="text-zinc-400 mt-1">by {data.author}</p>

            <p className="text-zinc-500 mt-4 text-xl">{data.description}</p>

            <p className="flex mt-4 items-center justify-start text-zinc-400">
              <GrLanguage className="me-3" /> {data.language}
            </p>

            <p className="mt-4 text-zinc-100 text-3xl font-semibold">
              Price : $ {data.price}{" "}
            </p>
          </div>
        </>
      )}
      {!data && (
        <div className=" h-screen bg-zinc-800 flex items-center justify-center my-8">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default ViewBookDetails;
