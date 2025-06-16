import React, { useEffect, useState } from 'react'
import Loader from '../components/Loader/Loader'
import axios from 'axios'
import BookCard from '../components/BookCard/BookCard';

const AllBooks = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('https://e-bookstore-mern.onrender.com/api/v1/get-all-books');
        setData(response.data.books);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div className='bg-zinc-900 h-auto px-12 py-8 lg:h-screen'>
      <h4 className='text-3xl text-yellow-100'>All Books</h4>
      {!data ? (
        <div className='flex items-center justify-center my-8'><Loader /></div>
      ) : (
        <div className='my-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8'>
          {data.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </div>
  )
}

export default AllBooks
