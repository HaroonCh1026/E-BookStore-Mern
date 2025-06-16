import React from "react";
import { FaGripLines } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Navbar = () => {
  const links = [
    {
      title: "Home",
      link: "/",
    },
    {
      title: "All Books",
      link: "/all-books",
    },
    {
      title: "Cart",
      link: "/cart",
    },
    {
      title: "Profile",
      link: "/profile",
    },
    {
      title: "Admin Profile",
      link: "/profile",
    },
  ];
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role)

  const filteredLinks = links.filter((item) => {
    if (!isLoggedIn) {
      return item.title !== "Cart" && item.title !== "Profile" && item.title !== "Admin Profile";
    }
    if (role === "user") {
      return item.title !== "Admin Profile";
    }
    if (role === "admin") {
      return item.title !== "Profile" && item.title !== "Cart";
    }
    return true;
  });

  const [mobileview, setMobileView] = React.useState(false);

  return (
    <>
      <nav className="z-50 relative flex items-center justify-between bg-zinc-800 text-white px-8 py-4">
        {/* Logo Section */}
        <div className="flex items-center">
          <img
            className="h-10 mr-4"
            src="https://cdn-icons-png.flaticon.com/128/10433/10433049.png"
            alt="logo"
          />
          <h1 className="text-2xl font-semibold">BookHeaven</h1>
        </div>

        {/* Navigation Links */}
        <div className="nav-links-bookheaven block md:flex items-center gap-4">
          <div className="hidden md:flex gap-4">
            {filteredLinks.map((item) => (
              <div key={item.link} className="flex items-center justify-center">
                {item.title === "Profile" || item.title === "Admin Profile" ? (
                  <Link
                    to={item.link}
                    className="hover:text-blue-500 border border-blue-500 px-2 py-1 rounded hover:bg-white transition duration-300"
                  >
                    {item.title}
                  </Link>
                ) : (
                  <Link
                    to={item.link}
                    className="hover:text-blue-500 transition duration-300"
                  >
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
          </div>
          {!isLoggedIn && (
            <div className="hidden md:flex gap-4">
              <Link
                to="/login"
                className="border border-blue-500 px-2 py-1 rounded hover:bg-white hover:text-zinc-800 transition duration-300"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="bg-blue-500 px-2 py-1 rounded hover:bg-white hover:text-zinc-800 transition duration-300"
              >
                Sign Up
              </Link>
            </div>
          )}
          <div className="md:hidden block">
            <button
              className="text-white text-2xl hover:text-zinc-400"
              onClick={() => setMobileView(!mobileview)}
            >
              <FaGripLines />
            </button>
          </div>
        </div>
      </nav>
      {mobileview && (
        <div className="absolute bg-zinc-800 h-screen top-0 left-0 w-full z-40 flex flex-col justify-center items-center">
          {links.map((item) => (
            <Link
              key={item.link}
              to={item.link}
              className="text-white text-4xl mb-8 font-semibold hover:text-blue-500 transition duration-300"
            >
              {item.title}
            </Link>
          ))}
          {!isLoggedIn && (
            <>
              <Link
                to="/login"
                className="mb-8 text-3xl font-semibold border border-blue-500 px-8 py-2 rounded text-white hover:bg-white hover:text-zinc-800 transition duration-300"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="mb-8 text-3xl font-semibold bg-blue-500 px-8 py-2 rounded hover:bg-white hover:text-zinc-800 transition duration-300"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
