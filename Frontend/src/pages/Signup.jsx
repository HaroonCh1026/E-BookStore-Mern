import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [Values, setValues] = React.useState({
    username: "",
    email: "",
    password: "",
    address: "",
  });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      if (
        Values.username === "" &&
        Values.email === "" &&
        Values.password === "" &&
        Values.address === ""
      ) {
        alert("All fields are required");
      } else {
        const response = await axios.post(
          "https://e-bookstore-mern.onrender.com/api/v1/signup",
          Values
        );
        navigate("/login");
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };
  return (
    <div className="h-auto bg-zinc-900 px-12 py-8 flex items-center justify-center min-h-screen">
      <div className="bg-zinc-800 rounded-lg px-8 py-5 w-full md:w-3/6 lg:w-2/6">
        <p className="text-zinc-200 text-xl">Sign Up</p>

        <div className="mt-4">
          <label htmlFor="username" className="text-zinc-400">
            Username
          </label>
          <input
            type="text"
            id="username"
            className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
            placeholder="username"
            name="username"
            required
            value={Values.username}
            onChange={(e) => setValues({ ...Values, username: e.target.value })}
          />
        </div>

        <div className="mt-4">
          <label htmlFor="email" className="text-zinc-400">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
            placeholder="xyz@gmail.com"
            name="email"
            required
            value={Values.email}
            onChange={(e) => setValues({ ...Values, email: e.target.value })}
          />
        </div>

        <div className="mt-4">
          <label htmlFor="password" className="text-zinc-400">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
            placeholder="password"
            name="password"
            required
            value={Values.password}
            onChange={(e) => setValues({ ...Values, password: e.target.value })}
          />
        </div>

        <div className="mt-4">
          <label htmlFor="address" className="text-zinc-400">
            Address
          </label>
          <textarea
            id="address"
            className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none h-24"
            placeholder="address"
            name="address"
            required
            value={Values.address}
            onChange={(e) => setValues({ ...Values, address: e.target.value })}
          />
        </div>

        <button
          onClick={submit}
          className="w-full mt-6 bg-zinc-700 text-white py-2 rounded-lg hover:bg-zinc-600 transition"
        >
          Sign Up
        </button>
        <p className="flex mt-4 items-center justify-center text-zinc-200 font-semibold">
          Or
        </p>

        <p className="flex mt-4 items-center justify-center text-zinc-500 font-semibold">
          Already have an account? &nbsp;
          <Link to="/login" className="text-blue-500 hover:text-blue-400">
            <u>Log In</u>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
