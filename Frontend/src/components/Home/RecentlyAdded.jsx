import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookCard from '../BookCard/BookCard'; 
import Loader from '../Loader/Loader';

const Recently = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('https://e-bookstore-mern.onrender.com/api/v1/get-recent-books');
        setData(response.data.books);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div className="mt-12 px-4 h-screen">
      <h4 className="text-3xl text-yellow-100 font-semibold flex lg:items-center lg:justify-center lg:mt-5">Recently Added Books</h4>
      <div className="my-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {loading ? (
          <div className='flex items-center justify-center my-8'> <Loader /></div>
         
        ) : (
          data.length > 0 ? (
            data.map((book) => <BookCard key={book._id} book={book} />)
          ) : (
            <p className="text-gray-400 text-lg">No recent books available.</p>
          )
        )}
      </div>
    </div>
  );
};

export default Recently;

