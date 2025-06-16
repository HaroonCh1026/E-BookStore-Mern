import React from "react";

const Footer = () => {
  return (
    <footer className="bg-zinc-800 text-white py-4 text-center">
      <h1 className="text-2xl font-semibold">
        &copy; {new Date().getFullYear()}, Made By Haroon Riaz
      </h1>
    </footer>
  );
};

export default Footer;
