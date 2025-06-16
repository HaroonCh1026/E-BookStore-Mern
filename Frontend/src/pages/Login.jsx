import React  from 'react'
import { Link, useNavigate } from "react-router-dom";
import {authActions} from "../store/auth";
import { useDispatch } from "react-redux";

import axios from "axios";

const Login = () => {
  const [values, setValues] = React.useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
   const dispatch = useDispatch();

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (values.email === "" || values.password === "") {
        alert("All fields are required");
      } else {
        const response = await axios.post(
          "http://localhost:4000/api/v1/signin",
          values
        );
        dispatch(authActions.login());
        dispatch(authActions.changeRole(response.data.role));
        localStorage.setItem("id" , response.data.id);
        localStorage.setItem("token" , response.data.token);
        localStorage.setItem("role" , response.data.role);
        navigate("/profile");
      }
    } catch (error) {
      alert(error.response.data.message);
    } 
  };

  return (
    <div className="h-auto bg-zinc-900 px-12 py-8 flex items-center justify-center min-h-screen">
      <div className="bg-zinc-800 rounded-lg px-8 py-5 w-full md:w-3/6 lg:w-2/6">
        <p className="text-zinc-200 text-xl">Log In</p>

        <form onSubmit={submit}>
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
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              required
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
              value={values.password}
              onChange={(e) => setValues({ ...values, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-zinc-700 text-white py-2 rounded-lg hover:bg-zinc-600 transition"
          >
            Log In
          </button>
        </form>

        <p className="flex mt-4 items-center justify-center text-zinc-200 font-semibold">
          Or
        </p>

        <p className="flex mt-4 items-center justify-center text-zinc-500 font-semibold">
          Don't have an account? &nbsp;
          <Link to="/signup" className="text-blue-500 hover:text-blue-400">
            <u>Sign Up</u>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
