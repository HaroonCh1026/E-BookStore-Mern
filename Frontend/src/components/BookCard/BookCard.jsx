import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BookCard = ({ book, favourite, onBookRemoved }) => {
  const handleRemoveBook = async (bookId) => {
    try {
      const response = await axios.put(
        "http://localhost:4000/api/v1/remove-book-from-favourite",
        { bookid: bookId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, 
          },
        }
      );

      if (response.status === 200) {
        alert("Book removed from favourites");
        if (onBookRemoved) {
          onBookRemoved(bookId); 
        }
      }
    } catch (error) {
      console.error(
        "Error removing book from favourites:",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <div className="bg-zinc-800 rounded p-4 flex flex-col">
      <Link to={`/view-book-details/${book._id}`}>
        <div>
          <div className="bg-zinc-900 rounded flex items-center justify-center">
            <img src={book.url} alt={book.title} className="h-[25vh]" />
          </div>
          <h2 className="mt-4 text-xl text-white font-semibold">{book.title}</h2>
          <p className="mt-2 text-zinc-400 font-semibold">by {book.author}</p>
          <p className="mt-2 text-zinc-200 font-semibold text-xl">$ {book.price}</p>
        </div>
      </Link>
      {favourite && (
        <button
          className="bg-yellow-50 px-4 py-2 rounded border border-yellow-500 text-yellow-500 mt-4"
          onClick={() => handleRemoveBook(book._id)}
        >
          Remove from favourite
        </button>
      )}
    </div>
  );
};

export default BookCard;
