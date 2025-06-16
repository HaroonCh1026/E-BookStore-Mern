import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookCard from '../BookCard/BookCard';

const Favourites = () => {
  const [favouriteBooks, setFavouriteBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavouriteBooks = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("User not authenticated. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:4000/api/v1/get-favourite-books", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFavouriteBooks(response.data.books);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching favourite books:", err);
        setError(err?.response?.data?.message || "An error occurred while fetching favourite books.");
        setLoading(false);
      }
    };

    fetchFavouriteBooks();
  }, []);

  const handleBookRemoved = (bookId) => {
    setFavouriteBooks((prevBooks) => prevBooks.filter((book) => book._id !== bookId));
  };

  if (loading) {
    return <div className="text-center text-white py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">Error: {error}</div>;
  }

  return (
    <>
      {favouriteBooks.length === 0 && (
        <div className="text-5xl font-semibold text-zinc-500 flex items-center justify-center w-full">
          No favourite books
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {favouriteBooks.length > 0 && (
          favouriteBooks.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              favourite={true}
              onBookRemoved={handleBookRemoved}
            />
          ))
        )}
      </div>
    </>
  );
};

export default Favourites;

