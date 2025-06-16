import React, { useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";
import { useNavigate } from "react-router-dom"
import { AiFillDelete } from "react-icons/ai";
import axios from "axios";

const Cart = () => {
  const [Cart, setCart] = useState([]);
  const [Total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
 
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/get-cart",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.status === "Success") {
          const cartItems = response.data.cart;
          setCart(cartItems);

        
          const totalAmount = cartItems.reduce(
            (acc, item) => acc + item.price,
            0
          );
          setTotal(totalAmount);
        } else {
          console.error("Failed to fetch cart:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

 
  const deleteCartItem = async (itemId) => {
    try {
      const response = await axios.put(
        "http://localhost:4000/api/v1/remove-from-cart",
        { bookid: itemId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.status === "Success") {
        const updatedCart = Cart.filter((item) => item._id !== itemId);
        setCart(updatedCart);

      
        const totalAmount = updatedCart.reduce(
          (acc, item) => acc + item.price,
          0
        );
        setTotal(totalAmount);
        alert(response.data.message);
      } else {
        console.error("Failed to delete item:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };
  const PlaceOrder = async () => {
    try {
      if (Cart.length === 0) {
        alert("Your cart is empty. Please add books before placing an order.");
        return;
      }
  
      const response = await axios.post(
        "http://localhost:4000/api/v1/place-order",
         { books: Cart.map((item) => item._id) },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, 
          },
        }
      );
  
      if (response.data.status === "Success") {
        alert("🎉 Order placed successfully!");
  
        
        setCart([]);
        setTotal(0); 
  
        
        navigate("/profile/orderHistory");
      } else {
        console.error("Order placement failed:", response.data.message);
        alert("⚠️ Failed to place the order. Please try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("❌ An error occurred while placing the order.");
    }
  };
  

  return (
    <div className="bg-zinc-900 px-12 py-8 h-screen">
      {loading && <Loader />}
      {!loading && Cart.length === 0 && (
        <div className="h-screen">
          <div className="h-[100%] flex items-center justify-center flex-col">
            <h1 className="text-5xl lg:text-6xl font-semibold text-zinc-400">
              Empty Cart
            </h1>
          </div>
        </div>
      )}

      {Cart.length > 0 && (
        <>
          <h1 className="text-5xl font-semibold text-zinc-500 mb-8">
            Your Cart
          </h1>
          {Cart.map((items, i) => (
            <div
              className="w-full my-4 rounded flex flex-col md:flex-row p-4 bg-zinc-800 justify-between items-center"
              key={i}
            >
              <img
                src={items.url}
                alt={items.title || "Item Image"}
                className="h-[20vh] md:h-[10vh] object-cover"
              />
              <div className="w-full md:w-auto">
                <h1 className="text-2xl text-zinc-100 font-semibold text-start mt-2 md:mt-0">
                  {items.title || "No Title"}
                </h1>
                <p className="text-normal text-zinc-300 mt-2 hidden lg:block">
                  {(items.desc || "").slice(0, 100)}
                </p>
                <p className="text-normal text-zinc-300 mt-2 hidden md:block lg:hidden">
                  {(items.desc || "").slice(0, 65)}
                </p>
                <p className="text-normal text-zinc-300 mt-2 block md:hidden">
                  {(items.desc || "").slice(0, 100)}
                </p>
              </div>

              <div className="flex mt-4 w-full md:w-auto items-center justify-between">
                <h2 className="text-zinc-100 text-3xl font-semibold flex">
                  ${items.price?.toFixed(2) || "0.00"}
                </h2>
                <button
                  className="bg-red-100 text-red-700 border border-red-700 rounded p-2 ms-12"
                  onClick={() => deleteCartItem(items._id)} 
                >
                  <AiFillDelete />
                </button>
              </div>
            </div>
          ))}
          {Cart && Cart.length > 0 && (
            <div className="mt-4 w-full flex items-center justify-end">
              <div className="p-4 bg-zinc-800 rounded">
                <h1 className="text-3xl text-zinc-200 font-semibold">
                  Total Amount
                </h1>
                <div className="mt-3 flex items-center justify-between text-xl text-zinc-200">
                  <h2>{Cart.length} books</h2>
                  <h2>${Total}</h2>
                </div>
                <div className="w-[100%] mt-3">
                  <button
                    className="bg-zinc-100 rounded px-4 py-2 flex justify-center w-full font-semibold hover:bg-zinc-200"
                    onClick={PlaceOrder}
                  >
                    Place your order
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Cart;
