import React from 'react';
import "./App.css";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import AllBooks from "./pages/AllBooks";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import ViewBookDetails from "./components/ViewBookDetails/ViewBookDetails";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { authActions } from "./store/auth";
import Favourties from "./components/Profile/Favourties";
import UserSetting from "./components/Profile/UserSetting";
import UserOrderHistory from "./components/Profile/UserOrderHistory";
import AllOrders from "./pages/AllOrders";
import AddBooks from "./pages/AddBooks";
import UpdateBook from "./pages/UpdateBook";

function App() {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);
  useEffect(() => {
    if (
      localStorage.getItem("id") &&
      localStorage.getItem("token") &&
      localStorage.getItem("role")
    ) {
      dispatch(authActions.login());
      dispatch(authActions.changeRole(localStorage.getItem("role")));
    }
  }, []);
  return (
    <>
      <div className="w-screen min-h-screen overflow-hidden">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/all-books" element={<AllBooks />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />}>
            {role === "user" ? (
              <Route index element={<Favourties />} />
            ) : (
              <Route index element={<AllOrders />} />
            )}
            {role === "admin" && (
              <Route path="/profile/add-books" element={<AddBooks />} />
            )}
            <Route
              path="/profile/orderHistory"
              element={<UserOrderHistory />}
            />
            <Route path="/profile/settings" element={<UserSetting />} />
          </Route>
          <Route path="/cart" element={<Cart />} />
          <Route path="/update-book/:id" element={<UpdateBook />} />
          <Route path="/view-book-details/:id" element={<ViewBookDetails />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
}

export default App;
