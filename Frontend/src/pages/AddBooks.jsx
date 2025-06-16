import React, { useState } from "react";
import axios from "axios";

const AddBooks = () => {
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

  const submit = async () => {
    try {
      const { url, title, author, price, description, language } = Data;
      if (!url || !title || !author || !price || !description || !language) {
        alert("All fields are required");
        return;
      }

      const response = await axios.post(
        "http://localhost:4000/api/v1/add-book", 
        Data,
        { headers }
      );

      if (response.data.success) {
        alert("Book added successfully!");
        setData({
          url: "",
          title: "",
          author: "",
          price: "",
          description: "",
          language: "",
        });
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error adding book:", error);
      alert("Failed to add book. Please try again.");
    }
  };

  return (
    <div className="h-[100%] p-0 md:p-4">
      <h1 className="text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">Add Book</h1>
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
              name="price" // Fixed casing issue
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
            name="description" // Fixed field name
            value={Data.description}
            onChange={change}
          ></textarea>
        </div>

        <button
          className="mt-4 px-3 bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition"
          onClick={submit}
        >
          Add Book
        </button>
      </div>
    </div>
  );
};

export default AddBooks;
