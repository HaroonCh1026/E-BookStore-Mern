import React, { useEffect, useState } from 'react'
import { useNavigate ,useParams } from 'react-router-dom';
import axios from 'axios';

const UpdateBook = () => {
    const [Data, setData] = useState({
        url: "",
        title: "",
        author: "",
        price: "",
        description: "",
        language: "",
      });
    
      const headers = {
        id: localStorage.getItem("id"),
        authorization: `Bearer ${localStorage.getItem("token")}`,
      };
      
    
      const change = (e) => {
        const { name, value } = e.target;
        setData({ ...Data, [name]: value });
      };
    
      const navigate = useNavigate();
       const { id } = useParams();
       const submit = async () => {
        try {
          const { url, title, author, price, description, language } = Data;
          if (!url || !title || !author || !price || !description || !language) {
            alert("All fields are required");
            return;
          }
      
          const response = await axios.put(
            "http://localhost:4000/api/v1/update-book", 
            Data,
            { 
              headers: { 
                ...headers, 
                bookid: id 
              } 
            }
          );
      
          if (response.data.success) {
            alert("Book updated successfully!");
            setData({
              url: "",
              title: "",
              author: "",
              price: "",
              description: "",
              language: "",
            });
            navigate("/all-books");
          } else {
            alert(response.data.message);
          }
        } catch (error) {
          console.error("Error updating book:", error);
          alert("Failed to update book. Please try again.");
        }
      };
      
      useEffect(() => {
        const fetchBooks = async () => {
          try {
            const response = await axios.get(
              `http://localhost:4000/api/v1/get-book-by-id/${id}`
            );
            setData(response.data.book); 
            console.log(response.data)
          } catch (error) {
            console.error("Error fetching book:", error);
          }
        };
        fetchBooks();
      }, [id]);
    
    
  return (
    <div className="bg-zinc-900 h-[100%] p-0 md:p-4">
    <h1 className="text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">Update Book</h1>
    <div className="p-4 bg-zinc-800 rounded">
      <div>
        <label className="text-zinc-400">Image</label>
        <input
          type="text"
          className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
          placeholder="URL of image"
          name="url"
          value={Data.url}
          onChange={change}
        />
      </div>

      <div className="mt-4">
        <label className="text-zinc-400">Title of Book</label>
        <input
          type="text"
          className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
          placeholder="Title of the book"
          name="title"
          value={Data.title}
          onChange={change}
        />
      </div>

      <div className="mt-4">
        <label className="text-zinc-400">Author of Book</label>
        <input
          type="text"
          className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
          placeholder="Author of book"
          name="author"
          value={Data.author}
          onChange={change}
        />
      </div>

      <div className="mt-4 flex gap-4">
        <div className="w-3/6">
          <label className="text-zinc-400">Language</label>
          <input
            type="text"
            className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
            placeholder="Language of book"
            name="language"
            value={Data.language}
            onChange={change}
          />
        </div>
        <div className="w-3/6">
          <label className="text-zinc-400">Price</label>
          <input
            type="text"
            className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
            placeholder="Price of book"
            name="price"
            value={Data.price}
            onChange={change}
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="text-zinc-400">Description of Book</label>
        <textarea
          className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
          rows="5"
          placeholder="Description of book"
          name="description" 
          value={Data.description}
          onChange={change}
        ></textarea>
      </div>

      <button
        className="mt-4 px-3 bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition"
        onClick={submit}
      >
        Update Book
      </button>
    </div>
  </div>
  )
}

export default UpdateBook